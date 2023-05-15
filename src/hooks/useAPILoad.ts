import React, {useCallback, useState} from 'react'
import axios from "axios"

type DataType = any
type ErrorType = any
type IsFetchingType = boolean
type LoadDataType = (...args: any) => Promise<axios.AxiosResponse<any>>

type ApiLoadType= () => Promise<axios.AxiosResponse<any>>

type HookReturn<T> = [DataType | T, ErrorType, IsFetchingType, LoadDataType]

function useAPILoad<T>(apiLoad: ApiLoadType, initialData: any): HookReturn<T> {
    const [data, setData] = useState(initialData)
    const [error, setError] = useState(null)
    const [isFetching, toggleIsFetching] = useState<boolean>(false)

    const loadData = useCallback(() => {
        toggleIsFetching(true)

        return apiLoad()
            .then(r => {
                setData(r.data)
            })
            .catch(r => {
                setError(r.response)
            })
            .finally(() => {
                toggleIsFetching(false)

            })
    }, [])

    return [data, error, isFetching, loadData]
}

export default useAPILoad