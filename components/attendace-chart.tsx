'use client'

import { Ellipsis } from 'lucide-react';
import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
    {
        name: 'Mon',
        present: 60,
        absent: 40,
    },
    {
        name: 'Tue',
        present: 30,
        absent: 13,
    },
    {
        name: 'Wed',
        present: 98,
        absent: 20,
    },
    {
        name: 'Thu',
        present: 80,
        absent: 38,
    },
    {
        name: 'Fri',
        present: 90,
        absent: 48,
    },
    {
        name: 'Sat',
        present: 90,
        absent: 3,
    },
    {
        name: 'Sun',
        present: 90,
        absent: 43,
    },
];

export const AttendanceChart = () => {
    return (
        <div className='bg-white rounded-lg p-4 h-full'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Attendance</h1>
                <Ellipsis className="size-4" />
            </div>

            <ResponsiveContainer width='100%' height='90%'>
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd' />
                    <XAxis dataKey="name" axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                    <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }} />
                    <Legend align='left' verticalAlign='top' wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }} />
                    <Bar dataKey="present" fill="#f6e58d" legendType='circle' radius={[10, 10, 0, 0]} />
                    <Bar dataKey="absent" fill="#7ed6df" legendType='circle' radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
