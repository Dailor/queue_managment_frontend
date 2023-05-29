type Ticket = {
    number: number
    hash: string
}

type TicketHumanRead = Omit<Ticket, 'hash'> & {
    createdAt: number
}