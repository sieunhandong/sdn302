import { useMutation } from "@tanstack/react-query"

export const useMutatioHooks = (fnCallback) => {
    const mutation = useMutation({
        mutationFn: fnCallback
    })
    return mutation;
}