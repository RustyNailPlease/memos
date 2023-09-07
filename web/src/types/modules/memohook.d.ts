interface MemoHook {
    ID: number,
    Name: string
    Url: string,
    CreatorId: number
}

interface MemoHookCreate {
    name: string
    url: string
}