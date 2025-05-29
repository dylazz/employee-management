let currentId = 0;

export function generateNextId(): number {
    return ++currentId;
}
