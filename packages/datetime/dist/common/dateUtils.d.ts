import * as moment from "moment";
export declare type DateRange = [Date | undefined, Date | undefined];
export declare type MomentDateRange = [moment.Moment, moment.Moment];
export declare enum DateRangeBoundary {
    START = 0,
    END = 1,
}
export declare function areEqual(date1: Date, date2: Date): boolean;
export declare function areRangesEqual(dateRange1: DateRange, dateRange2: DateRange): boolean;
export declare function areSameDay(date1: Date, date2: Date): boolean;
export declare function areSameMonth(date1: Date, date2: Date): boolean;
export declare function areSameTime(date1: Date, date2: Date): boolean;
export declare function clone(d: Date): Date;
export declare function isDayInRange(date: Date, dateRange: DateRange, exclusive?: boolean): boolean;
export declare function isDayRangeInRange(innerRange: DateRange, outerRange: DateRange): boolean;
export declare function isMonthInRange(date: Date, dateRange: DateRange): boolean;
export declare const isTimeEqualOrGreaterThan: (time: Date, timeToCompare: Date) => boolean;
export declare const isTimeEqualOrSmallerThan: (time: Date, timeToCompare: Date) => boolean;
export declare function isTimeInRange(date: Date, minDate: Date, maxDate: Date): boolean;
export declare function getTimeInRange(time: Date, minTime: Date, maxTime: Date): Date;
/**
 * Returns true if the time part of `date` is later than or equal to the time
 * part of `dateToCompare`. The day, month, and year parts will not be compared.
 */
export declare function isTimeSameOrAfter(date: Date, dateToCompare: Date): boolean;
/**
 * @returns a Date at the exact time-wise midpoint between startDate and endDate
 */
export declare function getDateBetween(dateRange: DateRange): Date;
export declare function getDateTime(date: Date, time: Date): Date;
export declare function getDateOnlyWithTime(date: Date): Date;
export declare function isMomentNull(momentDate: moment.Moment): boolean;
export declare function isMomentValidAndInRange(momentDate: moment.Moment, minDate: Date, maxDate: Date): boolean;
export declare function isMomentInRange(momentDate: moment.Moment, minDate: Date, maxDate: Date): boolean;
/**
 * Translate a Date object into a moment, adjusting the local timezone into the moment one.
 * This is a no-op unless moment-timezone's setDefault has been called.
 */
export declare function fromDateToMoment(date: Date): moment.Moment;
/**
 * Translate a moment into a Date object, adjusting the moment timezone into the local one.
 * This is a no-op unless moment-timezone's setDefault has been called.
 */
export declare function fromMomentToDate(momentDate: moment.Moment): Date;
/**
 * Translate a DateRange into a MomentDateRange, adjusting the local timezone
 * into the moment one (a no-op unless moment-timezone's setDefault has been
 * called).
 */
export declare function fromDateRangeToMomentDateRange(dateRange: DateRange): [moment.Moment, moment.Moment];
/**
 * Translate a MomentDateRange into a DateRange, adjusting the moment timezone
 * into the local one. This is a no-op unless moment-timezone's setDefault has
 * been called.
 */
export declare function fromMomentDateRangeToDateRange(momentDateRange: MomentDateRange): [Date, Date];
export declare function getDatePreviousMonth(date: Date): Date;
export declare function getDateNextMonth(date: Date): Date;
/**
 * Returns a date string in the provided format localized to the provided locale.
 */
export declare function toLocalizedDateString(momentDate: moment.Moment, format: string, locale: string | undefined): string;
