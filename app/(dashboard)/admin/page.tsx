import { AttendanceChart } from "@/components/attendace-chart";
import { CountChart } from "@/components/count-chart";
import { UserCard } from "@/components/user-card";

const AdminPage = () => {
    return (
        <div className="p-4 flex gap-4 flex-col md:flex-flow">
            {/* left */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">

                {/* usercard */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type="student" />
                    <UserCard type="teacher" />
                    <UserCard type="parent" />
                    <UserCard type="staff" />
                </div>
                {/* middle chart */}
                <div className="flex gap-4 flex-col lg:flex-row">
                    {/* count chart */}
                    <div className="w-full lg:w-1/3 h-[450px]">
                        <CountChart />
                    </div>
                    {/* attendance chart */}
                    <div className="w-full lg:w-2/3 h-[450px]">
                        <AttendanceChart />
                    </div>
                </div>
                {/* bottom chart */}
                <div className=""></div>
            </div>
            {/* right */}
            <div className="w-full lg:w-1/3">
                r
            </div>
        </div>
    );
}

export default AdminPage;