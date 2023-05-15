export function arrayToKeyValue<T>(arr) {
    const records: { [key: number]: T } = {}

    arr.forEach(record => {
        records[record.id] = record
    })

    return records
}