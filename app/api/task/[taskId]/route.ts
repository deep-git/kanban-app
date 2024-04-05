import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { newStatus, updatedSubtasks }: {
            newStatus: string,
            updatedSubtasks: {
                id: string,
                name: string,
                completed: boolean,
                taskId: string,
                columnId: string
            }[]
        } = await req.json();

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const taskStatusChange = await db.tasks.update({
            where: {
                id: params.taskId
            },
            data: {
                columnId: newStatus,
                status: newStatus
            }
        });

        for (let i = 0; i < updatedSubtasks.length; i++) {
            const updateSubtasks = await db.subtasks.update({
                where: {
                    id: updatedSubtasks[i].id
                },
                data: {
                    completed: updatedSubtasks[i].completed,
                    columnId: newStatus
                }
            })
        }

        return NextResponse.json(taskStatusChange);

    } catch (error) {
        console.log("[TASK_STATUS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const deleteTask = await db.tasks.delete({
            where: {
                id: params.taskId
            },
        });

        return NextResponse.json(deleteTask);

    } catch (error) {
        console.log("[TASK_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}