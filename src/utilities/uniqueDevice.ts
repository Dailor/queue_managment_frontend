const LOCAL_STORAGE_UNIQUE_ID_KEY = 'UNIQUE_ID'

export const getLocalUniqueID = () => {
    return localStorage.getItem(LOCAL_STORAGE_UNIQUE_ID_KEY)
}

export const setLocalUniqueID = () => {
    if (!getLocalUniqueID()) {
        void localStorage.setItem(LOCAL_STORAGE_UNIQUE_ID_KEY, crypto.randomUUID())
    }
}