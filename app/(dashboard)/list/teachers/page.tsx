import { FormModal } from "@/components/form-modal";
import { Pagination } from "@/components/pagination";
import { Table } from "@/components/table";
import { TableSearch } from "@/components/table-search";
import { role } from "@/lib/data";
import prisma from "@/lib/db";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import { ArrowDownUp, Eye, Plus, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] }

const columns = [
    {
        header: "Info",
        accessor: "info",
        className: 'pl-5'
    },
    {
        header: "Teacher ID",
        accessor: "teacherId",
        className: "hidden md:table-cell",
    },
    {
        header: "Subjects",
        accessor: "subjects",
        className: "hidden md:table-cell",
    },
    {
        header: "Classes",
        accessor: "classes",
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

const renderRow = (item: TeacherList) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaSkyLight"
    >
        <td className="flex items-center gap-4 p-4">
            <Image
                src={item.img || '/noAvatar.png'}
                alt=""
                width={40}
                height={40}
                className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500">{item?.email}</p>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.username}</td>
        <td className="hidden md:table-cell">{item.subjects.map(sub => sub.name).join(',')}</td>
        <td className="hidden md:table-cell">{item.classes.map(cla => cla.name).join(",")}</td>
        <td className="hidden md:table-cell">{item.phone}</td>
        <td className="hidden md:table-cell">{item.address}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/teachers/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaGreen">
                        <Eye className="size-5" />
                    </button>
                </Link>
                {role === "admin" && (
                    <FormModal table="teacher" type="delete" id={Number(item.id)} />
                )}
            </div>
        </td>
    </tr>
);

const TeacherListPage = async ({
    searchParams
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { page, ...queryParams } = searchParams

    const p = page ? parseInt(page) : 1

    // url params condition
    const query: Prisma.TeacherWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'classId':
                        query.lessons = {
                            some: {
                                classId: parseInt(value)
                            }
                        }
                        break;
                    case 'search':
                        query.name = { contains: value, mode: 'insensitive' }
                        break;
                }
            }
        }
    }

    const [teachers, count] = await prisma.$transaction([
        prisma.teacher.findMany({
            where: query,
            include: {
                subjects: true,
                classes: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.teacher.count({ where: query })
    ])

    return (
        <div className="bg-white rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between m-2">
                <h1 className="hidden md:block text-lg font-semibold">All teachers</h1>
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
                            <FormModal table="student" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={columns} renderRow={renderRow} data={teachers} />
            {/* pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default TeacherListPage;