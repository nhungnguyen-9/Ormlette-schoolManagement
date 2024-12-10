import { FormModal } from "@/components/form-modal";
import { Pagination } from "@/components/pagination";
import { Table } from "@/components/table";
import { TableSearch } from "@/components/table-search";
import prisma from "@/lib/db";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { ArrowDownUp, SlidersHorizontal } from "lucide-react";

const { userId, sessionClaims } = await auth()
const role = (sessionClaims?.metadata as { role?: string })?.role
const currentUserId = userId

type ResultList = {
    id: number;
    title: string;
    studentName: string;
    studentSurname: string;
    teacherName: string;
    teacherSurname: string;
    score: number;
    className: string;
    startTime: Date;
};

const columns = [
    {
        header: "Title",
        accessor: "title",
    },
    {
        header: "Student",
        accessor: "student",
    },
    {
        header: "Score",
        accessor: "score",
        className: "hidden md:table-cell",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    {
        header: "Class",
        accessor: "class",
        className: "hidden md:table-cell",
    },
    {
        header: "Start Date",
        accessor: "date",
        className: "hidden md:table-cell",
    },
    ...(role === 'admin' || role === 'teacher' ? [{
        header: "Actions",
        accessor: "action",
    }] : []),
];

const renderRow = (item: ResultList) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaSkyLight"
    >
        <td className="flex items-center gap-4 p-4">{item.title}</td>
        <td>{item.studentName}</td>
        <td className="hidden md:table-cell">{item.score}</td>
        <td className="hidden md:table-cell">{item.teacherName + ' ' + item.teacherSurname}</td>
        <td className="hidden md:table-cell">{item.className}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat('en-US').format(item.startTime)}</td>
        <td>
            <div className="flex items-center gap-2">
                {(role === "admin" || role === "teacher") && (
                    <>
                        <FormModal table="result" type="update" data={item} />
                        <FormModal table="result" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

const ResultListPage = async ({
    searchParams
}: Props) => {
    const resolvedSearchParams = await searchParams
    const { page, ...queryParams } = resolvedSearchParams

    const p = page ? parseInt(page) : 1

    const query: Prisma.ResultWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "studentId":
                        query.studentId = value
                        break;
                    case "search":
                        query.OR = [
                            { exam: { title: { contains: value, mode: "insensitive" } } },
                            { student: { name: { contains: value, mode: "insensitive" } } },
                        ]
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // role conditions
    switch (role) {
        case 'admin':
            break;
        case 'teacher':
            query.OR = [
                { exam: { lesson: { teacherId: currentUserId! } } },
                { assignment: { lesson: { teacherId: currentUserId! } } },
            ]
            break;
        case 'student':
            query.studentId = currentUserId!
            break;
        case 'parent':
            query.student = {
                parentId: currentUserId!
            }
            break;
        default:
            break;
    }

    const [resultsRes, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            include: {
                student: {
                    select: {
                        name: true,
                        surname: true
                    }
                },
                exam: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } }
                            }
                        }
                    }
                },
                assignment: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } }
                            }
                        }
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.result.count({ where: query })
    ])

    const results = resultsRes.map((item) => {
        const assessment = item.exam || item.assignment

        if (!assessment) return null

        const isExam = "startTime" in assessment

        return {
            id: item.id,
            title: assessment.title,
            studentName: item.student.name,
            studentSurname: item.student.surname,
            teacherName: assessment.lesson.teacher.name,
            teacherSurname: assessment.lesson.teacher.surname,
            score: item.score,
            className: assessment.lesson.class.name,
            startTime: isExam ? assessment.startTime : assessment.startDate,
        }
    })

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <SlidersHorizontal className="size-5" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <ArrowDownUp className="size-5" />
                        </button>
                        {(role === "admin" || role === "teacher") && <FormModal table="result" type="create" />}
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={columns} renderRow={renderRow} data={results} />
            {/* pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default ResultListPage;