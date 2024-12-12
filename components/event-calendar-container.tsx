import { Ellipsis } from "lucide-react"
import { EventList } from "./event-list"
import { EventCalendar } from "./event-calendar"


export const EventCalendarContainer = async ({
    searchParams
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { date } = searchParams
    return (
        <div className='bg-white p-4 rounded-md'>
            <EventCalendar />
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-semibold my-4'>Events</h1>
                <Ellipsis className="size-6" />
            </div>
            <div className='flex flex-col gap-4'>
                <EventList dateParam={date} />
            </div>
        </div>
    )
}
