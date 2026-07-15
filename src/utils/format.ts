/**
 * Format bytes into a readable size string.
 * @param bytes - Size in bytes.
 * @param fractionDigits - Fraction digits. Default is 2.
 * @returns - Formatted size string.
 */
export const formatBytes = (bytes: number, fractionDigits: number = 2): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let value = bytes
    let unitIndex = 0

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024
        unitIndex += 1
    }

    if (unitIndex === 0) return `${value} ${units[unitIndex]}`
    return `${value.toFixed(fractionDigits)} ${units[unitIndex]}`
}
