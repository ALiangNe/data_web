/**
 * Convert a China local time to UTC time.
 * @param time - China local Date object.
 * @returns - UTC time in ISO format.
 */
export const getUtcTime = (time: Date): string => {
    const year = time.getFullYear()
    const month = String(time.getMonth() + 1).padStart(2, '0')
    const day = String(time.getDate()).padStart(2, '0')
    const hour = String(time.getHours()).padStart(2, '0')
    const minute = String(time.getMinutes()).padStart(2, '0')
    const second = String(time.getSeconds()).padStart(2, '0')

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+08:00`).toISOString()
}

/**
 * Convert a China local date to the UTC range covering that day.
 * @param date - China local date in YYYY-MM-DD format.
 * @returns - UTC range from China local day start to next local day start.
 */
export const getDateUtcRange = (date: string): [string, string] => {
    const start = new Date(`${date}T00:00:00+08:00`)
    const end = new Date(`${date}T00:00:00+08:00`)
    end.setDate(end.getDate() + 1)
    return [
        start.toISOString(),
        end.toISOString(),
    ]
}
