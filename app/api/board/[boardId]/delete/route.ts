import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { boardId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const board = await db.boards.delete({
            where: {
                id: params.boardId,
                profileId: profile.id
            }
        })

        return NextResponse.json(board);

    } catch (error) {
        console.log("[BOARD_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}