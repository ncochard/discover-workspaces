export function makeString(value: any): string | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return undefined;
    }
    if (typeof value !== "string") {
        throw new Error(`Value is not a string: ${typeof value}`);
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
        return undefined;
    }
    return trimmed;
}
