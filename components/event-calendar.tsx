'use client'

import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const events = [
    {
        id: 1,
        title: 'lorem ipsum dolor',
        time: '12:00px - 2:00pm',
        description: 'Lorem ipsum dolor Lorem ipsum dolor'
    },
    {
        id: 2,
        title: 'lorem ipsum dolor',
        time: '12:00px - 2:00pm',
        description: 'Lorem ipsum dolor Lorem ipsum dolor'
    },
    {
        id: 3,
        title: 'lorem ipsum dolor',
        time: '12:00px - 2:00pm',
        description: 'Lorem ipsum dolor Lorem ipsum dolor'
    },
]

export const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date())

    return (
        <div className='bg-white p-4 rounded-md'>
            <Calendar onChange={onChange} value={value} />
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-semibold my-4'>Events</h1>
                <Ellipsis className="size-6" />
            </div>
            <div className='flex flex-col gap-4'>
                {events.map((event) => (
                    <div
                        key={event.id}
                        className='p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaGreen'
                    >
                        <div className='flex items-center justify-between'>
                            <h1 className='font-semibold text-gray-600'>{event.title}</h1>
                            <span className='text-gray-300 text-xs'>{event.time}</span>
                        </div>
                        <p className='mt-2 text-gray-400 text-sm'>{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
