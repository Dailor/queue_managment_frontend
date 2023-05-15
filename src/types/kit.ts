interface IKitItem {
    id: number
    count: number
}

export interface IKit{
    id: number
    name: string
    description: string
    items: IKitItem[]
}
