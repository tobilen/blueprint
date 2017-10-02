/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ns = "[Blueprint]";
exports.DATEPICKER_DEFAULT_VALUE_INVALID = ns + " <DatePicker> defaultValue must be within minDate and maxDate bounds.";
exports.DATEPICKER_INITIAL_MONTH_INVALID = ns + " <DatePicker> initialMonth must be within minDate and maxDate bounds.";
exports.DATEPICKER_MAX_DATE_INVALID = ns + " <DatePicker> maxDate must be later than minDate.";
exports.DATEPICKER_VALUE_INVALID = ns + " <DatePicker> value prop must be within minDate and maxDate bounds.";
exports.DATERANGEPICKER_DEFAULT_VALUE_INVALID = exports.DATEPICKER_DEFAULT_VALUE_INVALID.replace("DatePicker", "DateRangePicker");
exports.DATERANGEPICKER_INITIAL_MONTH_INVALID = exports.DATEPICKER_INITIAL_MONTH_INVALID.replace("DatePicker", "DateRangePicker");
exports.DATERANGEPICKER_MAX_DATE_INVALID = exports.DATEPICKER_MAX_DATE_INVALID.replace("DatePicker", "DateRangePicker");
exports.DATERANGEPICKER_VALUE_INVALID = exports.DATEPICKER_VALUE_INVALID.replace("DatePicker", "DateRangePicker");
exports.DATERANGEPICKER_PREFERRED_BOUNDARY_TO_MODIFY_INVALID = "<DateRangePicker> preferredBoundaryToModify must be a valid DateRangeBoundary if defined.";
exports.DATEINPUT_WARN_DEPRECATED_POPOVER_POSITION = ns + " DEPRECATION: <DateInput> popoverPosition is deprecated. Use popoverProps.position.";
exports.DATEINPUT_WARN_DEPRECATED_OPEN_ON_FOCUS = ns + " DEPRECATION: <DateInput> openOnFocus is deprecated. This feature will be removed in the next major version.";
exports.DATERANGEINPUT_NULL_VALUE = ns + " <DateRangeInput> value cannot be null. Pass undefined to clear the value and operate in " +
    "uncontrolled mode, or pass [null, null] to clear the value and continue operating in controlled mode.";

//# sourceMappingURL=errors.js.map
