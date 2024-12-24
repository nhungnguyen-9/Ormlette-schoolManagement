import prisma from "@/lib/db"
import { BigCalendar } from "./big-calendar"
import { adjustScheduleToCurrentWeek } from "@/lib/utils"

export const BigCalendarContainer = async ({
    type,
    id
}: {
    type: 'teacherId' | 'classId',
    id: string | number
}) => {
    const dataRes = await prisma.lesson.findMany({
        where: {
            ...(type === 'teacherId' ? { teacherId: id as string } : { classId: id as number })
        }
    })
    const data = dataRes.map(lesson => ({
        title: lesson.name,
        start: lesson.startTime,
        end: lesson.endTime
    }))


    const schedule = adjustScheduleToCurrentWeek(data)

    return (
        <div>
            <BigCalendar data={schedule} />
        </div>
    )
}
