type Queue = {
    id: number
    name: string
    previousQueueId: number | null
}

type QueueCount = Omit<Queue, 'previousQueueId'> & {
    count: number
}