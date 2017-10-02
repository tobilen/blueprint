/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var DateRangeBoundary;
(function (DateRangeBoundary) {
    DateRangeBoundary[DateRangeBoundary["START"] = 0] = "START";
    DateRangeBoundary[DateRangeBoundary["END"] = 1] = "END";
})(DateRangeBoundary = exports.DateRangeBoundary || (exports.DateRangeBoundary = {}));
function areEqual(date1, date2) {
    if (date1 == null && date2 == null) {
        return true;
    }
    else if (date1 == null || date2 == null) {
        return false;
    }
    else {
        return date1.getTime() === date2.getTime();
    }
}
exports.areEqual = areEqual;
function areRangesEqual(dateRange1, dateRange2) {
    if (dateRange1 == null && dateRange2 == null) {
        return true;
    }
    else if (dateRange1 == null || dateRange2 == null) {
        return false;
    }
    else {
        var start1 = dateRange1[0], end1 = dateRange1[1];
        var start2 = dateRange2[0], end2 = dateRange2[1];
        var areStartsEqual = (start1 == null && start2 == null) || areSameDay(start1, start2);
        var areEndsEqual = (end1 == null && end2 == null) || areSameDay(end1, end2);
        return areStartsEqual && areEndsEqual;
    }
}
exports.areRangesEqual = areRangesEqual;
function areSameDay(date1, date2) {
    return (date1 != null &&
        date2 != null &&
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear());
}
exports.areSameDay = areSameDay;
function areSameMonth(date1, date2) {
    return (date1 != null &&
        date2 != null &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear());
}
exports.areSameMonth = areSameMonth;
function areSameTime(date1, date2) {
    return (date1 != null &&
        date2 != null &&
        date1.getHours() === date2.getHours() &&
        date1.getMinutes() === date2.getMinutes() &&
        date1.getSeconds() === date2.getSeconds() &&
        date1.getMilliseconds() === date2.getMilliseconds());
}
exports.areSameTime = areSameTime;
function clone(d) {
    return new Date(d.getTime());
}
exports.clone = clone;
function isDayInRange(date, dateRange, exclusive) {
    if (exclusive === void 0) { exclusive = false; }
    if (date == null) {
        return false;
    }
    var day = clone(date);
    var start = clone(dateRange[0]);
    var end = clone(dateRange[1]);
    day.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return start <= day && day <= end && (!exclusive || (!areSameDay(start, day) && !areSameDay(day, end)));
}
exports.isDayInRange = isDayInRange;
function isDayRangeInRange(innerRange, outerRange) {
    return ((innerRange[0] == null || isDayInRange(innerRange[0], outerRange)) &&
        (innerRange[1] == null || isDayInRange(innerRange[1], outerRange)));
}
exports.isDayRangeInRange = isDayRangeInRange;
function isMonthInRange(date, dateRange) {
    if (date == null) {
        return false;
    }
    var day = clone(date);
    var start = clone(dateRange[0]);
    var end = clone(dateRange[1]);
    day.setDate(1);
    start.setDate(1);
    end.setDate(1);
    day.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return start <= day && day <= end;
}
exports.isMonthInRange = isMonthInRange;
exports.isTimeEqualOrGreaterThan = function (time, timeToCompare) { return time.getTime() >= timeToCompare.getTime(); };
exports.isTimeEqualOrSmallerThan = function (time, timeToCompare) { return time.getTime() <= timeToCompare.getTime(); };
function isTimeInRange(date, minDate, maxDate) {
    var time = getDateOnlyWithTime(date);
    var minTime = getDateOnlyWithTime(minDate);
    var maxTime = getDateOnlyWithTime(maxDate);
    var isTimeGreaterThanMinTime = exports.isTimeEqualOrGreaterThan(time, minTime);
    var isTimeSmallerThanMaxTime = exports.isTimeEqualOrSmallerThan(time, maxTime);
    if (exports.isTimeEqualOrSmallerThan(maxTime, minTime)) {
        return isTimeGreaterThanMinTime || isTimeSmallerThanMaxTime;
    }
    return isTimeGreaterThanMinTime && isTimeSmallerThanMaxTime;
}
exports.isTimeInRange = isTimeInRange;
function getTimeInRange(time, minTime, maxTime) {
    if (areSameTime(minTime, maxTime)) {
        return maxTime;
    }
    else if (isTimeInRange(time, minTime, maxTime)) {
        return time;
    }
    else if (isTimeSameOrAfter(time, maxTime)) {
        return maxTime;
    }
    return minTime;
}
exports.getTimeInRange = getTimeInRange;
/**
 * Returns true if the time part of `date` is later than or equal to the time
 * part of `dateToCompare`. The day, month, and year parts will not be compared.
 */
