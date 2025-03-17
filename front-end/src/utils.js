export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (err) {
        return false
    }
    return true;
}