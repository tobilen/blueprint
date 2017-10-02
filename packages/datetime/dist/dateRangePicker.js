/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var classNames = require("classnames");
var React = require("react");
var DayPicker = require("react-day-picker");
var DateClasses = require("./common/classes");
var DateUtils = require("./common/dateUtils");
var DateRangeBoundary = DateUtils.DateRangeBoundary;
var Errors = require("./common/errors");
var monthAndYear_1 = require("./common/monthAndYear");
var datePickerCaption_1 = require("./datePickerCaption");
var datePickerCore_1 = require("./datePickerCore");
var dateRangeSelectionStrategy_1 = require("./dateRangeSelectionStrategy");
var DateRangePicker = (function (_super) {
    tslib_1.__extends(DateRangePicker, _super);
    function DateRangePicker(props, context) {
        var _this = _super.call(this, props, context) || this;
        // these will get merged with the user's own
        _this.modifiers = (_a = {},
            _a[datePickerCore_1.SELECTED_RANGE_MODIFIER] = function (day) {
                var value = _this.state.value;
                return value[0] != null && value[1] != null && DateUtils.isDayInRange(day, value, true);
            },
            _a[datePickerCore_1.SELECTED_RANGE_MODIFIER + "-start"] = function (day) { return DateUtils.areSameDay(_this.state.value[0], day); },
            _a[datePickerCore_1.SELECTED_RANGE_MODIFIER + "-end"] = function (day) { return DateUtils.areSameDay(_this.state.value[1], day); },
            _a[datePickerCore_1.HOVERED_RANGE_MODIFIER] = function (day) {
                var _a = _this.state, hoverValue = _a.hoverValue, value = _a.value;
                var selectedStart = value[0], selectedEnd = value[1];
                if (selectedStart == null && selectedEnd == null) {
                    return false;
                }
                if (hoverValue == null || hoverValue[0] == null || hoverValue[1] == null) {
                    return false;
                }
                return DateUtils.isDayInRange(day, hoverValue, true);
            },
            _a[datePickerCore_1.HOVERED_RANGE_MODIFIER + "-start"] = function (day) {
                var hoverValue = _this.state.hoverValue;
                if (hoverValue == null || hoverValue[0] == null) {
                    return false;
                }
                return DateUtils.areSameDay(hoverValue[0], day);
            },
            _a[datePickerCore_1.HOVERED_RANGE_MODIFIER + "-end"] = function (day) {
                var hoverValue = _this.state.hoverValue;
                if (hoverValue == null || hoverValue[1] == null) {
                    return false;
                }
                return DateUtils.areSameDay(hoverValue[1], day);
            },
            _a);
        _this.renderSingleCaption = function (captionProps) { return (React.createElement(datePickerCaption_1.DatePickerCaption, tslib_1.__assign({}, captionProps, { maxDate: _this.props.maxDate, minDate: _this.props.minDate, onMonthChange: _this.handleLeftMonthSelectChange, onYearChange: _this.handleLeftYearSelectChange }))); };
        _this.renderLeftCaption = function (captionProps) { return (React.createElement(datePickerCaption_1.DatePickerCaption, tslib_1.__assign({}, captionProps, { maxDate: DateUtils.getDatePreviousMonth(_this.props.maxDate), minDate: _this.props.minDate, onMonthChange: _this.handleLeftMonthSelectChange, onYearChange: _this.handleLeftYearSelectChange }))); };
        _this.renderRightCaption = function (captionProps) { return (React.createElement(datePickerCaption_1.DatePickerCaption, tslib_1.__assign({}, captionProps, { maxDate: _this.props.maxDate, minDate: DateUtils.getDateNextMonth(_this.props.minDate), onMonthChange: _this.handleRightMonthSelectChange, onYearChange: _this.handleRightYearSelectChange }))); };
        _this.handleDayMouseEnter = function (day, modifiers) {
            if (modifiers.disabled) {
                return;
            }
            var _a = dateRangeSelectionStrategy_1.DateRangeSelectionStrategy.getNextState(_this.state.value, day, _this.props.allowSingleDayRange, _this.props.boundaryToModify), dateRange = _a.dateRange, boundary = _a.boundary;
            _this.setState({ hoverValue: dateRange });
            core_1.Utils.safeInvoke(_this.props.onHoverChange, dateRange, day, boundary);
        };
        _this.handleDayMouseLeave = function (day, modifiers) {
            if (modifiers.disabled) {
                return;
            }
            _this.setState({ hoverValue: undefined });
            core_1.Utils.safeInvoke(_this.props.onHoverChange, undefined, day, undefined);
        };
        _this.handleDayClick = function (day, modifiers) {
            if (modifiers.disabled) {
                // rerender base component to get around bug where you can navigate past bounds by clicking days
                _this.forceUpdate();
                return;
            }
            var nextValue = dateRangeSelectionStrategy_1.DateRangeSelectionStrategy.getNextState(_this.state.value, day, _this.props.allowSingleDayRange, _this.props.boundaryToModify).dateRange;
            // update the hovered date range after click to show the newly selected
            // state, at leasts until the mouse moves again
            _this.handleDayMouseEnter(day, modifiers);
            _this.handleNextState(nextValue);
        };
        _this.handleLeftMonthChange = function (newDate) {
            var leftView = new monthAndYear_1.MonthAndYear(newDate.getMonth(), newDate.getFullYear());
            _this.updateLeftView(leftView);
        };
        _this.handleRightMonthChange = function (newDate) {
            var rightView = new monthAndYear_1.MonthAndYear(newDate.getMonth(), newDate.getFullYear());
            _this.updateRightView(rightView);
        };
        _this.handleLeftMonthSelectChange = function (leftMonth) {
            var leftView = new monthAndYear_1.MonthAndYear(leftMonth, _this.state.leftView.getYear());
            _this.updateLeftView(leftView);
        };
        _this.handleRightMonthSelectChange = function (rightMonth) {
            var rightView = new monthAndYear_1.MonthAndYear(rightMonth, _this.state.rightView.getYear());
            _this.updateRightView(rightView);
        };
        /*
        * The min / max months are offset by one because we are showing two months.
        * We do a comparison check to see if
        *   a) the proposed [Month, Year] change throws the two calendars out of order
        *   b) the proposed [Month, Year] goes beyond the min / max months
        * and rectify appropriately.
        */
        _this.handleLeftYearSelectChange = function (leftDisplayYear) {
            var leftView = new monthAndYear_1.MonthAndYear(_this.state.leftView.getMonth(), leftDisplayYear);
            var _a = _this.props, minDate = _a.minDate, maxDate = _a.maxDate;
            var adjustedMaxDate = DateUtils.getDatePreviousMonth(maxDate);
            var minMonthAndYear = new monthAndYear_1.MonthAndYear(minDate.getMonth(), minDate.getFullYear());
            var maxMonthAndYear = new monthAndYear_1.MonthAndYear(adjustedMaxDate.getMonth(), adjustedMaxDate.getFullYear());
            if (leftView.isBefore(minMonthAndYear)) {
                leftView = minMonthAndYear;
            }
            else if (leftView.isAfter(maxMonthAndYear)) {
                leftView = maxMonthAndYear;
            }
            var rightView = _this.state.rightView.clone();
            if (!leftView.isBefore(rightView)) {
                rightView = leftView.getNextMonth();
            }
            _this.setViews(leftView, rightView);
        };
        _this.handleRightYearSelectChange = function (rightDisplayYear) {
            var rightView = new monthAndYear_1.MonthAndYear(_this.state.rightView.getMonth(), rightDisplayYear);
            var _a = _this.props, minDate = _a.minDate, maxDate = _a.maxDate;
            var adjustedMinDate = DateUtils.getDateNextMonth(minDate);
            var minMonthAndYear = new monthAndYear_1.MonthAndYear(adjustedMinDate.getMonth(), adjustedMinDate.getFullYear());
            var maxMonthAndYear = new monthAndYear_1.MonthAndYear(maxDate.getMonth(), maxDate.getFullYear());
            if (rightView.isBefore(minMonthAndYear)) {
                rightView = minMonthAndYear;
            }
            else if (rightView.isAfter(maxMonthAndYear)) {
                rightView = maxMonthAndYear;
            }
            var leftView = _this.state.leftView.clone();
            if (!rightView.isAfter(leftView)) {
                leftView = rightView.getPreviousMonth();
            }
            _this.setViews(leftView, rightView);
        };
        var value = [null, null];
        if (props.value != null) {
            value = props.value;
        }
        else if (props.defaultValue != null) {
            value = props.defaultValue;
        }
        var initialMonth;
        var today = new Date();
        if (props.initialMonth != null) {
            initialMonth = props.initialMonth;
        }
        else if (value[0] != null) {
            initialMonth = DateUtils.clone(value[0]);
        }
        else if (DateUtils.isDayInRange(today, [props.minDate, props.maxDate])) {
            initialMonth = today;
        }
        else {
            initialMonth = DateUtils.getDateBetween([props.minDate, props.maxDate]);
        }
        /*
        * if the initial month is the last month of the picker's
        * allowable range, the react-day-picker library will show
        * the max month on the left and the *min* month on the right.
        * subtracting one avoids that weird, wraparound state (#289).
        */
        var initialMonthEqualsMinMonth = DateUtils.areSameMonth(initialMonth, props.minDate);
        var initalMonthEqualsMaxMonth = DateUtils.areSameMonth(initialMonth, props.maxDate);
        if (!initialMonthEqualsMinMonth && initalMonthEqualsMaxMonth) {
            initialMonth.setMonth(initialMonth.getMonth() - 1);
        }
        var leftView = new monthAndYear_1.MonthAndYear(initialMonth.getMonth(), initialMonth.getFullYear());
        var rightView = leftView.getNextMonth();
        _this.state = { leftView: leftView, rightView: rightView, value: value, hoverValue: [null, null] };
        return _this;
        var _a;
    }
    Object.defineProperty(DateRangePicker.prototype, "isControlled", {
        get: function () {
            return this.props.value != null;
        },
        enumerable: true,
        configurable: true
    });
    DateRangePicker.prototype.render = function () {
        var modifiers = datePickerCore_1.combineModifiers(this.modifiers, this.props.modifiers);
        var _a = this.props, className = _a.className, contiguousCalendarMonths = _a.contiguousCalendarMonths, locale = _a.locale, localeUtils = _a.localeUtils, maxDate = _a.maxDate, minDate = _a.minDate;
        var isShowingOneMonth = DateUtils.areSameMonth(this.props.minDate, this.props.maxDate);
        var _b = this.state, leftView = _b.leftView, rightView = _b.rightView;
        var disabledDays = [{ before: this.props.minDate }, { after: this.props.maxDate }];
        var dayPickerBaseProps = {
            disabledDays: disabledDays,
            locale: locale,
            localeUtils: localeUtils,
            modifiers: modifiers,
            onDayClick: this.handleDayClick,
            onDayMouseEnter: this.handleDayMouseEnter,
            onDayMouseLeave: this.handleDayMouseLeave,
            selectedDays: this.state.value,
        };
        if (contiguousCalendarMonths || isShowingOneMonth) {
            var classes = classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className, (_c = {},
                _c[DateClasses.DATERANGEPICKER_CONTIGUOUS] = contiguousCalendarMonths,
                _c[DateClasses.DATERANGEPICKER_SINGLE_MONTH] = isShowingOneMonth,
                _c));
            // use the left DayPicker when we only need one
            return (React.createElement("div", { className: classes },
                this.maybeRenderShortcuts(),
                React.createElement(DayPicker, tslib_1.__assign({}, dayPickerBaseProps, { captionElement: this.renderSingleCaption, fromMonth: minDate, month: leftView.getFullDate(), numberOfMonths: isShowingOneMonth ? 1 : 2, onMonthChange: this.handleLeftMonthChange, toMonth: maxDate }))));
        }
        else {
            return (React.createElement("div", { className: classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className) },
                this.maybeRenderShortcuts(),
                React.createElement(DayPicker, tslib_1.__assign({}, dayPickerBaseProps, { canChangeMonth: true, captionElement: this.renderLeftCaption, fromMonth: minDate, month: leftView.getFullDate(), onMonthChange: this.handleLeftMonthChange, toMonth: DateUtils.getDatePreviousMonth(maxDate) })),
                React.createElement(DayPicker, tslib_1.__assign({}, dayPickerBaseProps, { canChangeMonth: true, captionElement: this.renderRightCaption, fromMonth: DateUtils.getDateNextMonth(minDate), month: rightView.getFullDate(), onMonthChange: this.handleRightMonthChange, toMonth: maxDate }))));
        }
        var _c;
    };
    DateRangePicker.prototype.componentWillReceiveProps = function (nextProps) {
        _super.prototype.componentWillReceiveProps.call(this, nextProps);
        if (!DateUtils.areRangesEqual(this.props.value, nextProps.value)) {
            var nextState = getStateChange(this.props.value, nextProps.value, this.state, nextProps.contiguousCalendarMonths);
            this.setState(nextState);
        }
    };
    DateRangePicker.prototype.validateProps = function (props) {
        var defaultValue = props.defaultValue, initialMonth = props.initialMonth, maxDate = props.maxDate, minDate = props.minDate, boundaryToModify = props.boundaryToModify, value = props.value;
        var dateRange = [minDate, maxDate];
        if (defaultValue != null && !DateUtils.isDayRangeInRange(defaultValue, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID);
        }
        if (initialMonth != null && !DateUtils.isMonthInRange(initialMonth, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID);
        }
        if (maxDate != null && minDate != null && maxDate < minDate && !DateUtils.areSameDay(maxDate, minDate)) {
            throw new Error(Errors.DATERANGEPICKER_MAX_DATE_INVALID);
        }
        if (value != null && !DateUtils.isDayRangeInRange(value, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_VALUE_INVALID);
        }
        if (boundaryToModify != null &&
            boundaryToModify !== DateRangeBoundary.START &&
            boundaryToModify !== DateRangeBoundary.END) {
            throw new Error(Errors.DATERANGEPICKER_PREFERRED_BOUNDARY_TO_MODIFY_INVALID);
        }
    };
    DateRangePicker.prototype.maybeRenderShortcuts = function () {
        var _this = this;
        var propsShortcuts = this.props.shortcuts;
        if (propsShortcuts == null || propsShortcuts === false) {
            return undefined;
        }
        var shortcuts = typeof propsShortcuts === "boolean" ? createDefaultShortcuts() : propsShortcuts;
        var shortcutElements = shortcuts.map(function (s, i) {
            return (React.createElement(core_1.MenuItem, { className: core_1.Classes.POPOVER_DISMISS_OVERRIDE, disabled: !_this.isShortcutInRange(s.dateRange), key: i, onClick: _this.getShorcutClickHandler(s.dateRange), text: s.label }));
        });
        return React.createElement(core_1.Menu, { className: DateClasses.DATERANGEPICKER_SHORTCUTS }, shortcutElements);
    };
    DateRangePicker.prototype.getShorcutClickHandler = function (nextValue) {
        var _this = this;
        return function () { return _this.handleNextState(nextValue); };
    };
    DateRangePicker.prototype.handleNextState = function (nextValue) {
        var value = this.state.value;
        var nextState = getStateChange(value, nextValue, this.state, this.props.contiguousCalendarMonths);
        if (!this.isControlled) {
            this.setState(nextState);
        }
        core_1.Utils.safeInvoke(this.props.onChange, nextValue);
    };
    DateRangePicker.prototype.updateLeftView = function (leftView) {
        var rightView = this.state.rightView.clone();
        if (!leftView.isBefore(rightView)) {
            rightView = leftView.getNextMonth();
        }
        this.setViews(leftView, rightView);
    };
    DateRangePicker.prototype.updateRightView = function (rightView) {
        var leftView = this.state.leftView.clone();
        if (!rightView.isAfter(leftView)) {
            leftView = rightView.getPreviousMonth();
        }
        this.setViews(leftView, rightView);
    };
    DateRangePicker.prototype.setViews = function (leftView, rightView) {
        this.setState({ leftView: leftView, rightView: rightView });
    };
    DateRangePicker.prototype.isShortcutInRange = function (shortcutDateRange) {
        return DateUtils.isDayRangeInRange(shortcutDateRange, [this.props.minDate, this.props.maxDate]);
    };
    return DateRangePicker;
}(core_1.AbstractComponent));
DateRangePicker.defaultProps = {
    allowSingleDayRange: false,
    contiguousCalendarMonths: true,
    maxDate: datePickerCore_1.getDefaultMaxDate(),
    minDate: datePickerCore_1.getDefaultMinDate(),
    shortcuts: true,
};
DateRangePicker.displayName = "Blueprint.DateRangePicker";
exports.DateRangePicker = DateRangePicker;
function getStateChange(value, nextValue, state, contiguousCalendarMonths) {
    var returnVal;
    if (value != null && nextValue == null) {
        returnVal = { value: [null, null] };
    }
    else if (nextValue != null) {
        var nextValueStart = nextValue[0], nextValueEnd = nextValue[1];
        var leftView = state.leftView.clone();
        var rightView = state.rightView.clone();
        /*
        * Only end date selected.
        * If the newly selected end date isn't in either of the displayed months, then
        *   - set the right DayPicker to the month of the selected end date
        *   - ensure the left DayPicker is before the right, changing if needed
        */
        if (nextValueStart == null && nextValueEnd != null) {
            var nextValueEndMonthAndYear = new monthAndYear_1.MonthAndYear(nextValueEnd.getMonth(), nextValueEnd.getFullYear());
            if (!nextValueEndMonthAndYear.isSame(leftView) && !nextValueEndMonthAndYear.isSame(rightView)) {
                rightView = nextValueEndMonthAndYear;
                if (!leftView.isBefore(rightView)) {
                    leftView = rightView.getPreviousMonth();
                }
            }
            /*
        * Only start date selected.
        * If the newly selected start date isn't in either of the displayed months, then
        *   - set the left DayPicker to the month of the selected start date
        *   - ensure the right DayPicker is before the left, changing if needed
        */
        }
        else if (nextValueStart != null && nextValueEnd == null) {
            var nextValueStartMonthAndYear = new monthAndYear_1.MonthAndYear(nextValueStart.getMonth(), nextValueStart.getFullYear());
            if (!nextValueStartMonthAndYear.isSame(leftView) && !nextValueStartMonthAndYear.isSame(rightView)) {
                leftView = nextValueStartMonthAndYear;
                if (!rightView.isAfter(leftView)) {
                    rightView = leftView.getNextMonth();
                }
            }
            /*
        * Both start date and end date selected.
        */
        }
        else if (nextValueStart != null && nextValueEnd != null) {
            var nextValueStartMonthAndYear = new monthAndYear_1.MonthAndYear(nextValueStart.getMonth(), nextValueStart.getFullYear());
            var nextValueEndMonthAndYear = new monthAndYear_1.MonthAndYear(nextValueEnd.getMonth(), nextValueEnd.getFullYear());
            /*
            * Both start and end date months are identical
            * If the selected month isn't in either of the displayed months, then
            *   - set the left DayPicker to be the selected month
            *   - set the right DayPicker to +1
            */
            if (DateUtils.areSameMonth(nextValueStart, nextValueEnd)) {
                var potentialLeftEqualsNextValueStart = leftView.isSame(nextValueStartMonthAndYear);
                var potentialRightEqualsNextValueStart = rightView.isSame(nextValueStartMonthAndYear);
                if (potentialLeftEqualsNextValueStart || potentialRightEqualsNextValueStart) {
                    // do nothing
                }
                else {
                    leftView = nextValueStartMonthAndYear;
                    rightView = nextValueStartMonthAndYear.getNextMonth();
                }
                /*
            * Different start and end date months, adjust display months.
            */
            }
            else {
                if (!leftView.isSame(nextValueStartMonthAndYear)) {
                    leftView = nextValueStartMonthAndYear;
                    rightView = nextValueStartMonthAndYear.getNextMonth();
                }
                if (contiguousCalendarMonths === false && !rightView.isSame(nextValueEndMonthAndYear)) {
                    rightView = nextValueEndMonthAndYear;
                }
            }
        }
        returnVal = {
            leftView: leftView,
            rightView: rightView,
            value: nextValue,
        };
    }
    else {
        returnVal = {};
    }
    return returnVal;
}
function createShortcut(label, dateRange) {
    return { dateRange: dateRange, label: label };
}
function createDefaultShortcuts() {
    var today = new Date();
    var makeDate = function (action) {
        var returnVal = DateUtils.clone(today);
        action(returnVal);
        returnVal.setDate(returnVal.getDate() + 1);
        return returnVal;
    };
    var oneWeekAgo = makeDate(function (d) { return d.setDate(d.getDate() - 7); });
    var oneMonthAgo = makeDate(function (d) { return d.setMonth(d.getMonth() - 1); });
    var threeMonthsAgo = makeDate(function (d) { return d.setMonth(d.getMonth() - 3); });
    var sixMonthsAgo = makeDate(function (d) { return d.setMonth(d.getMonth() - 6); });
    var oneYearAgo = makeDate(function (d) { return d.setFullYear(d.getFullYear() - 1); });
    var twoYearsAgo = makeDate(function (d) { return d.setFullYear(d.getFullYear() - 2); });
    return [
        createShortcut("Past week", [oneWeekAgo, today]),
        createShortcut("Past month", [oneMonthAgo, today]),
        createShortcut("Past 3 months", [threeMonthsAgo, today]),
        createShortcut("Past 6 months", [sixMonthsAgo, today]),
        createShortcut("Past year", [oneYearAgo, today]),
        createShortcut("Past 2 years", [twoYearsAgo, today]),
    ];
}
exports.DateRangePickerFactory = React.createFactory(DateRangePicker);

//# sourceMappingURL=dateRangePicker.js.map
