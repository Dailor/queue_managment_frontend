import {v4 as uuidv4} from 'uuid'

const LOCAL_STORAGE_UNIQUE_ID_KEY = 'UNIQUE_ID'

export const getLocalUniqueID = () => {
    const uniqueId = localStorage.getItem(LOCAL_STORAGE_UNIQUE_ID_KEY)

    if (!uniqueId) {
        setLocalUniqueID()
        return getLocalUniqueID()
    } else {
        return uniqueId
    }

}

export const setLocalUniqueID = () => {
    void localStorage.setItem(LOCAL_STORAGE_UNIQUE_ID_KEY, uuidv4())
}