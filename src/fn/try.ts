export default async function<T>(cb: () => Promise<T>): Promise<[T, null] | [null, unknown]> {
    try {
        const result = await cb()
        return [result, null]
    } catch (error: unknown) {
        return [null, error]
    }
}