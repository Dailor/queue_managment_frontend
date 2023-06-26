type Ticket = {
    number: number
    hash: string
}

type TicketHumanRead = Omit<Ticket, 'hash'> & {
    queue: {
        name: string
    }
    createdAt: number
}