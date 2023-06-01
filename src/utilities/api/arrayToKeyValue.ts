type SomeRecord = {
    id: number
    [key: string]: any
}

export function arrayToKeyValue(arr: SomeRecord[]) {
    const records: { [key: number]: SomeRecord } = {}

    arr.forEach(record => {
        records[record.id] = record
    })

    return records
}