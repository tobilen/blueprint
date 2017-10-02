/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classNames = require("classnames");
var moment = require("moment");
var React = require("react");
var core_1 = require("@blueprintjs/core");
var dateUtils_1 = require("./common/dateUtils");
var errors_1 = require("./common/errors");
var datePicker_1 = require("./datePicker");
var datePickerCore_1 = require("./datePickerCore");
var dateTimePicker_1 = require("./dateTimePicker");
var DateInput = (function (_super) {
    tslib_1.__extends(DateInput, _super);
    function DateInput(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.inputRef = null;
        _this.getDateString = function (value) {
            if (dateUtils_1.isMomentNull(value)) {
                return "";
            }
            if (value.isValid()) {
                if (_this.isMomentInRange(value)) {
                    return dateUtils_1.toLocalizedDateString(value, _this.props.format, _this.props.locale);
                }
                else {
                    return _this.props.outOfRangeMessage;
                }
            }
            return _this.props.invalidDateMessage;
        };
        _this.handleClosePopover = function (e) {
            var _a = _this.props.popoverProps, popoverProps = _a === void 0 ? {} : _a;
            core_1.Utils.safeInvoke(popoverProps.onClose, e);
            _this.setState({ isOpen: false });
        };
        _this.handleDateChange = function (date, hasUserManuallySelectedDate) {
            var prevMomentDate = _this.state.value;
            var momentDate = dateUtils_1.fromDateToMoment(date);
            // this change handler was triggered by a change in month, day, or (if enabled) time. for UX
            // purposes, we want to close the popover only if the user explicitly clicked a day within
            // the current month.
            var isOpen = !hasUserManuallySelectedDate ||
                _this.hasMonthChanged(prevMomentDate, momentDate) ||
                _this.hasTimeChanged(prevMomentDate, momentDate) ||
                !_this.props.closeOnSelection;
            if (_this.props.value === undefined) {
                _this.setState({ isInputFocused: false, isOpen: isOpen, value: momentDate });
            }
            else {
                _this.setState({ isInputFocused: false, isOpen: isOpen });
            }
            core_1.Utils.safeInvoke(_this.props.onChange, date === null ? null : dateUtils_1.fromMomentToDate(momentDate));
        };
        _this.handleInputFocus = function (e) {
            var valueString;
            if (dateUtils_1.isMomentNull(_this.state.value)) {
                valueString = "";
            }
            else {
                valueString = dateUtils_1.toLocalizedDateString(_this.state.value, _this.props.format, _this.props.locale);
            }
            if (_this.props.openOnFocus) {
                _this.setState({ isInputFocused: true, isOpen: true, valueString: valueString });
            }
            else {
                _this.setState({ isInputFocused: true, valueString: valueString });
            }
            _this.safeInvokeInputProp("onFocus", e);
        };
        _this.handleInputClick = function (e) {
            if (_this.props.openOnFocus) {
                e.stopPropagation();
            }
            _this.safeInvokeInputProp("onClick", e);
        };
        _this.handleInputChange = function (e) {
            var valueString = e.target.value;
            var value = _this.createMoment(valueString);
            if (value.isValid() && _this.isMomentInRange(value)) {
                if (_this.props.value === undefined) {
                    _this.setState({ value: value, valueString: valueString });
                }
                else {
                    _this.setState({ valueString: valueString });
                }
                core_1.Utils.safeInvoke(_this.props.onChange, dateUtils_1.fromMomentToDate(value));
            }
            else {
                if (valueString.length === 0) {
                    core_1.Utils.safeInvoke(_this.props.onChange, null);
                }
                _this.setState({ valueString: valueString });
            }
            _this.safeInvokeInputProp("onChange", e);
        };
        _this.handleInputBlur = function (e) {
            var valueString = _this.state.valueString;
            var value = _this.createMoment(valueString);
            if (valueString.length > 0 &&
                valueString !== _this.getDateString(_this.state.value) &&
                (!value.isValid() || !_this.isMomentInRange(value))) {
                if (_this.props.value === undefined) {
                    _this.setState({ isInputFocused: false, value: value, valueString: null });
                }
                else {
                    _this.setState({ isInputFocused: false });
                }
                if (!value.isValid()) {
                    core_1.Utils.safeInvoke(_this.props.onError, new Date(undefined));
                }
                else if (!_this.isMomentInRange(value)) {
                    core_1.Utils.safeInvoke(_this.props.onError, dateUtils_1.fromMomentToDate(value));
                }
                else {
                    core_1.Utils.safeInvoke(_this.props.onChange, dateUtils_1.fromMomentToDate(value));
                }
            }
            else {
                if (valueString.length === 0) {
                    _this.setState({ isInputFocused: false, value: moment(null), valueString: null });
                }
                else {
                    _this.setState({ isInputFocused: false });
                }
            }
            _this.safeInvokeInputProp("onBlur", e);
        };
        _this.setInputRef = function (el) {
            _this.inputRef = el;
            var _a = _this.props.inputProps, inputProps = _a === void 0 ? {} : _a;
            core_1.Utils.safeInvoke(inputProps.inputRef, el);
        };
        var defaultValue = _this.props.defaultValue ? dateUtils_1.fromDateToMoment(_this.props.defaultValue) : moment(null);
        _this.state = {
            isInputFocused: false,
            isOpen: false,
            value: _this.props.value !== undefined ? dateUtils_1.fromDateToMoment(_this.props.value) : defaultValue,
            valueString: null,
        };
        return _this;
    }
    DateInput.prototype.render = function () {
        var _a = this.state, value = _a.value, valueString = _a.valueString;
        var dateString = this.state.isInputFocused ? valueString : this.getDateString(value);
        var date = this.state.isInputFocused ? this.createMoment(valueString) : value;
        var dateValue = this.isMomentValidAndInRange(value) ? dateUtils_1.fromMomentToDate(value) : null;
        var popoverContent = this.props.timePrecision === undefined ? (React.createElement(datePicker_1.DatePicker, tslib_1.__assign({}, this.props, { onChange: this.handleDateChange, value: dateValue }))) : (React.createElement(dateTimePicker_1.DateTimePicker, { onChange: this.handleDateChange, value: dateValue, datePickerProps: this.props, timePickerProps: { precision: this.props.timePrecision } }));
        // assign default empty object here to prevent mutation
        var _b = this.props, _c = _b.inputProps, inputProps = _c === void 0 ? {} : _c, _d = _b.popoverProps, popoverProps = _d === void 0 ? {} : _d;
        // exclude ref (comes from HTMLInputProps typings, not InputGroup)
        var ref = inputProps.ref, htmlInputProps = tslib_1.__rest(inputProps, ["ref"]);
        var inputClasses = classNames({
            "pt-intent-danger": !(this.isMomentValidAndInRange(date) || dateUtils_1.isMomentNull(date) || dateString === ""),
        }, inputProps.className);
        return (React.createElement(core_1.Popover, tslib_1.__assign({ inline: true, isOpen: this.state.isOpen && !this.props.disabled, position: this.props.popoverPosition }, popoverProps, { autoFocus: false, enforceFocus: false, content: popoverContent, onClose: this.handleClosePopover, popoverClassName: classNames("pt-dateinput-popover", popoverProps.popoverClassName) }),
            React.createElement(core_1.InputGroup, tslib_1.__assign({ autoComplete: "off", placeholder: this.props.format, rightElement: this.props.rightElement }, htmlInputProps, { className: inputClasses, disabled: this.props.disabled, inputRef: this.setInputRef, type: "text", onBlur: this.handleInputBlur, onChange: this.handleInputChange, onClick: this.handleInputClick, onFocus: this.handleInputFocus, value: dateString }))));
    };
    DateInput.prototype.componentWillReceiveProps = function (nextProps) {
        _super.prototype.componentWillReceiveProps.call(this, nextProps);
        if (nextProps.value !== this.props.value) {
            this.setState({ value: dateUtils_1.fromDateToMoment(nextProps.value) });
        }
    };
    DateInput.prototype.validateProps = function (props) {
        if (props.popoverPosition !== DateInput.defaultProps.popoverPosition) {
            console.warn(errors_1.DATEINPUT_WARN_DEPRECATED_POPOVER_POSITION);
        }
        if (props.openOnFocus !== DateInput.defaultProps.openOnFocus) {
            console.warn(errors_1.DATEINPUT_WARN_DEPRECATED_OPEN_ON_FOCUS);
        }
    };
    DateInput.prototype.createMoment = function (valueString) {
        // Locale here used for parsing, does not set the locale on the moment itself
        return moment(valueString, this.props.format, this.props.locale);
    };
    DateInput.prototype.isMomentValidAndInRange = function (value) {
        return dateUtils_1.isMomentValidAndInRange(value, this.props.minDate, this.props.maxDate);
    };
    DateInput.prototype.isMomentInRange = function (value) {
        return dateUtils_1.isMomentInRange(value, this.props.minDate, this.props.maxDate);
    };
    DateInput.prototype.shouldCheckForDateChanges = function (prevMomentDate, nextMomentDate) {
        return nextMomentDate != null && !dateUtils_1.isMomentNull(prevMomentDate) && prevMomentDate.isValid();
    };
    DateInput.prototype.hasMonthChanged = function (prevMomentDate, nextMomentDate) {
        return (this.shouldCheckForDateChanges(prevMomentDate, nextMomentDate) &&
            nextMomentDate.month() !== prevMomentDate.month());
    };
    DateInput.prototype.hasTimeChanged = function (prevMomentDate, nextMomentDate) {
        return (this.shouldCheckForDateChanges(prevMomentDate, nextMomentDate) &&
            this.props.timePrecision != null &&
            (nextMomentDate.hours() !== prevMomentDate.hours() ||
                nextMomentDate.minutes() !== prevMomentDate.minutes() ||
                nextMomentDate.seconds() !== prevMomentDate.seconds() ||
                nextMomentDate.milliseconds() !== prevMomentDate.milliseconds()));
    };
    /** safe wrapper around invoking input props event handler (prop defaults to undefined) */
    DateInput.prototype.safeInvokeInputProp = function (name, e) {
        var _a = this.props.inputProps, inputProps = _a === void 0 ? {} : _a;
        core_1.Utils.safeInvoke(inputProps[name], e);
    };
    return DateInput;
}(core_1.AbstractComponent));
DateInput.defaultProps = {
    closeOnSelection: true,
    disabled: false,
    format: "YYYY-MM-DD",
    invalidDateMessage: "Invalid date",
    maxDate: datePickerCore_1.getDefaultMaxDate(),
    minDate: datePickerCore_1.getDefaultMinDate(),
    openOnFocus: true,
    outOfRangeMessage: "Out of range",
    popoverPosition: core_1.Position.BOTTOM,
};
DateInput.displayName = "Blueprint.DateInput";
exports.DateInput = DateInput;

//# sourceMappingURL=dateInput.js.map
