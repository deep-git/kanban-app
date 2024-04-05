import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { taskId: string, subtaskId: string } }) {
    try {
        const { status } = await req.json();

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const subtaskCompleted = await db.subtasks.update({
            where: {
                taskId: params.taskId,
                id: params.subtaskId
            },
            data: {
                completed: status
            }
        })

        return NextResponse.json(subtaskCompleted);

    } catch (error) {
        console.log("[SUBTASK_STATUS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}