import { FormModal } from "@/components/form-modal";
import { Pagination } from "@/components/pagination";
import { Table } from "@/components/table";
import { TableSearch } from "@/components/table-search";
import prisma from "@/lib/db";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import { ArrowDownUp, SlidersHorizontal } from "lucide-react";

const { sessionClaims } = await auth()
const role = (sessionClaims?.metadata as { role?: string })?.role

type LessonList = Lesson & { subject: Subject } & { class: Class } & { teacher: Teacher }

const columns = [
    {
        header: "Subject Name",
        accessor: "name",
    },
    {
        header: "Class",
        accessor: "class",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    ...(role === 'admin' ? [{
        header: "Actions",
        accessor: "action",
    }] : []),
];

const renderRow = (item: LessonList) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaSkyLight"
    >
        <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
        <td>{item.class.name}</td>
        <td className="hidden md:table-cell">{item.teacher.name}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="lesson" type="update" data={item} />
                        <FormModal table="lesson" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

const LessonListPage = async ({
    searchParams
}: Props) => {
    const resolvedSearchParams = await searchParams
    const { page, ...queryParams } = resolvedSearchParams

    const p = page ? parseInt(page) : 1

    const query: Prisma.LessonWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'classId':
                        query.classId = parseInt(value)
                        break;
                    case 'teacherId':
                        query.teacherId = value
                        break;
                    case 'search':
                        query.OR = [
                            { subject: { name: { contains: value, mode: 'insensitive' } } },
                            { teacher: { name: { contains: value, mode: 'insensitive' } } },
                        ]
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [lessons, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            include: {
                // only take name
                subject: { select: { name: true } },
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.lesson.count({ where: query })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All lessons</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <SlidersHorizontal className="size-5" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <ArrowDownUp className="size-5" />
                        </button>
                        {role === "admin" && <FormModal table="lesson" type="create" />}
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={columns} renderRow={renderRow} data={lessons} />
            {/* pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default LessonListPage;