type Queue = {
    id: number
    name: string
    previousQueueId: number
}

type QueueCount = Omit<Queue, 'previousQueueId'> & {
    count: number
}