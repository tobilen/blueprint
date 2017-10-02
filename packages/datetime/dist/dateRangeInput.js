/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
var Errors = require("./common/errors");
var datePickerCore_1 = require("./datePickerCore");
var dateRangePicker_1 = require("./dateRangePicker");
var DateRangeInput = (function (_super) {
    tslib_1.__extends(DateRangeInput, _super);
    function DateRangeInput(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.refHandlers = {
            endInputRef: function (ref) {
                _this.endInputRef = ref;
                core_1.Utils.safeInvoke(_this.props.endInputProps.inputRef, ref);
            },
            startInputRef: function (ref) {
                _this.startInputRef = ref;
                core_1.Utils.safeInvoke(_this.props.startInputProps.inputRef, ref);
            },
        };
        _this.renderInputGroup = function (boundary) {
            var inputProps = _this.getInputProps(boundary);
            // don't include `ref` in the returned HTML props, because passing it to the InputGroup
            // leads to TS typing errors.
            var ref = inputProps.ref, htmlProps = tslib_1.__rest(inputProps, ["ref"]);
            var handleInputEvent = boundary === dateUtils_1.DateRangeBoundary.START ? _this.handleStartInputEvent : _this.handleEndInputEvent;
            var classes = classNames((_a = {},
                _a[core_1.Classes.INTENT_DANGER] = _this.isInputInErrorState(boundary),
                _a), inputProps.className);
            return (React.createElement(core_1.InputGroup, tslib_1.__assign({ autoComplete: "off" }, htmlProps, { className: classes, disabled: _this.props.disabled, inputRef: _this.getInputRef(boundary), onBlur: handleInputEvent, onChange: handleInputEvent, onClick: handleInputEvent, onFocus: handleInputEvent, onKeyDown: handleInputEvent, onMouseDown: handleInputEvent, placeholder: _this.getInputPlaceholderString(boundary), value: _this.getInputDisplayString(boundary) })));
            var _a;
        };
        // Callbacks - DateRangePicker
        // ===========================
        _this.handleDateRangePickerChange = function (selectedRange) {
            // ignore mouse events in the date-range picker if the popover is animating closed.
            if (!_this.state.isOpen) {
                return;
            }
            var _a = dateUtils_1.fromDateRangeToMomentDateRange(selectedRange), selectedStart = _a[0], selectedEnd = _a[1];
            var isOpen = true;
            var isStartInputFocused;
            var isEndInputFocused;
            var startHoverString;
            var endHoverString;
            if (dateUtils_1.isMomentNull(selectedStart)) {
                // focus the start field by default or if only an end date is specified
                isStartInputFocused = true;
                isEndInputFocused = false;
                // for clarity, hide the hover string until the mouse moves over a different date
                startHoverString = null;
            }
            else if (dateUtils_1.isMomentNull(selectedEnd)) {
                // focus the end field if a start date is specified
                isStartInputFocused = false;
                isEndInputFocused = true;
                endHoverString = null;
            }
            else if (_this.props.closeOnSelection) {
                isOpen = false;
                isStartInputFocused = false;
                isEndInputFocused = false;
            }
            else if (_this.state.lastFocusedField === dateUtils_1.DateRangeBoundary.START) {
                // keep the start field focused
                isStartInputFocused = true;
                isEndInputFocused = false;
            }
            else {
                // keep the end field focused
                isStartInputFocused = false;
                isEndInputFocused = true;
            }
            var baseStateChange = {
                endHoverString: endHoverString,
                endInputString: _this.getFormattedDateString(selectedEnd),
                isEndInputFocused: isEndInputFocused,
                isOpen: isOpen,
                isStartInputFocused: isStartInputFocused,
                startHoverString: startHoverString,
                startInputString: _this.getFormattedDateString(selectedStart),
                wasLastFocusChangeDueToHover: false,
            };
            if (_this.isControlled()) {
                _this.setState(baseStateChange);
            }
            else {
                _this.setState(tslib_1.__assign({}, baseStateChange, { selectedEnd: selectedEnd, selectedStart: selectedStart }));
            }
            core_1.Utils.safeInvoke(_this.props.onChange, selectedRange);
        };
        _this.handleDateRangePickerHoverChange = function (hoveredRange, _hoveredDay, hoveredBoundary) {
            // ignore mouse events in the date-range picker if the popover is animating closed.
            if (!_this.state.isOpen) {
                return;
            }
            if (hoveredRange == null) {
                // undo whatever focus changes we made while hovering over various calendar dates
                var isEndInputFocused = _this.state.boundaryToModify === dateUtils_1.DateRangeBoundary.END;
                _this.setState({
                    endHoverString: null,
                    isEndInputFocused: isEndInputFocused,
                    isStartInputFocused: !isEndInputFocused,
                    lastFocusedField: _this.state.boundaryToModify,
                    startHoverString: null,
                });
            }
            else {
                var _a = dateUtils_1.fromDateRangeToMomentDateRange(hoveredRange), hoveredStart = _a[0], hoveredEnd = _a[1];
                var isStartInputFocused = hoveredBoundary != null ? hoveredBoundary === dateUtils_1.DateRangeBoundary.START : _this.state.isStartInputFocused;
                var isEndInputFocused = hoveredBoundary != null ? hoveredBoundary === dateUtils_1.DateRangeBoundary.END : _this.state.isEndInputFocused;
                _this.setState({
                    endHoverString: _this.getFormattedDateString(hoveredEnd),
                    isEndInputFocused: isEndInputFocused,
                    isStartInputFocused: isStartInputFocused,
                    lastFocusedField: isStartInputFocused ? dateUtils_1.DateRangeBoundary.START : dateUtils_1.DateRangeBoundary.END,
                    shouldSelectAfterUpdate: _this.props.selectAllOnFocus,
                    startHoverString: _this.getFormattedDateString(hoveredStart),
                    wasLastFocusChangeDueToHover: true,
                });
            }
        };
        // Callbacks - Input
        // =================
        // instantiate these two functions once so we don't have to for each callback on each render.
        _this.handleStartInputEvent = function (e) {
            _this.handleInputEvent(e, dateUtils_1.DateRangeBoundary.START);
        };
        _this.handleEndInputEvent = function (e) {
            _this.handleInputEvent(e, dateUtils_1.DateRangeBoundary.END);
        };
        _this.handleInputEvent = function (e, boundary) {
            switch (e.type) {
                case "blur":
                    _this.handleInputBlur(e, boundary);
                    break;
                case "change":
                    _this.handleInputChange(e, boundary);
                    break;
                case "click":
                    _this.handleInputClick(e);
                    break;
                case "focus":
                    _this.handleInputFocus(e, boundary);
                    break;
                case "keydown":
                    _this.handleInputKeyDown(e);
                    break;
                case "mousedown":
                    _this.handleInputMouseDown();
                    break;
                default:
                    break;
            }
            var inputProps = _this.getInputProps(boundary);
            var callbackFn = _this.getInputGroupCallbackForEvent(e, inputProps);
            core_1.Utils.safeInvoke(callbackFn, e);
        };
        // add a keydown listener to persistently change focus when tabbing:
        // - if focused in start field, Tab moves focus to end field
        // - if focused in end field, Shift+Tab moves focus to start field
        _this.handleInputKeyDown = function (e) {
            var isTabPressed = e.keyCode === core_1.Keys.TAB;
            var isShiftPressed = e.shiftKey;
            // order of JS events is our enemy here. when tabbing between fields,
            // this handler will fire in the middle of a focus exchange when no
            // field is currently focused. we work around this by referring to the
            // most recently focused field, rather than the currently focused field.
            var wasStartFieldFocused = _this.state.lastFocusedField === dateUtils_1.DateRangeBoundary.START;
            var wasEndFieldFocused = _this.state.lastFocusedField === dateUtils_1.DateRangeBoundary.END;
            var isEndInputFocused;
            var isStartInputFocused;
            // move focus to the other field
            if (wasStartFieldFocused && isTabPressed && !isShiftPressed) {
                isStartInputFocused = false;
                isEndInputFocused = true;
            }
            else if (wasEndFieldFocused && isTabPressed && isShiftPressed) {
                isStartInputFocused = true;
                isEndInputFocused = false;
            }
            else {
                // let the default keystroke happen without side effects
                return;
            }
            // prevent the default focus-change behavior to avoid race conditions;
            // we'll handle the focus change ourselves in componentDidUpdate.
            e.preventDefault();
            _this.setState({
                isEndInputFocused: isEndInputFocused,
                isStartInputFocused: isStartInputFocused,
                wasLastFocusChangeDueToHover: false,
            });
        };
        _this.handleInputMouseDown = function () {
            // clicking in the field constitutes an explicit focus change. we update
            // the flag on "mousedown" instead of on "click", because it needs to be
            // set before onFocus is called ("click" triggers after "focus").
            _this.setState({ wasLastFocusChangeDueToHover: false });
        };
        _this.handleInputClick = function (e) {
            // unless we stop propagation on this event, a click within an input
            // will close the popover almost as soon as it opens.
            e.stopPropagation();
        };
        _this.handleInputFocus = function (_e, boundary) {
            var _a = _this.getStateKeysAndValuesForBoundary(boundary), keys = _a.keys, values = _a.values;
            var inputString = _this.getFormattedDateString(values.selectedValue);
            // change the boundary only if the user explicitly focused in the field.
            // focus changes from hovering don't count; they're just temporary.
            var boundaryToModify = _this.state.wasLastFocusChangeDueToHover ? _this.state.boundaryToModify : boundary;
            _this.setState((_b = {},
                _b[keys.inputString] = inputString,
                _b[keys.isInputFocused] = true,
                _b.boundaryToModify = boundaryToModify,
                _b.isOpen = true,
                _b.lastFocusedField = boundary,
                _b.shouldSelectAfterUpdate = _this.props.selectAllOnFocus,
                _b.wasLastFocusChangeDueToHover = false,
                _b));
            var _b;
        };
        _this.handleInputBlur = function (_e, boundary) {
            var _a = _this.getStateKeysAndValuesForBoundary(boundary), keys = _a.keys, values = _a.values;
            var maybeNextValue = _this.dateStringToMoment(values.inputString);
            var isValueControlled = _this.isControlled();
            var nextState = (_b = {},
                _b[keys.isInputFocused] = false,
                _b.shouldSelectAfterUpdate = false,
                _b);
            if (_this.isInputEmpty(values.inputString)) {
                if (isValueControlled) {
                    nextState = tslib_1.__assign({}, nextState, (_c = {}, _c[keys.inputString] = _this.getFormattedDateString(values.controlledValue), _c));
                }
                else {
                    nextState = tslib_1.__assign({}, nextState, (_d = {}, _d[keys.inputString] = null, _d[keys.selectedValue] = moment(null), _d));
                }
            }
            else if (!_this.isNextDateRangeValid(maybeNextValue, boundary)) {
                if (!isValueControlled) {
                    nextState = tslib_1.__assign({}, nextState, (_f = {}, _f[keys.inputString] = null, _f[keys.selectedValue] = maybeNextValue, _f));
                }
                core_1.Utils.safeInvoke(_this.props.onError, _this.getDateRangeForCallback(maybeNextValue, boundary));
            }
            _this.setState(nextState);
            var _b, _c, _d, _f;
        };
        _this.handleInputChange = function (e, boundary) {
            var inputString = e.target.value;
            var keys = _this.getStateKeysAndValuesForBoundary(boundary).keys;
            var maybeNextValue = _this.dateStringToMoment(inputString);
            var isValueControlled = _this.isControlled();
            var nextState = { shouldSelectAfterUpdate: false };
            if (inputString.length === 0) {
                // this case will be relevant when we start showing the hovered range in the input
                // fields. goal is to show an empty field for clarity until the mouse moves over a
                // different date.
                var baseState = tslib_1.__assign({}, nextState, (_a = {}, _a[keys.inputString] = "", _a));
                if (isValueControlled) {
                    nextState = baseState;
                }
                else {
                    nextState = tslib_1.__assign({}, baseState, (_b = {}, _b[keys.selectedValue] = moment(null), _b));
                }
                core_1.Utils.safeInvoke(_this.props.onChange, _this.getDateRangeForCallback(moment(null), boundary));
            }
            else if (_this.isMomentValidAndInRange(maybeNextValue)) {
                // note that error cases that depend on both fields (e.g. overlapping dates) should fall
                // through into this block so that the UI can update immediately, possibly with an error
                // message on the other field.
                // also, clear the hover string to ensure the most recent keystroke appears.
                var baseState = tslib_1.__assign({}, nextState, (_c = {}, _c[keys.hoverString] = null, _c[keys.inputString] = inputString, _c));
                if (isValueControlled) {
                    nextState = baseState;
                }
                else {
                    nextState = tslib_1.__assign({}, baseState, (_d = {}, _d[keys.selectedValue] = maybeNextValue, _d));
                }
                if (_this.isNextDateRangeValid(maybeNextValue, boundary)) {
                    core_1.Utils.safeInvoke(_this.props.onChange, _this.getDateRangeForCallback(maybeNextValue, boundary));
                }
            }
            else {
                // again, clear the hover string to ensure the most recent keystroke appears
                nextState = tslib_1.__assign({}, nextState, (_f = {}, _f[keys.inputString] = inputString, _f[keys.hoverString] = null, _f));
            }
            _this.setState(nextState);
            var _a, _b, _c, _d, _f;
        };
        // Callbacks - Popover
        // ===================
        _this.handlePopoverClose = function () {
            _this.setState({ isOpen: false });
            core_1.Utils.safeInvoke(_this.props.popoverProps.onClose);
        };
        _this.dateStringToMoment = function (dateString) {
            if (_this.isInputEmpty(dateString)) {
                return moment(null);
            }
            return moment(dateString, _this.props.format, _this.props.locale);
        };
        _this.getInitialRange = function (props) {
            if (props === void 0) { props = _this.props; }
            var defaultValue = props.defaultValue, value = props.value;
            if (value != null) {
                return dateUtils_1.fromDateRangeToMomentDateRange(value);
            }
            else if (defaultValue != null) {
                return dateUtils_1.fromDateRangeToMomentDateRange(defaultValue);
            }
            else {
                return [moment(null), moment(null)];
            }
        };
        _this.getSelectedRange = function () {
            var selectedStart;
            var selectedEnd;
            if (_this.isControlled()) {
                _a = _this.props.value.map(dateUtils_1.fromDateToMoment), selectedStart = _a[0], selectedEnd = _a[1];
            }
            else {
                selectedStart = _this.state.selectedStart;
                selectedEnd = _this.state.selectedEnd;
            }
            // this helper function checks if the provided boundary date *would* overlap the selected
            // other boundary date. providing the already-selected start date simply tells us if we're
            // currently in an overlapping state.
            var doBoundaryDatesOverlap = _this.doBoundaryDatesOverlap(selectedStart, dateUtils_1.DateRangeBoundary.START);
            var momentDateRange = [selectedStart, doBoundaryDatesOverlap ? moment(null) : selectedEnd];
            return momentDateRange.map(function (selectedBound) {
                return _this.isMomentValidAndInRange(selectedBound) ? dateUtils_1.fromMomentToDate(selectedBound) : undefined;
            });
            var _a;
        };
        _this.getInputGroupCallbackForEvent = function (e, inputProps) {
            // use explicit switch cases to ensure callback function names remain grep-able in the codebase.
            switch (e.type) {
                case "blur":
                    return inputProps.onBlur;
                case "change":
                    return inputProps.onChange;
                case "click":
                    return inputProps.onClick;
                case "focus":
                    return inputProps.onFocus;
                case "keydown":
                    return inputProps.onKeyDown;
                case "mousedown":
                    return inputProps.onMouseDown;
                default:
                    return undefined;
            }
        };
        _this.getInputDisplayString = function (boundary) {
            var values = _this.getStateKeysAndValuesForBoundary(boundary).values;
            var isInputFocused = values.isInputFocused, inputString = values.inputString, selectedValue = values.selectedValue, hoverString = values.hoverString;
            if (hoverString != null) {
                return hoverString;
            }
            else if (isInputFocused) {
                return inputString == null ? "" : inputString;
            }
            else if (dateUtils_1.isMomentNull(selectedValue)) {
                return "";
            }
            else if (!_this.isMomentInRange(selectedValue)) {
                return _this.props.outOfRangeMessage;
            }
            else if (_this.doesEndBoundaryOverlapStartBoundary(selectedValue, boundary)) {
                return _this.props.overlappingDatesMessage;
            }
            else {
                return _this.getFormattedDateString(selectedValue);
            }
        };
        _this.getInputPlaceholderString = function (boundary) {
            var isStartBoundary = boundary === dateUtils_1.DateRangeBoundary.START;
            var isEndBoundary = boundary === dateUtils_1.DateRangeBoundary.END;
            var inputProps = _this.getInputProps(boundary);
            var isInputFocused = _this.getStateKeysAndValuesForBoundary(boundary).values.isInputFocused;
            // use the custom placeholder text for the input, if providied
            if (inputProps.placeholder != null) {
                return inputProps.placeholder;
            }
            else if (isStartBoundary) {
                return isInputFocused ? _this.state.formattedMinDateString : "Start date";
            }
            else if (isEndBoundary) {
                return isInputFocused ? _this.state.formattedMaxDateString : "End date";
            }
            else {
                return "";
            }
        };
        _this.getInputProps = function (boundary) {
            return boundary === dateUtils_1.DateRangeBoundary.START ? _this.props.startInputProps : _this.props.endInputProps;
        };
        _this.getInputRef = function (boundary) {
            return boundary === dateUtils_1.DateRangeBoundary.START ? _this.refHandlers.startInputRef : _this.refHandlers.endInputRef;
        };
        _this.getFormattedDateString = function (momentDate, formatOverride) {
            if (dateUtils_1.isMomentNull(momentDate)) {
                return "";
            }
            else if (!momentDate.isValid()) {
                return _this.props.invalidDateMessage;
            }
            else {
                var format = formatOverride != null ? formatOverride : _this.props.format;
                return dateUtils_1.toLocalizedDateString(momentDate, format, _this.props.locale);
            }
        };
        _this.getStateKeysAndValuesForBoundary = function (boundary) {
            var controlledRange = dateUtils_1.fromDateRangeToMomentDateRange(_this.props.value);
            if (boundary === dateUtils_1.DateRangeBoundary.START) {
                return {
                    keys: {
                        hoverString: "startHoverString",
                        inputString: "startInputString",
                        isInputFocused: "isStartInputFocused",
                        selectedValue: "selectedStart",
                    },
                    values: {
                        controlledValue: controlledRange != null ? controlledRange[0] : undefined,
                        hoverString: _this.state.startHoverString,
                        inputString: _this.state.startInputString,
                        isInputFocused: _this.state.isStartInputFocused,
                        selectedValue: _this.state.selectedStart,
                    },
                };
            }
            else {
                return {
                    keys: {
                        hoverString: "endHoverString",
                        inputString: "endInputString",
                        isInputFocused: "isEndInputFocused",
                        selectedValue: "selectedEnd",
                    },
                    values: {
                        controlledValue: controlledRange != null ? controlledRange[1] : undefined,
                        hoverString: _this.state.endHoverString,
                        inputString: _this.state.endInputString,
                        isInputFocused: _this.state.isEndInputFocused,
                        selectedValue: _this.state.selectedEnd,
                    },
                };
            }
        };
        _this.getDateRangeForCallback = function (currValue, currBoundary) {
            var otherBoundary = _this.getOtherBoundary(currBoundary);
            var otherValue = _this.getStateKeysAndValuesForBoundary(otherBoundary).values.selectedValue;
            var currDate = _this.getDateForCallback(currValue);
            var otherDate = _this.getDateForCallback(otherValue);
            return currBoundary === dateUtils_1.DateRangeBoundary.START ? [currDate, otherDate] : [otherDate, currDate];
        };
        _this.getDateForCallback = function (momentDate) {
            if (dateUtils_1.isMomentNull(momentDate)) {
                return null;
            }
            else if (!momentDate.isValid()) {
                return new Date(undefined);
            }
            else {
                return dateUtils_1.fromMomentToDate(momentDate);
            }
        };
        _this.getOtherBoundary = function (boundary) {
            return boundary === dateUtils_1.DateRangeBoundary.START ? dateUtils_1.DateRangeBoundary.END : dateUtils_1.DateRangeBoundary.START;
        };
        _this.doBoundaryDatesOverlap = function (boundaryDate, boundary) {
            var allowSingleDayRange = _this.props.allowSingleDayRange;
            var otherBoundary = _this.getOtherBoundary(boundary);
            var otherBoundaryDate = _this.getStateKeysAndValuesForBoundary(otherBoundary).values.selectedValue;
            if (boundary === dateUtils_1.DateRangeBoundary.START) {
                return allowSingleDayRange
                    ? boundaryDate.isAfter(otherBoundaryDate, "day")
                    : boundaryDate.isSameOrAfter(otherBoundaryDate, "day");
            }
            else {
                return allowSingleDayRange
                    ? boundaryDate.isBefore(otherBoundaryDate, "day")
                    : boundaryDate.isSameOrBefore(otherBoundaryDate, "day");
            }
        };
        /**
         * Returns true if the provided boundary is an END boundary overlapping the
         * selected start date. (If the boundaries overlap, we consider the END
         * boundary to be erroneous.)
         */
        _this.doesEndBoundaryOverlapStartBoundary = function (boundaryDate, boundary) {
            return boundary === dateUtils_1.DateRangeBoundary.START ? false : _this.doBoundaryDatesOverlap(boundaryDate, boundary);
        };
        _this.isControlled = function () {
            return _this.props.value !== undefined;
        };
        _this.isInputEmpty = function (inputString) {
            return inputString == null || inputString.length === 0;
        };
        _this.isInputInErrorState = function (boundary) {
            var values = _this.getStateKeysAndValuesForBoundary(boundary).values;
            var isInputFocused = values.isInputFocused, hoverString = values.hoverString, inputString = values.inputString, selectedValue = values.selectedValue;
            var boundaryValue = isInputFocused ? _this.dateStringToMoment(inputString) : selectedValue;
            if (hoverString != null) {
                // don't show an error state while we're hovering over a valid date.
                return false;
            }
            else if (dateUtils_1.isMomentNull(boundaryValue)) {
                return false;
            }
            else if (!boundaryValue.isValid()) {
                return true;
            }
            else if (!_this.isMomentInRange(boundaryValue)) {
                return true;
            }
            else if (_this.doesEndBoundaryOverlapStartBoundary(boundaryValue, boundary)) {
                return true;
            }
            else {
                return false;
            }
        };
        _this.isMomentValidAndInRange = function (momentDate) {
            return dateUtils_1.isMomentValidAndInRange(momentDate, _this.props.minDate, _this.props.maxDate);
        };
        _this.isMomentInRange = function (momentDate) {
            return dateUtils_1.isMomentInRange(momentDate, _this.props.minDate, _this.props.maxDate);
        };
        _this.reset(props);
        return _this;
    }
    /**
     * Public method intended for unit testing only. Do not use in feature work!
     */
    DateRangeInput.prototype.reset = function (props) {
        if (props === void 0) { props = this.props; }
        var _a = this.getInitialRange(), selectedStart = _a[0], selectedEnd = _a[1];
        this.state = {
            formattedMaxDateString: this.getFormattedMinMaxDateString(props, "maxDate"),
            formattedMinDateString: this.getFormattedMinMaxDateString(props, "minDate"),
            isOpen: false,
            selectedEnd: selectedEnd,
            selectedStart: selectedStart,
        };
    };
    DateRangeInput.prototype.componentDidUpdate = function () {
        var _a = this.state, isStartInputFocused = _a.isStartInputFocused, isEndInputFocused = _a.isEndInputFocused, shouldSelectAfterUpdate = _a.shouldSelectAfterUpdate;
        var shouldFocusStartInput = this.shouldFocusInputRef(isStartInputFocused, this.startInputRef);
        var shouldFocusEndInput = this.shouldFocusInputRef(isEndInputFocused, this.endInputRef);
        if (shouldFocusStartInput) {
            this.startInputRef.focus();
        }
        else if (shouldFocusEndInput) {
            this.endInputRef.focus();
        }
        if (isStartInputFocused && shouldSelectAfterUpdate) {
            this.startInputRef.select();
        }
        else if (isEndInputFocused && shouldSelectAfterUpdate) {
            this.endInputRef.select();
        }
    };
    DateRangeInput.prototype.render = function () {
        var popoverContent = (React.createElement(dateRangePicker_1.DateRangePicker, tslib_1.__assign({}, this.props, { boundaryToModify: this.state.boundaryToModify, onChange: this.handleDateRangePickerChange, onHoverChange: this.handleDateRangePickerHoverChange, value: this.getSelectedRange() })));
        // allow custom props for the popover and each input group, but pass them in an order that
        // guarantees only some props are overridable.
        return (React.createElement(core_1.Popover, tslib_1.__assign({ inline: true, isOpen: this.state.isOpen, position: core_1.Position.BOTTOM_LEFT }, this.props.popoverProps, { autoFocus: false, content: popoverContent, enforceFocus: false, onClose: this.handlePopoverClose }),
            React.createElement("div", { className: core_1.Classes.CONTROL_GROUP },
                this.renderInputGroup(dateUtils_1.DateRangeBoundary.START),
                this.renderInputGroup(dateUtils_1.DateRangeBoundary.END))));
    };
    DateRangeInput.prototype.componentWillReceiveProps = function (nextProps) {
        _super.prototype.componentWillReceiveProps.call(this, nextProps);
        var nextState = {};
        if (nextProps.value !== this.props.value) {
            var _a = this.getInitialRange(nextProps), selectedStart = _a[0], selectedEnd = _a[1];
            nextState = tslib_1.__assign({}, nextState, { selectedStart: selectedStart, selectedEnd: selectedEnd });
        }
        // we use Moment to format date strings, but min/max dates come in as vanilla JS Dates.
        // cache the formatted date strings to avoid creating new Moment instances on each render.
        var didFormatChange = nextProps.format !== this.props.format;
        if (didFormatChange || nextProps.minDate !== this.props.minDate) {
            var formattedMinDateString = this.getFormattedMinMaxDateString(nextProps, "minDate");
            nextState = tslib_1.__assign({}, nextState, { formattedMinDateString: formattedMinDateString });
        }
        if (didFormatChange || nextProps.maxDate !== this.props.maxDate) {
            var formattedMaxDateString = this.getFormattedMinMaxDateString(nextProps, "maxDate");
            nextState = tslib_1.__assign({}, nextState, { formattedMaxDateString: formattedMaxDateString });
        }
        this.setState(nextState);
    };
    DateRangeInput.prototype.validateProps = function (props) {
        if (props.value === null) {
            throw new Error(Errors.DATERANGEINPUT_NULL_VALUE);
        }
    };
    // Helpers
    // =======
    DateRangeInput.prototype.shouldFocusInputRef = function (isFocused, inputRef) {
        return isFocused && inputRef !== undefined && document.activeElement !== inputRef;
    };
    DateRangeInput.prototype.isNextDateRangeValid = function (nextMomentDate, boundary) {
        return this.isMomentValidAndInRange(nextMomentDate) && !this.doBoundaryDatesOverlap(nextMomentDate, boundary);
    };
    // this is a slightly kludgy function, but it saves us a good amount of repeated code between
    // the constructor and componentWillReceiveProps.
    DateRangeInput.prototype.getFormattedMinMaxDateString = function (props, propName) {
        var date = props[propName];
        var defaultDate = DateRangeInput.defaultProps[propName];
        // default values are applied only if a prop is strictly `undefined`
        // See: https://facebook.github.io/react/docs/react-component.html#defaultprops
        return this.getFormattedDateString(moment(date === undefined ? defaultDate : date), props.format);
    };
    return DateRangeInput;
}(core_1.AbstractComponent));
DateRangeInput.defaultProps = {
    allowSingleDayRange: false,
    closeOnSelection: true,
    contiguousCalendarMonths: true,
    disabled: false,
    endInputProps: {},
    format: "YYYY-MM-DD",
    invalidDateMessage: "Invalid date",
    maxDate: datePickerCore_1.getDefaultMaxDate(),
    minDate: datePickerCore_1.getDefaultMinDate(),
    outOfRangeMessage: "Out of range",
    overlappingDatesMessage: "Overlapping dates",
    popoverProps: {},
    selectAllOnFocus: false,
    shortcuts: true,
    startInputProps: {},
};
DateRangeInput.displayName = "Blueprint.DateRangeInput";
exports.DateRangeInput = DateRangeInput;

//# sourceMappingURL=dateRangeInput.js.map
