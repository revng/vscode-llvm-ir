export function removeTrailing(str: string, trail: string): string {
    if (str.endsWith(trail)) {
        return str.slice(0, -trail.length);
    } else {
        return str;
    }
}

const escape = /\\[0-9a-fA-F]{2}/;
export function normalizeIdentifier(str: string): string {
    const prefix = str.slice(0, 1);
    const pureIdentifier = str.endsWith('"') ? str.slice(2, -1) : str.slice(1);
    const normalizedIdentifier = pureIdentifier.replace(escape, (match: string) => {
        return String.fromCharCode(parseInt(match.slice(1), 16));
    });
    return prefix + normalizedIdentifier;
}
