import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { boardId: string } }) {
    try {
        const { title, description, subtasks, status }: {
            title: string,
            description: string,
            subtasks: {
                id: string;
                taskName: string;
                completed: boolean;
            }[],
            status: string
        } = await req.json();

        console.log(title, description);

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const task = await db.tasks.create({
            data: {
                name: title,
                description: description,
                status: status,
                profileId: profile.id,
                boardId: params.boardId,
                columnId: status
            }
        });

        const createdTaskId = task.id;

        for (let i = 0; i < subtasks.length; i++) {
            const subtask = await db.subtasks.create({
                data: {
                    name: subtasks[i].taskName,
                    completed: subtasks[i].completed,
                    taskId: createdTaskId,
                    columnId: status
                }
            })
        }

        return NextResponse.json(task);

    } catch (error) {
        console.log("[TASK_CREATE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}