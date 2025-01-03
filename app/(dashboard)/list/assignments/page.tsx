import { FormModal } from "@/components/form-modal";
import { Pagination } from "@/components/pagination";
import { Table } from "@/components/table";
import { TableSearch } from "@/components/table-search";
import prisma from "@/lib/db";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import { ArrowDownUp, SlidersHorizontal } from "lucide-react";

const { userId, sessionClaims } = await auth()
const role = (sessionClaims?.metadata as { role?: string })?.role

const currentUserId = userId

type AssignmentList = Assignment & {
    lesson: {
        subject: Subject,
        class: Class,
        teacher: Teacher
    }
}

const columns = [
    {
        header: "Subject Name",
        accessor: "name",
        className: 'pl-4'
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
    {
        header: "Due Date",
        accessor: "dueDate",
        className: "hidden md:table-cell",
    },
    ...(role === 'admin' || role === 'teacher' ? [{
        header: "Actions",
        accessor: "action",
    }] : []),
];

const renderRow = (item: AssignmentList) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaSkyLight"
    >
        <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
        <td>{item.lesson.class.name}</td>
        <td className="hidden md:table-cell">{item.lesson.teacher.name + ' ' + item.lesson.teacher.surname}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat('en-US').format(item.dueDate)}</td>
        <td>
            <div className="flex items-center gap-2">
                {(role === "admin" || role === "teacher") && (
                    <>
                        <FormModal table="assignment" type="update" data={item} />
                        <FormModal table="assignment" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

const AssignmentListPage = async ({
    searchParams
}: Props) => {
    const resolvedSearchParams = await searchParams
    const { page, ...queryParams } = resolvedSearchParams

    const p = page ? parseInt(page) : 1

    const query: Prisma.AssignmentWhereInput = {}

    query.lesson = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        query.lesson.classId = parseInt(value);
                        break;
                    case "teacherId":
                        query.lesson.teacherId = value;
                        break;
                    case "search":
                        query.lesson.subject = {
                            name: { contains: value, mode: "insensitive" },
                        };
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
            query.lesson.teacherId = currentUserId!
            break;
        case 'student':
            query.lesson.class = {
                students: {
                    some: {
                        id: currentUserId!
                    }
                }
            }
            break;
        case 'parent':
            query.lesson.class = {
                students: {
                    some: {
                        parentId: currentUserId!
                    }
                }
            }
            break;
        default:
            break;
    }

    const [assignments, count] = await prisma.$transaction([
        prisma.assignment.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        class: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } }
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.assignment.count({ where: query })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <SlidersHorizontal className="size-5" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <ArrowDownUp className="size-5" />
                        </button>
                        {role === "admin" || role === "teacher" && <FormModal table="assignment" type="create" />}
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={columns} renderRow={renderRow} data={assignments} />
            {/* pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default AssignmentListPage;