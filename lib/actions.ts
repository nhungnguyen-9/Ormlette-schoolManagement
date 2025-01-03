'use server'

import { revalidatePath } from "next/cache"
import prisma from "./db"
import { SubjectSchema } from "./formValidationSchema"

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
    currentState: CurrentState,
    data: SubjectSchema
) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers.map((teacherId) => ({ id: teacherId }))
                }
            }
        })

        return { success: true, error: false };
    } catch (error) {
        console.log(error)
        return { success: false, error: true };
    }
}

export const updateSubject = async (
    currentState: CurrentState,
    data: SubjectSchema
) => {
    try {
        await prisma.subject.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                teachers: {
                    set: data.teachers.map((teacherId) => ({ id: teacherId }))
                }
            }
        })

        return { success: true, error: false };
    } catch (error) {
        console.log(error)
        return { success: false, error: true };
    }
}

export const deleteSubject = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get('id') as string
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id)
            }
        })

        return { success: true, error: false };
    } catch (error) {
        console.log(error)
        return { success: false, error: true };
    }
}