import { Bell, CircleUserRound, MessageCircleMore, Search } from "lucide-react"

export const Navbar = () => {
    return (
        <div className="flex items-center justify-between p-4">
            {/* search */}
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <Search className="size-4" />
                <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
            </div>
            {/* icon and user */}
            <div className="flex items-center gap-6 justify-end w-full">
                <div className="rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                    <MessageCircleMore className="size-6" />
                </div>
                <div className="rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
                    <Bell className="size-6" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-yellow-500 text-white rounded-full">1</div>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm leading-3 font-medium">John Doe</span>
                    <span className="text-[10px] text-gray-500 text-right">Admin</span>
                </div>
                <CircleUserRound className="size-6" />
            </div>
        </div>
    )
}
