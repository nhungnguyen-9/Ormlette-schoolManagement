import { MenuWrapper } from "@/components/menu-wrapper";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen flex">
            <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
                <Link
                    href='/'
                    className="flex items-center justify-center lg:justify-start gap-2"
                >
                    <Image
                        src='/new.png'
                        alt="logo"
                        width={150}
                        height={150}
                    />
                </Link>
                <MenuWrapper />
            </div>
            <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
                <Navbar />
                {children}
            </div>
        </div>
    );
}
