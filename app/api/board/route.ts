import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { boardName } = await req.json();

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const board = await db.boards.create({
            data: {
                name: boardName,
                profileId: profile.id
            }
        })

        return NextResponse.json(board);

    } catch (error) {
        console.log("[BOARD_CREATE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}