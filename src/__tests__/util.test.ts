import {
    getBar,
    getJSONResponse,
    msToTime,
    msToTimeString,
    paginate,
    parseTimeString,
    roundTo,
} from '../util.js';

describe('msToTime function', (): void => {
    test('converts milliseconds to a time object', (): void => {
        expect(msToTime(3600000)).toEqual({ d: 0, h: 1, m: 0, s: 0 });
    });

    test('converts milliseconds to seconds', (): void => {
        expect(msToTime(3600000, 's')).toBe(3600);
    });

    test('converts milliseconds to minutes', (): void => {
        expect(msToTime(3600000, 'm')).toBe(60);
    });

    test('converts milliseconds to hours', (): void => {
        expect(msToTime(3600000, 'h')).toBe(1);
    });

    test('converts milliseconds to days', (): void => {
        expect(msToTime(86400000, 'd')).toBe(1);
    });
});

describe('msToTimeString function', (): void => {
    test('returns a simple string for less than a day', (): void => {
        expect(msToTimeString({ d: 0, h: 0, m: 0, s: 5 }, true)).toBe('0:05');
        expect(msToTimeString({ d: 0, h: 0, m: 5, s: 5 }, true)).toBe('5:05');
        expect(msToTimeString({ d: 0, h: 5, m: 5, s: 5 }, true)).toBe(
            '5:05:05',
        );
    });

    test('returns "MORE_THAN_A_DAY" for more than a day', (): void => {
        expect(msToTimeString({ d: 1, h: 0, m: 0, s: 0 }, true)).toBe(
            'MORE_THAN_A_DAY',
        );
        expect(msToTimeString({ d: 2, h: 0, m: 0, s: 0 }, true)).toBe(
            'MORE_THAN_A_DAY',
        );
        expect(msToTimeString({ d: 1, h: 5, m: 5, s: 5 }, true)).toBe(
            'MORE_THAN_A_DAY',
        );
    });

    test('returns a detailed string for less than a day', (): void => {
        expect(msToTimeString({ d: 0, h: 0, m: 0, s: 5 })).toBe('5 secs');
        expect(msToTimeString({ d: 0, h: 0, m: 5, s: 5 })).toBe(
            '5 mins, 5 secs',
        );
        expect(msToTimeString({ d: 0, h: 5, m: 5, s: 5 })).toBe(
            '5 hrs, 5 mins, 5 secs',
        );
        expect(msToTimeString({ d: 0, h: 1, m: 1, s: 1 })).toBe(
            '1 hr, 1 min, 1 sec',
        );
    });

    test('returns a detailed string for more than a day', (): void => {
        expect(msToTimeString({ d: 1, h: 0, m: 0, s: 0 })).toBe('1 day');
        expect(msToTimeString({ d: 2, h: 0, m: 0, s: 0 })).toBe('2 days');
        expect(msToTimeString({ d: 1, h: 5, m: 5, s: 5 })).toBe(
            '1 day, 5 hrs, 5 mins, 5 secs',
        );
    });
});

describe('parseTimeString function', (): void => {
    test('parses simple time strings correctly', (): void => {
        expect(parseTimeString('1s')).toBe(1000);
        expect(parseTimeString('1m')).toBe(60000);
        expect(parseTimeString('1h')).toBe(3600000);
        expect(parseTimeString('1d')).toBe(86400000);
    });

    test('parses multiple time units correctly', (): void => {
        expect(parseTimeString('1h1m1s')).toBe(3661000);
        expect(parseTimeString('2d3h4m5s')).toBe(183845000);
    });

    test('parses time strings with multiple of the same unit correctly', (): void => {
        expect(parseTimeString('2s2s')).toBe(4000);
        expect(parseTimeString('3m3m3m')).toBe(540000);
    });

    test('parses time strings with no units correctly', (): void => {
        expect(parseTimeString('0')).toBe(0);
    });
});

describe('roundTo function', (): void => {
    it('should round numbers to the specified number of decimal places', (): void => {
        expect(roundTo(3.1415, 2)).toBe(3.14);
        expect(roundTo(3.1415, 3)).toBe(3.142);
        expect(roundTo(5.678, 0)).toBe(6);
    });

    it('should round negative numbers correctly', (): void => {
        expect(roundTo(-3.1415, 2)).toBe(-3.14);
        expect(roundTo(-3.1415, 3)).toBe(-3.142);
        expect(roundTo(-5.678, 0)).toBe(-6);
    });

    it('should round to 0 decimal places by default', (): void => {
        expect(roundTo(3.1415)).toBe(3);
        expect(roundTo(-3.1415)).toBe(-3);
    });
});