function isTimeSameOrAfter(date, dateToCompare) {
    var time = getDateOnlyWithTime(date);
    var timeToCompare = getDateOnlyWithTime(dateToCompare);
    return exports.isTimeEqualOrGreaterThan(time, timeToCompare);
}
exports.isTimeSameOrAfter = isTimeSameOrAfter;
/**
 * @returns a Date at the exact time-wise midpoint between startDate and endDate
 */
function getDateBetween(dateRange) {
    var start = dateRange[0].getTime();
    var end = dateRange[1].getTime();
    var middle = start + (end - start) * 0.5;
    return new Date(middle);
}
exports.getDateBetween = getDateBetween;
function getDateTime(date, time) {
    if (date === null) {
        return null;
    }
    else if (time === null) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    }
    else {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
    }
}
exports.getDateTime = getDateTime;
function getDateOnlyWithTime(date) {
    return new Date(0, 0, 0, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}
exports.getDateOnlyWithTime = getDateOnlyWithTime;
function isMomentNull(momentDate) {
    return momentDate.parsingFlags().nullInput;
}
exports.isMomentNull = isMomentNull;
function isMomentValidAndInRange(momentDate, minDate, maxDate) {
    return momentDate.isValid() && isMomentInRange(momentDate, minDate, maxDate);
}
exports.isMomentValidAndInRange = isMomentValidAndInRange;
function isMomentInRange(momentDate, minDate, maxDate) {
    return momentDate.isBetween(minDate, maxDate, "day", "[]");
}
exports.isMomentInRange = isMomentInRange;
/**
 * Translate a Date object into a moment, adjusting the local timezone into the moment one.
 * This is a no-op unless moment-timezone's setDefault has been called.
 */
function fromDateToMoment(date) {
    if (date == null) {
        // moment(undefined) is equivalent to moment(), which returns the current date and time when
        // invoked. thus, we need to explicitly return moment(null).
        return moment(null);
    }
    else if (typeof date === "string") {
        return moment(date);
    }
    else {
        return moment([
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds(),
        ]);
    }
}
exports.fromDateToMoment = fromDateToMoment;
/**
 * Translate a moment into a Date object, adjusting the moment timezone into the local one.
 * This is a no-op unless moment-timezone's setDefault has been called.
 */
function fromMomentToDate(momentDate) {
    if (momentDate == null) {
        return undefined;
    }
    else {
        return new Date(momentDate.year(), momentDate.month(), momentDate.date(), momentDate.hours(), momentDate.minutes(), momentDate.seconds(), momentDate.milliseconds());
    }
}
exports.fromMomentToDate = fromMomentToDate;
/**
 * Translate a DateRange into a MomentDateRange, adjusting the local timezone
 * into the moment one (a no-op unless moment-timezone's setDefault has been
 * called).
 */
function fromDateRangeToMomentDateRange(dateRange) {
    if (dateRange == null) {
        return undefined;
    }
    return [fromDateToMoment(dateRange[0]), fromDateToMoment(dateRange[1])];
}
exports.fromDateRangeToMomentDateRange = fromDateRangeToMomentDateRange;
/**
 * Translate a MomentDateRange into a DateRange, adjusting the moment timezone
 * into the local one. This is a no-op unless moment-timezone's setDefault has
 * been called.
 */
function fromMomentDateRangeToDateRange(momentDateRange) {
    if (momentDateRange == null) {
        return undefined;
    }
    return [fromMomentToDate(momentDateRange[0]), fromMomentToDate(momentDateRange[1])];
}
exports.fromMomentDateRangeToDateRange = fromMomentDateRangeToDateRange;
function getDatePreviousMonth(date) {
    if (date.getMonth() === 0 /* JANUARY */) {
        return new Date(date.getFullYear() - 1, 11 /* DECEMBER */);
    }
    else {
        return new Date(date.getFullYear(), date.getMonth() - 1);
    }
}
exports.getDatePreviousMonth = getDatePreviousMonth;
function getDateNextMonth(date) {
    if (date.getMonth() === 11 /* DECEMBER */) {
        return new Date(date.getFullYear() + 1, 0 /* JANUARY */);
    }
    else {
        return new Date(date.getFullYear(), date.getMonth() + 1);
    }
}
exports.getDateNextMonth = getDateNextMonth;
/**
 * Returns a date string in the provided format localized to the provided locale.
 */
function toLocalizedDateString(momentDate, format, locale) {
    var adjustedMomentDate = locale != null ? momentDate.locale(locale) : momentDate;
    return adjustedMomentDate.format(format);
}
exports.toLocalizedDateString = toLocalizedDateString;

//# sourceMappingURL=dateUtils.js.map
