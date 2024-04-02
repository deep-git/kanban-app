import Navbar from '@/components/navigation/navbar'
import Sidebar from '@/components/navigation/sidebar'
import React from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full h-screen flex overflow-hidden">
            <Sidebar />
            <div className="flex flex-col w-full">
                {children}
            </div>
        </div>
    )
}

export default MainLayout