describe('getBar function', (): void => {
    it('should return the correct progress bar for progress percentage less than 10', (): void => {
        expect(getBar(9)).toBe('🔘▬▬▬▬▬▬▬▬▬');
        expect(getBar(5)).toBe('🔘▬▬▬▬▬▬▬▬▬');
        expect(getBar(0)).toBe('🔘▬▬▬▬▬▬▬▬▬');
    });

    it('should return the correct progress bar for progress percentage between 10 and 19', (): void => {
        expect(getBar(10)).toBe('▬🔘▬▬▬▬▬▬▬▬');
        expect(getBar(15)).toBe('▬🔘▬▬▬▬▬▬▬▬');
        expect(getBar(19)).toBe('▬🔘▬▬▬▬▬▬▬▬');
    });

    it('should return the correct progress bar for progress percentage between 20 and 29', (): void => {
        expect(getBar(20)).toBe('▬▬🔘▬▬▬▬▬▬▬');
        expect(getBar(25)).toBe('▬▬🔘▬▬▬▬▬▬▬');
        expect(getBar(29)).toBe('▬▬🔘▬▬▬▬▬▬▬');
    });

    it('should return the correct progress bar for progress percentage between 30 and 39', (): void => {
        expect(getBar(30)).toBe('▬▬▬🔘▬▬▬▬▬▬');
        expect(getBar(35)).toBe('▬▬▬🔘▬▬▬▬▬▬');
        expect(getBar(39)).toBe('▬▬▬🔘▬▬▬▬▬▬');
    });

    it('should return the correct progress bar for progress percentage between 40 and 49', (): void => {
        expect(getBar(40)).toBe('▬▬▬▬🔘▬▬▬▬▬');
        expect(getBar(45)).toBe('▬▬▬▬🔘▬▬▬▬▬');
        expect(getBar(49)).toBe('▬▬▬▬🔘▬▬▬▬▬');
    });

    it('should return the correct progress bar for progress percentage between 50 and 59', (): void => {
        expect(getBar(50)).toBe('▬▬▬▬▬🔘▬▬▬▬');
        expect(getBar(55)).toBe('▬▬▬▬▬🔘▬▬▬▬');
        expect(getBar(59)).toBe('▬▬▬▬▬🔘▬▬▬▬');
    });

    it('should return the correct progress bar for progress percentage between 60 and 69', (): void => {
        expect(getBar(60)).toBe('▬▬▬▬▬▬🔘▬▬▬');
        expect(getBar(65)).toBe('▬▬▬▬▬▬🔘▬▬▬');
        expect(getBar(69)).toBe('▬▬▬▬▬▬🔘▬▬▬');
    });

    it('should return the correct progress bar for progress percentage between 70 and 79', (): void => {
        expect(getBar(70)).toBe('▬▬▬▬▬▬▬🔘▬▬');
        expect(getBar(75)).toBe('▬▬▬▬▬▬▬🔘▬▬');
        expect(getBar(79)).toBe('▬▬▬▬▬▬▬🔘▬▬');
    });

    it('should return the correct progress bar for progress percentage between 80 and 89', (): void => {
        expect(getBar(80)).toBe('▬▬▬▬▬▬▬▬🔘▬');
        expect(getBar(85)).toBe('▬▬▬▬▬▬▬▬🔘▬');
        expect(getBar(89)).toBe('▬▬▬▬▬▬▬▬🔘▬');
    });

    it('should return the correct progress bar for progress percentage between 90 and 100', (): void => {
        expect(getBar(90)).toBe('▬▬▬▬▬▬▬▬▬🔘');
        expect(getBar(95)).toBe('▬▬▬▬▬▬▬▬▬🔘');
        expect(getBar(99)).toBe('▬▬▬▬▬▬▬▬▬🔘');
        expect(getBar(100)).toBe('▬▬▬▬▬▬▬▬▬🔘');
    });
});

describe('paginate function', (): void => {
    test('paginates an array of size 10 into pages of size 5', (): void => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const paginated = paginate(arr, 5);
        expect(paginated).toEqual([
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
        ]);
    });

    test('paginates an array of size 9 into pages of size 5', (): void => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const paginated = paginate(arr, 5);
        expect(paginated).toEqual([
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9],
        ]);
    });

    test('paginates an array of size 5 into pages of size 3', (): void => {
        const arr = [1, 2, 3, 4, 5];
        const paginated = paginate(arr, 3);
        expect(paginated).toEqual([
            [1, 2, 3],
            [4, 5],
        ]);
    });

    test('paginates an array of size 4 into pages of size 3', (): void => {
        const arr = [1, 2, 3, 4];
        const paginated = paginate(arr, 3);
        expect(paginated).toEqual([[1, 2, 3], [4]]);
    });

    test('paginates an empty array', (): void => {
        const arr: string[] = [];
        const paginated = paginate(arr, 3);
        expect(paginated).toEqual([]);
    });
});

describe('getJSONResponse function', (): void => {
    test('getJSONResponse should return a parsed JSON object', async (): Promise<void> => {
        const body = '{"a": 1, "b": 2}';
        const result = await getJSONResponse(body);
        expect(result).toEqual({ a: 1, b: 2 });
    });

    test('getJSONResponse should throw an error for an empty body', async (): Promise<void> => {
        const body = '';
        await expect(getJSONResponse(body)).rejects.toThrow();
    });

    test('getJSONResponse should throw an error for invalid JSON', async (): Promise<void> => {
        const body = '{"a": 1, b: 2}';
        await expect(getJSONResponse(body)).rejects.toThrow();
    });
});
