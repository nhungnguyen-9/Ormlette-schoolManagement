import { FormModal } from "@/components/form-modal";
import { Pagination } from "@/components/pagination";
import { Table } from "@/components/table";
import { TableSearch } from "@/components/table-search";
import prisma from "@/lib/db";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Class, Prisma, Teacher } from "@prisma/client";
import { ArrowDownUp, SlidersHorizontal } from "lucide-react";

const { sessionClaims } = await auth()
const role = (sessionClaims?.metadata as { role?: string })?.role

type ClassList = Class & { supervisor: Teacher }

const columns = [
    {
        header: "Class Name",
        accessor: "name",
    },
    {
        header: "Capacity",
        accessor: "capacity",
        className: "hidden md:table-cell",
    },
    {
        header: "Grade",
        accessor: "grade",
        className: "hidden md:table-cell",
    },
    {
        header: "Supervisor",
        accessor: "supervisor",
        className: "hidden md:table-cell",
    },
    ...(role === 'admin' ? [{
        header: "Actions",
        accessor: "action",
    }] : []),
];

const renderRow = (item: ClassList) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaSkyLight"
    >
        <td className="flex items-center gap-4 p-4">{item.name}</td>
        <td className="hidden md:table-cell">{item.capacity}</td>
        <td className="hidden md:table-cell">{item.name[0]}</td>
        <td className="hidden md:table-cell">{item.supervisor
            ? `${item.supervisor.name} ${item.supervisor.surname}`
            : "No Supervisor"}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="class" type="update" data={item} />
                        <FormModal table="class" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

const ClassListPage = async ({
    searchParams
}: Props) => {
    const resolvedSearchParams = await searchParams
    const { page, ...queryParams } = resolvedSearchParams

    const p = page ? parseInt(page) : 1

    // url params condition
    const query: Prisma.ClassWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'supervisorId':
                        query.supervisorId = value
                        break;
                    case 'search':
                        query.name = { contains: value, mode: 'insensitive' }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [classes, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: query,
            include: {
                supervisor: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.class.count({ where: query })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All classes</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <SlidersHorizontal className="size-5" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <ArrowDownUp className="size-5" />
                        </button>
                        {role === "admin" && <FormModal table="class" type="create" />}
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={columns} renderRow={renderRow} data={classes} />
            {/* pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default ClassListPage;