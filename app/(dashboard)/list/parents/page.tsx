import { FormModal } from "@/components/form-modal";
import { Pagination } from "@/components/pagination";
import { Table } from "@/components/table";
import { TableSearch } from "@/components/table-search";
import { parentsData, role, } from "@/lib/data";
import prisma from "@/lib/db";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Parent, Prisma, Student } from "@prisma/client";
import { ArrowDownUp, Eye, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ParentList = Parent & { students: Student[] }

const columns = [
    {
        header: "Info",
        accessor: "info",
        className: 'pl-5'
    },
    {
        header: "Student Names",
        accessor: "students",
        className: "hidden md:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden lg:table-cell",
    },
    {
        header: "Address",
        accessor: "address",
        className: "hidden lg:table-cell",
    },
    {
        header: "Actions",
        accessor: "action",
    },
];

const renderRow = (item: ParentList) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaSkyLight"
    >
        <td className="flex items-center gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500">{item?.email}</p>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.students.map(st => st.name).join(', ')}</td>
        <td className="hidden md:table-cell">{item.phone}</td>
        <td className="hidden md:table-cell">{item.address}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="parent" type="update" data={item} />
                        <FormModal table="parent" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

const ParentListPage = async ({
    searchParams
}: Props) => {
    const resolvedSearchParams = await searchParams
    const { page, ...queryParams } = resolvedSearchParams

    const p = page ? parseInt(page) : 1

    // url params condition
    const query: Prisma.ParentWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.name = { contains: value, mode: 'insensitive' }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [parents, count] = await prisma.$transaction([
        prisma.parent.findMany({
            where: query,
            include: {
                students: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.parent.count({ where: query })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All parents</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <SlidersHorizontal className="size-5" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <ArrowDownUp className="size-5" />
                        </button>
                        {role === "admin" && (
                            <FormModal table="teacher" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={columns} renderRow={renderRow} data={parents} />
            {/* pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default ParentListPage;