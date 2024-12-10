'use client'

import { Backpack, BookA, CalendarClock, ClipboardCheck, ContactRound, GraduationCap, HomeIcon as House, LogOut, Megaphone, MessageSquare, NotebookText, Presentation, Settings, Shapes, UserCheck, UserRoundIcon as UserRoundPen, Users } from 'lucide-react';
import Link from "next/link";
import { Hint } from "./hint";
import { useEffect, useState } from "react";
import { role } from '@/lib/data';
import { currentUser } from '@clerk/nextjs/server';

const menuItems = [
    {
        title: 'MENU',
        items: [
            {
                icon: House,
                label: 'Home',
                href: '/',
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: GraduationCap,
                label: 'Teachers',
                href: "/list/teachers",
                visible: ["admin", "teacher"],
            },
            {
                icon: UserRoundPen,
                label: 'Students',
                href: "/list/students",
                visible: ["admin", "teacher"],
            },
            {
                icon: Users,
                label: 'Parents',
                href: "/list/parents",
                visible: ["admin", "teacher"],
            },
            {
                icon: NotebookText,
                label: 'Subjects',
                href: "/list/subjects",
                visible: ["admin"],
            },
            {
                icon: Shapes,
                label: 'Classes',
                href: "/list/classes",
                visible: ["admin", "teacher"],
            },
            {
                icon: Presentation,
                label: 'Lessons',
                href: "/list/lessons",
                visible: ["admin", "teacher"],
            },
            {
                icon: BookA,
                label: 'Exams',
                href: "/list/exams",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: Backpack,
                label: 'Assignments',
                href: "/list/assignments",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: ClipboardCheck,
                label: "Results",
                href: "/list/results",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: UserCheck,
                label: 'Attendance',
                href: "/list/attendance",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: CalendarClock,
                label: 'Events',
                href: "/list/events",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: MessageSquare,
                label: 'Messages',
                href: "/list/messages",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: Megaphone,
                label: 'Announcements',
                href: "/list/announcements",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ]
    },
    {
        title: 'OTHER',
        items: [
            {
                icon: ContactRound,
                label: 'Profile',
                href: '/profile',
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: Settings,
                label: 'Settings',
                href: '/settings',
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: LogOut,
                label: 'Logout',
                href: '/logout',
                visible: ["admin", "teacher", "student", "parent"],
            },
        ]
    }
]

export const Menu = ({
    role
}: {
    role: string | null
}) => {
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
                        if (role && item.visible.includes(role)) {
                            return (
                                <Link
                                    href={item.href}
                                    key={item.label}
                                    className="flex items-center justify-center rounded-lg lg:justify-start text-gray-500 gap-4 py-2 md:px-2 hover:bg-lamaSkyLight"
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

                            )
                        }
                    })}
                </div>
            ))}
        </div>
    );
}