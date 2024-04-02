import { initialProfile } from '@/lib/initial-profile';
import React from 'react'

const Dashboard = async () => {

    const profile = await initialProfile();

    return (
        <div>
            Dashboard
        </div>
    )
}

export default Dashboard