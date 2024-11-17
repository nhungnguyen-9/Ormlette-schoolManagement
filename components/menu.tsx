'use client'

import { Backpack, BookA, CalendarClock, ContactRound, GraduationCap, HomeIcon as House, LogOut, Megaphone, MessageSquare, Presentation, Settings, Shapes, UserCheck, UserRoundIcon as UserRoundPen, Users } from 'lucide-react';
import Link from "next/link";
import { Hint } from "./hint";
import { useEffect, useState } from "react";

const menuItems = [
    {
        title: 'MENU',
        items: [
            { icon: House, label: 'Home', href: '/' },
            { icon: GraduationCap, label: 'Teachers', href: '/teachers' },
            { icon: UserRoundPen, label: 'Students', href: '/students' },
            { icon: Users, label: 'Parents', href: '/parents' },
            { icon: Shapes, label: 'Classes', href: '/classes' },
            { icon: Presentation, label: 'Lessons', href: '/lessons' },
            { icon: BookA, label: 'Exams', href: '/exams' },
            { icon: Backpack, label: 'Assignments', href: '/assignments' },
            { icon: UserCheck, label: 'Attendance', href: '/attendance' },
            { icon: CalendarClock, label: 'Events', href: '/events' },
            { icon: MessageSquare, label: 'Messages', href: '/messages' },
            { icon: Megaphone, label: 'Announcements', href: '/announcements' },
        ]
    },
    {
        title: 'OTHER',
        items: [
            { icon: ContactRound, label: 'Profile', href: '/profile' },
            { icon: Settings, label: 'Settings', href: '/settings' },
            { icon: LogOut, label: 'Logout', href: '/logout' },
        ]
    }
]

export const Menu = () => {
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 1024)
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)

        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    return (
        <div className="mt-4 text-sm">
            {menuItems.map((section) => (
                <div className="flex flex-col gap-2" key={section.title}>
                    <span className="hidden lg:block text-gray-400 font-light my-4">
                        {section.title}
                    </span>
                    {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                href={item.href}
                                key={item.label}
                                className="flex items-center justify-center lg:justify-start text-gray-500 gap-4 py-2"
                            >
                                {isSmallScreen ? (
                                    <Hint label={item.label} side="right" align='center'>
                                        <Icon className="h-4 w-4" />
                                    </Hint>
                                ) : (
                                    <Icon className="h-4 w-4" />
                                )}
                                <span className="hidden lg:block">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}