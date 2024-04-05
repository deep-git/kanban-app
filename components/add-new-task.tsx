import React from 'react'

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import AddNewTaskContainer from './add-new-task-container';

interface AddNewTaskFormProps {
    boardId: string,
    columnNames: {
        id: string;
        name: string;
    }[],
    columns: {
        id: string;
        name: string;
        color: string;
        boardId: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    }[],
    handleCloseDialog: () => void;
}

const AddNewTaskForm = ({ boardId, columnNames, columns, handleCloseDialog }: AddNewTaskFormProps) => {

    return (
        <AddNewTaskContainer columnNames={columnNames} columns={columns} handleCloseDialog={handleCloseDialog} />
    )
}

export default AddNewTaskForm;