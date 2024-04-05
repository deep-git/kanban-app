import React, { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

interface ViewSubtaskProps {
    task: {
        id: string;
        name: string;
        description: string;
        status: string;
        profileId: string;
        boardId: string;
        columnId: string;
        createdAt: Date;
        updatedAt: Date;
    },
    subtask: {
        id: string;
        name: string;
        completed: boolean;
        taskId: string;
    },
    handleUpdateSubtasks: (subtaskId: string, e: any) => void
}

const ViewSubtask = ({ task, subtask, handleUpdateSubtasks }: ViewSubtaskProps) => {

    const pathname = usePathname();
    const router = useRouter();
    const [changeStatus, setChangeStatus] = useState(subtask.completed);

    const boardId = pathname.split("/")[2];

    const handleUpdateComplete = (e: any) => {
        setChangeStatus(prev => !prev);
        /*
        const response = await fetch(`/api/task/${task.id}/subtask/${subtask.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                status: e
            })
        });
        */

        handleUpdateSubtasks(subtask.id, e)
    }

    return (
        <div className="flex items-center gap-3 p-3 bg-light-board_background dark:bg-dark-board_background rounded-lg">
            <Checkbox checked={changeStatus} onCheckedChange={(e) => handleUpdateComplete(e)} className="bg-light-sidebar dark:bg-dark-sidebar" />
            <span className={cn("", {
                "line-through text-dark-gray_text": changeStatus,
            })}>{subtask.name}</span>
        </div>
    )
}

export default ViewSubtask