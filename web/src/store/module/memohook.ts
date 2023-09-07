import { deleteMemoHook } from "@/helpers/api"


export const useMemoHookStore = () => {
    return {
        deleteHook: async (id: number) => {
            return deleteMemoHook(id)
        }
    }
}