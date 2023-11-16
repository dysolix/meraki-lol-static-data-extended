export function snakeCaseToCamelCase(obj) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
        newObj[key.replace(/_\w/g, m => m[1].toUpperCase())] = value;
    }

    return newObj;
}