import { FormModal } from "@/components/form-modal";
import { Pagination } from "@/components/pagination";
import { Table } from "@/components/table";
import { TableSearch } from "@/components/table-search";
import prisma from "@/lib/db";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Announcement, Class, Prisma } from "@prisma/client";
import { ArrowDownUp, SlidersHorizontal } from "lucide-react";

const { userId, sessionClaims } = await auth()
const role = (sessionClaims?.metadata as { role?: string })?.role
const currentUserId = userId

type AnnouncementList = Announcement & { class: Class }

const columns = [
    {
        header: "Title",
        accessor: "title",
        className: 'pl-4'
    },
    {
        header: "Class",
        accessor: "class",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden md:table-cell",
    },
    ...(role === 'admin' ? [{
        header: "Actions",
        accessor: "action",
    }] : []),
];

const renderRow = (item: AnnouncementList) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaSkyLight"
    >
        <td className="flex items-center gap-4 p-4">{item.title}</td>
        <td>{item.class?.name || "-"}</td>
        <td className="hidden md:table-cell">
            {new Intl.DateTimeFormat("en-US").format(item.date)}
        </td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="announcement" type="update" data={item} />
                        <FormModal table="announcement" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

interface Props {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

const AnnouncementListPage = async ({
    searchParams
}: Props) => {
    const { sessionClaims } = await auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role

    const resolvedSearchParams = await searchParams
    const { page, ...queryParams } = resolvedSearchParams

    const p = page ? parseInt(page) : 1

    // URL PARAMS CONDITION

    const query: Prisma.AnnouncementWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.title = { contains: value, mode: "insensitive" }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // role conditions
    const roleConditions = {
        teacher: { lessons: { some: { teacherId: currentUserId! } } },
        student: { students: { some: { id: currentUserId! } } },
        parent: { students: { some: { parentId: currentUserId! } } },
    }

    query.OR = [
        { classId: null },
        { class: roleConditions[role as keyof typeof roleConditions] || {} }
    ]

    const [announcements, count] = await prisma.$transaction([
        prisma.announcement.findMany({
            where: query,
            include: {
                class: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.announcement.count({ where: query }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">
                    All Announcements
                </h1>
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
                            <FormModal table="announcement" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={announcements} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default AnnouncementListPage;