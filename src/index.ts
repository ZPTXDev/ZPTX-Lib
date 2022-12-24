import { TimeFormats, TimeObject } from './index.d.js';

/**
 * Returns a time object (or a converted equivalent if a format is provided) converted from milliseconds.
 * Reference: https://gist.github.com/flangofas/714f401b63a1c3d84aaa
 * @param milliseconds - The milliseconds to convert.
 * @param format - The format to convert to. Accepts 's' for seconds, 'm' for minutes, 'h' for hours, 'd' for days.
 * @returns TimeObject or the converted equivalent if a format is provided.
 */
export function msToTime(milliseconds: number, format: TimeFormats): number;
export function msToTime(milliseconds: number): TimeObject;
export function msToTime(
    milliseconds: number,
    format?: TimeFormats,
): TimeObject | number {
    const total_seconds = Math.floor(milliseconds / 1000);
    const total_minutes = Math.floor(total_seconds / 60);
    const total_hours = Math.floor(total_minutes / 60);
    const days = Math.floor(total_hours / 24);
    const seconds = total_seconds % 60;
    const minutes = total_minutes % 60;
    const hours = total_hours % 24;
    switch (format) {
        case 's':
            return total_seconds;
        case 'm':
            return total_minutes;
        case 'h':
            return total_hours;
        case 'd':
            return days;
        default:
            return { d: days, h: hours, m: minutes, s: seconds };
    }
}

/**
 * Returns a TimeObject in string format.
 * @param msObject - The TimeObject.
 * @param simple - Whether to return a simple string or a more detailed one.
 * @returns The converted string.
 */
export function msToTimeString(
    msObject: TimeObject,
    simple?: boolean,
): string | 'MORE_THAN_A_DAY' {
    if (simple) {
        if (msObject['d'] > 0) {
            return 'MORE_THAN_A_DAY';
        }
        return `${msObject['h'] > 0 ? `${msObject['h']}:` : ''}${
            msObject['h'] > 0
                ? msObject['m'].toString().padStart(2, '0')
                : msObject['m']
        }:${msObject['s'].toString().padStart(2, '0')}`;
    }
    return `${
        msObject['d'] > 0
            ? `${msObject['d']} day${msObject['d'] === 1 ? '' : 's'}, `
            : ''
    }${
        msObject['h'] > 0
            ? `${msObject['h']} hr${msObject['h'] === 1 ? '' : 's'}, `
            : ''
    }${
        msObject['m'] > 0
            ? `${msObject['m']} min${msObject['m'] === 1 ? '' : 's'}, `
            : ''
    }${
        msObject['s'] > 0
            ? `${msObject['s']} sec${msObject['s'] === 1 ? '' : 's'}, `
            : ''
    }`.slice(0, -2);
}

/**
 * Parses a human-readable time string into milliseconds.
 * @param timeString - The time string to parse.
 * @returns The parsed milliseconds.
 */
export function parseTimeString(timeString: string): number {
    const timeRegex = /(\d+)([smhd])/g;
    const timeMatches = timeString.matchAll(timeRegex);
    let time = 0;
    for (const match of timeMatches) {
        const amount = parseInt(match[1]);
        const unit = match[2];
        switch (unit) {
            case 's':
                time += amount * 1000;
                break;
            case 'm':
                time += amount * 1000 * 60;
                break;
            case 'h':
                time += amount * 1000 * 60 * 60;
                break;
            case 'd':
                time += amount * 1000 * 60 * 60 * 24;
                break;
        }
    }
    return time;
}

/**
 * Returns a number rounded to the number of decimal places provided.
 * Reference: https://stackoverflow.com/a/15762794
 * @param n - The number to round.
 * @param digits - The number of decimal places to round to.
 * @returns The rounded number.
 */
export function roundTo(n: number, digits?: number): number {
    let negative = false;
    if (digits === undefined) digits = 0;
    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    const multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = parseFloat((Math.round(n) / multiplicator).toFixed(digits));
    if (negative) n = parseFloat((n * -1).toFixed(digits));
    if (digits === 0) n = parseInt(n.toString(), 10);
    return n;
}

/**
 * Returns a progress bar based on the percentage provided.
 * @param progress - The percentage of the bar to be filled.
 * @returns The progress bar.
 */
export function getBar(progress: number): string {
    const progressBars = [
        '🔘▬▬▬▬▬▬▬▬▬',
        '▬🔘▬▬▬▬▬▬▬▬',
        '▬▬🔘▬▬▬▬▬▬▬',
        '▬▬▬🔘▬▬▬▬▬▬',
        '▬▬▬▬🔘▬▬▬▬▬',
        '▬▬▬▬▬🔘▬▬▬▬',
        '▬▬▬▬▬▬🔘▬▬▬',
        '▬▬▬▬▬▬▬🔘▬▬',
        '▬▬▬▬▬▬▬▬🔘▬',
        '▬▬▬▬▬▬▬▬▬🔘',
    ];
    if (isNaN(progress) || progress < 10) return progressBars[0];
    return progressBars[
        Math.min(Math.floor(progress / 10), progressBars.length - 1)
    ];
}

/**
 * Returns a paginated array.
 * @param arr - The array to paginate.
 * @param size - The size of each page.
 * @returns The paginated array.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function paginate(arr: any[], size: number): any[][] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return arr.reduce((acc: any[], val: unknown, i: number): any[] => {
        const idx = Math.floor(i / size);
        const page = acc[idx] || (acc[idx] = []);
        page.push(val);
        return acc;
    }, []);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getJSONResponse(body: any): Promise<unknown> {
    let fullBody = '';
    for await (const d of body) {
        fullBody += d.toString();
    }
    return JSON.parse(fullBody);
}
