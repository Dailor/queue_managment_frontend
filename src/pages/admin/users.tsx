import React, {useCallback, useEffect, useMemo, useState} from 'react'
import Head from "next/head"
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid"
import {IUser} from "@/types/user"
import usersAPI from "@/requests/users"
import departmentsAPI from "@/requests/departments"
import {arrayToKeyValue} from "@/utilities/api"
import {IDepartment} from "@/types/department"
import {roleToRoleName, UserRolesEnum} from "@/constants"
import UserEditModal from "@/components/modals/users/UserEditModal"


export default function Users() {
    const [users, setUsers] = useState<GridRowsProp<IUser>>([])
    const [departments, setDepartments] = useState<{ [key: number]: IDepartment } | null>(null)

    const [departmentArray, setDepartmentArray] = useState<IDepartment[]>([])

    const [isFetching, toggleIsFetching] = useState(true)

    const loadAll = useCallback(() => {
        departmentsAPI.list()
            .then((r) => {
                setDepartmentArray(r.data.departments)
                setDepartments(arrayToKeyValue<IDepartment>(r.data.departments))
            })
    }, [])

    useEffect(() => {
        loadAll()
    }, [loadAll])

    useEffect(() => {
        if (!!departments)
            usersAPI.list()
                .then((r) => {
                    setUsers(r.data.users.map(user => {
                        return {
                            ...user,
                            department: departments[user.departmentID]?.name || '-'
                        }
                    }))
                })
                .finally(() => {
                    toggleIsFetching(false)
                })
    }, [departments])

    const columns: GridColDef[IUser] = useMemo(
        () => ([
            {field: 'id', headerName: 'ID', width: 30},
            {field: 'fullName', headerName: 'ФИО', width: 400},
            {field: 'email', headerName: 'Почта', width: 150},
            {field: 'department', headerName: 'Департамент', width: 300},
            {
                field: 'role',
                headerName: 'Роль',
                width: 250,
                renderCell: ({row}) => (roleToRoleName[row.role as UserRolesEnum] || '-')
            },
            {
                field: 'actions',
                headerName: 'Действия',
                flex: 1,
                renderCell: ({row}) => <UserEditModal user={row} departments={departmentArray} callback={loadAll}/>
            }
        ]),
        [departmentArray, loadAll]
    )

    return (
        <>
            <Head>
                <title>IITU | Пользователи</title>
            </Head>
            <main>
                <h1>Пользователи</h1>
                <div style={{height: 300, width: '100%'}}>
                    <DataGrid rows={users} columns={columns} loading={isFetching}/>
                </div>
            </main>
        </>
    )
}