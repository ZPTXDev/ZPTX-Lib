import { dirname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

/**
 * Accepted time formats for the msToTime function.
 * @see {@link msToTime}
 */
export type TimeFormats = 's' | 'm' | 'h' | 'd';

/**
 * A time object, returned by the msToTime function and used by the msToTimeString function.
 * @see {@link msToTime}
 * @see {@link msToTimeString}
 */
export type TimeObject = {
    d: number;
    h: number;
    m: number;
    s: number;
};

/**
 * Returns a time object (or a converted equivalent if a format is provided) converted from milliseconds.
 * @see {@link https://gist.github.com/flangofas/714f401b63a1c3d84aaa Reference}
 * @example
 * // { d: 2, h: 3, m: 4, s: 5 }
 * msToTime(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3 + 1000 * 60 * 4 + 1000 * 5 + 6)
 * @example
 * // 2
 * msToTime(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3 + 1000 * 60 * 4 + 1000 * 5 + 6, 'd')
 * @example
 * // 51
 * msToTime(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3 + 1000 * 60 * 4 + 1000 * 5 + 6, 'h')
 * @example
 * // 3064
 * msToTime(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3 + 1000 * 60 * 4 + 1000 * 5 + 6, 'm')
 * @example
 * // 183845
 * msToTime(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3 + 1000 * 60 * 4 + 1000 * 5 + 6, 's')
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
 * @example
 * // 2 days, 3 hrs, 4 mins, 5 secs
 * msToTimeString({ d: 2, h: 3, m: 4, s: 5 })
 * @example
 * // MORE_THAN_A_DAY
 * msToTimeString({ d: 2, h: 3, m: 4, s: 5 }, true)
 * @example
 * // 2:03:04
 * msToTimeString({ d: 0, h: 2, m: 3, s: 4 }, true)
 * @example
 * // 3:04
 * msToTimeString({ d: 0, h: 0, m: 3, s: 4 }, true)
 * @example
 * // 0:04
 * msToTimeString({ d: 0, h: 0, m: 0, s: 4 }, true)
 * @param msObject - The TimeObject.
 * @param simple - Whether to return a simple string or a more detailed one.
 * @returns The converted string.
 */
export function msToTimeString(msObject: TimeObject, simple?: false): string;
export function msToTimeString(
    msObject: TimeObject,
    simple: true,
): string | 'MORE_THAN_A_DAY';
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
 * @example
 * // 1000
 * parseTimeString('1s')
 * @example
 * // 61000
 * parseTimeString('1m1s')
 * @example
 * // 3661000
 * parseTimeString('1h 1m 1s')
 * @example
 * // 1000
 * parseTimeString('foo 1s bar')
 * @param timeString - The time string to parse.
 * @returns The parsed milliseconds.
 */
export function parseTimeString(timeString: string): number {
    let time = 0;
    let currentNumber = '';
    for (let i = 0; i < timeString.length; i++) {
        const currentChar = timeString[i];
        if (/\d/.test(currentChar)) {
            currentNumber += currentChar;
        } else if (currentNumber !== '') {
            const amount = parseInt(currentNumber);
            switch (currentChar) {
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
            currentNumber = '';
        }
    }
    return time;
}

/**
 * Returns a number rounded to the number of decimal places provided.
 * @see {@link https://stackoverflow.com/a/15762794 Reference}
 * @example
 * // 1.234
 * roundTo(1.23456, 3)
 * @example
 * // 1
 * roundTo(1.23456, 0)
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
 * @example
 * // 🔘▬▬▬▬▬▬▬▬▬
 * getBar(0)
 * @example
 * // ▬▬▬▬▬▬🔘▬▬▬
 * getBar(60)
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
 * @example
 * // [[1, 2], [3, 4], [5]]
 * paginate([1, 2, 3, 4, 5], 2)
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

/**
 * Returns an absolute file URL, readable by the ESM loader.
 * @example
 * // file:///absolute/path/to/src/index.js
 * getAbsoluteFileURL(import.meta.url, ['src', 'index.js'])
 * @param baseURL - The base URL of the module.
 * @param path - The path to the target file.
 * @returns The absolute file URL.
 */
export function getAbsoluteFileURL(baseURL: string, path: string[]): URL {
    const __dirname = dirname(fileURLToPath(baseURL));
    return pathToFileURL(resolve(__dirname, ...path));
}
