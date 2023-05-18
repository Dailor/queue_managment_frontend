import React, {useState} from 'react'
import Header from "@/components/navigation/Header"
import Sidebar from "@/components/navigation/Sidebar"


function Navigation() {
    const [isSidebarOpen, toggleIsSidebarOpen] = useState(false)

    const sidebarToggle = () => {
        toggleIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <>
            <Header isSidebarOpen={isSidebarOpen} sidebarToggle={sidebarToggle}/>
            <Sidebar isSidebarOpen={isSidebarOpen} toggleIsSidebarOpen={toggleIsSidebarOpen}/>
        </>
    )
}

export default Navigation