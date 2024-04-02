import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { boardId: string, columnId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const column = await db.columns.delete({
            where: {
                id: params.columnId,
                boardId: params.boardId,
                profileId: profile.id
            }
        })

        return NextResponse.json(column);

    } catch (error) {
        console.log("[COLUMN_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}