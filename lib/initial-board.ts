import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { initialProfile } from "./initial-profile";

export const initialBoard = async () => {

    const user = await initialProfile();

    const firstBoard = await db.boards.create({
        data: {
            name: "First Board",
            profileId: user.id
        }
    });

    return firstBoard;
}