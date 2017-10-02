/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
var ReactDayPicker = require("react-day-picker");
var Classes = require("./common/classes");
var DateUtils = require("./common/dateUtils");
var Errors = require("./common/errors");
var datePickerCaption_1 = require("./datePickerCaption");
var datePickerCore_1 = require("./datePickerCore");
var DatePicker = (function (_super) {
    tslib_1.__extends(DatePicker, _super);
    function DatePicker(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.ignoreNextMonthChange = false;
        _this.disabledDays = function (day) { return !DateUtils.isDayInRange(day, [_this.props.minDate, _this.props.maxDate]); };
        _this.renderCaption = function (props) { return (React.createElement(datePickerCaption_1.DatePickerCaption, tslib_1.__assign({}, props, { maxDate: _this.props.maxDate, minDate: _this.props.minDate, onMonthChange: _this.handleMonthSelectChange, onYearChange: _this.handleYearSelectChange }))); };
        _this.handleDayClick = function (day, modifiers) {
            var newValue = day;
            if (_this.props.canClearSelection && modifiers.selected) {
                newValue = null;
            }
            if (_this.props.value === undefined) {
                // component is uncontrolled
                if (!modifiers.disabled) {
                    var displayMonth = day.getMonth();
                    var displayYear = day.getFullYear();
                    var selectedDay = day.getDate();
                    _this.setState({
                        displayMonth: displayMonth,
                        displayYear: displayYear,
                        selectedDay: selectedDay,
                        value: newValue,
                    });
                }
            }
            if (!modifiers.disabled) {
                core_1.Utils.safeInvoke(_this.props.onChange, newValue, true);
                if (_this.state.value != null && _this.state.value.getMonth() !== day.getMonth()) {
                    _this.ignoreNextMonthChange = true;
                }
            }
            else {
                // rerender base component to get around bug where you can navigate past bounds by clicking days
                _this.forceUpdate();
            }
        };
        _this.handleMonthChange = function (newDate) {
            var displayMonth = newDate.getMonth();
            var displayYear = newDate.getFullYear();
            var value = _this.state.value;
            if (value !== null) {
                value = _this.computeValidDateInSpecifiedMonthYear(displayYear, displayMonth);
                if (_this.ignoreNextMonthChange) {
                    _this.ignoreNextMonthChange = false;
                }
                else {
                    // if handleDayClick just got run, it means the user selected a date in a new month,
                    // so don't run onChange again
                    core_1.Utils.safeInvoke(_this.props.onChange, value, false);
                }
            }
            _this.setStateWithValueIfUncontrolled({ displayMonth: displayMonth, displayYear: displayYear }, value);
        };
        _this.handleMonthSelectChange = function (displayMonth) {
            var value = _this.state.value;
            if (value !== null) {
                value = _this.computeValidDateInSpecifiedMonthYear(value.getFullYear(), displayMonth);
                core_1.Utils.safeInvoke(_this.props.onChange, value, false);
            }
            _this.setStateWithValueIfUncontrolled({ displayMonth: displayMonth }, value);
        };
        _this.handleYearSelectChange = function (displayYear) {
            var _a = _this.state, displayMonth = _a.displayMonth, value = _a.value;
            if (value !== null) {
                value = _this.computeValidDateInSpecifiedMonthYear(displayYear, displayMonth);
                core_1.Utils.safeInvoke(_this.props.onChange, value, false);
                displayMonth = value.getMonth();
            }
            else {
                var _b = _this.props, minDate = _b.minDate, maxDate = _b.maxDate;
                var minYear = minDate.getFullYear();
                var maxYear = maxDate.getFullYear();
                var minMonth = minDate.getMonth();
                var maxMonth = maxDate.getMonth();
                if (displayYear === minYear && displayMonth < minMonth) {
                    displayMonth = minMonth;
                }
                else if (displayYear === maxYear && displayMonth > maxMonth) {
                    displayMonth = maxMonth;
                }
            }
            _this.setStateWithValueIfUncontrolled({ displayMonth: displayMonth, displayYear: displayYear }, value);
        };
        _this.handleClearClick = function () {
            if (_this.props.value === undefined) {
                _this.setState({ value: null });
            }
            core_1.Utils.safeInvoke(_this.props.onChange, null, true);
        };
        _this.handleTodayClick = function () {
            var value = new Date();
            var displayMonth = value.getMonth();
            var displayYear = value.getFullYear();
            var selectedDay = value.getDate();
            if (_this.props.value === undefined) {
                _this.setState({ displayMonth: displayMonth, displayYear: displayYear, selectedDay: selectedDay, value: value });
            }
            else {
                _this.setState({ displayMonth: displayMonth, displayYear: displayYear, selectedDay: selectedDay });
            }
            core_1.Utils.safeInvoke(_this.props.onChange, value, true);
        };
        var value = null;
        if (props.value !== undefined) {
            value = props.value;
        }
        else if (props.defaultValue != null) {
            value = props.defaultValue;
        }
        var selectedDay;
        if (value !== null) {
            selectedDay = value.getDate();
        }
        var initialMonth;
        var today = new Date();
        if (props.initialMonth != null) {
            initialMonth = props.initialMonth;
        }
        else if (value != null) {
            initialMonth = value;
        }
        else if (DateUtils.isDayInRange(today, [props.minDate, props.maxDate])) {
            initialMonth = today;
        }
        else {
            initialMonth = DateUtils.getDateBetween([props.minDate, props.maxDate]);
        }
        _this.state = {
            displayMonth: initialMonth.getMonth(),
            displayYear: initialMonth.getFullYear(),
            selectedDay: selectedDay,
            value: value,
        };
        return _this;
    }
    DatePicker.prototype.render = function () {
        var _a = this.props, className = _a.className, locale = _a.locale, localeUtils = _a.localeUtils, maxDate = _a.maxDate, minDate = _a.minDate, showActionsBar = _a.showActionsBar;
        var _b = this.state, displayMonth = _b.displayMonth, displayYear = _b.displayYear;
        return (React.createElement("div", { className: classNames(Classes.DATEPICKER, className) },
            React.createElement(ReactDayPicker, { canChangeMonth: true, captionElement: this.renderCaption, disabledDays: this.disabledDays, enableOutsideDays: true, fromMonth: minDate, locale: locale, localeUtils: localeUtils, modifiers: this.props.modifiers, month: new Date(displayYear, displayMonth), onDayClick: this.handleDayClick, onMonthChange: this.handleMonthChange, selectedDays: this.state.value, toMonth: maxDate }),
            showActionsBar ? this.renderOptionsBar() : null));
    };
    DatePicker.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.value !== this.props.value) {
            var _a = this.state, displayMonth = _a.displayMonth, displayYear = _a.displayYear, selectedDay = _a.selectedDay;
            if (nextProps.value != null) {
                displayMonth = nextProps.value.getMonth();
                displayYear = nextProps.value.getFullYear();
                selectedDay = nextProps.value.getDate();
            }
            this.setState({
                displayMonth: displayMonth,
                displayYear: displayYear,
                selectedDay: selectedDay,
                value: nextProps.value,
            });
        }
        _super.prototype.componentWillReceiveProps.call(this, nextProps);
    };
    DatePicker.prototype.validateProps = function (props) {
        var defaultValue = props.defaultValue, initialMonth = props.initialMonth, maxDate = props.maxDate, minDate = props.minDate, value = props.value;
        if (defaultValue != null && !DateUtils.isDayInRange(defaultValue, [minDate, maxDate])) {
            throw new Error(Errors.DATEPICKER_DEFAULT_VALUE_INVALID);
        }
        if (initialMonth != null && !DateUtils.isMonthInRange(initialMonth, [minDate, maxDate])) {
            throw new Error(Errors.DATEPICKER_INITIAL_MONTH_INVALID);
        }
        if (maxDate != null && minDate != null && maxDate < minDate && !DateUtils.areSameDay(maxDate, minDate)) {
            throw new Error(Errors.DATEPICKER_MAX_DATE_INVALID);
        }
        if (value != null && !DateUtils.isDayInRange(value, [minDate, maxDate])) {
            throw new Error(Errors.DATEPICKER_VALUE_INVALID);
        }
    };
    DatePicker.prototype.renderOptionsBar = function () {
        return (React.createElement("div", { className: Classes.DATEPICKER_FOOTER },
            React.createElement(core_1.Button, { className: "pt-minimal pt-datepicker-footer-button", onClick: this.handleTodayClick, text: "Today" }),
            React.createElement(core_1.Button, { className: "pt-minimal pt-datepicker-footer-button", onClick: this.handleClearClick, text: "Clear" })));
    };
    DatePicker.prototype.computeValidDateInSpecifiedMonthYear = function (displayYear, displayMonth) {
        var _a = this.props, minDate = _a.minDate, maxDate = _a.maxDate;
        var maxDaysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
        var selectedDay = this.state.selectedDay;
        if (selectedDay > maxDaysInMonth) {
            selectedDay = maxDaysInMonth;
        }
        // matches the underlying react-day-picker timestamp behavior
        var value = new Date(displayYear, displayMonth, selectedDay, 12);
        if (value < minDate) {
            value = minDate;
        }
        else if (value > maxDate) {
            value = maxDate;
        }
        return value;
    };
    DatePicker.prototype.setStateWithValueIfUncontrolled = function (newState, value) {
        if (this.props.value === undefined) {
            // uncontrolled mode means we track value in state
            newState.value = value;
        }
        return this.setState(newState);
    };
    return DatePicker;
}(core_1.AbstractComponent));
DatePicker.defaultProps = {
    canClearSelection: true,
    maxDate: datePickerCore_1.getDefaultMaxDate(),
    minDate: datePickerCore_1.getDefaultMinDate(),
    showActionsBar: false,
};
DatePicker.displayName = "Blueprint.DatePicker";
exports.DatePicker = DatePicker;
exports.DatePickerFactory = React.createFactory(DatePicker);

//# sourceMappingURL=datePicker.js.map
