import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { boardId: string } }) {
    try {
        const { name, color } = await req.json();

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const column = await db.columns.create({
            data: {
                name: name,
                color: color,
                boardId: params.boardId,
                profileId: profile.id
            }
        })

        return NextResponse.json(column);

    } catch (error) {
        console.log("[COLUMN_CREATE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}