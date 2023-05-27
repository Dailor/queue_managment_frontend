type Ticket = {
    number: number
    hash: string
}

type TicketHumanRead = Omit<Ticket, 'hash'> & {
    windowNumber: number
    createdAt: number
}