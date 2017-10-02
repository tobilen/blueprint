/// <reference types="react" />
import * as moment from "moment";
import { AbstractComponent, HTMLInputProps, IInputGroupProps, IPopoverProps, IProps } from "@blueprintjs/core";
import { DateRange, DateRangeBoundary } from "./common/dateUtils";
import { IDatePickerBaseProps } from "./datePickerCore";
import { IDateRangeShortcut } from "./dateRangePicker";
export interface IDateRangeInputProps extends IDatePickerBaseProps, IProps {
    /**
     * Whether the start and end dates of the range can be the same day.
     * If `true`, clicking a selected date will create a one-day range.
     * If `false`, clicking a selected date will clear the selection.
     * @default false
     */
    allowSingleDayRange?: boolean;
    /**
     * Whether the calendar popover should close when a date range is fully selected.
     * @default true
     */
    closeOnSelection?: boolean;
    /**
     * Whether displayed months in the calendar are contiguous.
     * If false, each side of the calendar can move independently to non-contiguous months.
     * @default true
     */
    contiguousCalendarMonths?: boolean;
    /**
     * The default date range to be used in the component when uncontrolled.
     * This will be ignored if `value` is set.
     */
    defaultValue?: DateRange;
    /**
     * Whether the text inputs are non-interactive.
     * @default false
     */
    disabled?: boolean;
    /**
     * Props to pass to the end-date [input group](#core/components/forms/input-group.javascript-api).
     * `disabled` and `value` will be ignored in favor of the top-level props on this component.
     * `ref` is not supported; use `inputRef` instead.
     */
    endInputProps?: HTMLInputProps & IInputGroupProps;
    /**
     * The format of each date in the date range. See options
     * here: http://momentjs.com/docs/#/displaying/format/
     * @default "YYYY-MM-DD"
     */
    format?: string;
    /**
     * The error message to display when the selected date is invalid.
     * @default "Invalid date"
     */
    invalidDateMessage?: string;
    /**
     * Called when the user selects a day.
     * If no days are selected, it will pass `[null, null]`.
     * If a start date is selected but not an end date, it will pass `[selectedDate, null]`.
     * If both a start and end date are selected, it will pass `[startDate, endDate]`.
     */
    onChange?: (selectedRange: DateRange) => void;
    /**
     * Called when the user finishes typing in a new date and the date causes an error state.
     * If the date is invalid, `new Date(undefined)` will be returned for the corresponding
     * boundary of the date range.
     * If the date is out of range, the out-of-range date will be returned for the corresponding
     * boundary of the date range (`onChange` is not called in this case).
     */
    onError?: (errorRange: DateRange) => void;
    /**
     * The error message to display when the date selected is out of range.
     * @default "Out of range"
     */
    outOfRangeMessage?: string;
    /**
     * The error message to display when the selected dates overlap.
     * This can only happen when typing dates in the input field.
     * @default "Overlapping dates"
     */
    overlappingDatesMessage?: string;
    /**
     * The props to pass to the popover.
     * `autoFocus`, `content`, and `enforceFocus` will be ignored to avoid compromising usability.
     */
    popoverProps?: Partial<IPopoverProps>;
    /**
     * Whether the entire text field should be selected on focus.
     * @default false
     */
    selectAllOnFocus?: boolean;
    /**
     * Whether shortcuts to quickly select a range of dates are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     * @default true
     */
    shortcuts?: boolean | IDateRangeShortcut[];
    /**
     * Props to pass to the start-date [input group](#core/components/forms/input-group.javascript-api).
     * `disabled` and `value` will be ignored in favor of the top-level props on this component.
     * `ref` is not supported; use `inputRef` instead.
     */
    startInputProps?: HTMLInputProps & IInputGroupProps;
    /**
     * The currently selected date range.
     * If the prop is strictly `undefined`, the component acts in an uncontrolled manner.
     * If this prop is anything else, the component acts in a controlled manner.
     * To display an empty value in the input fields in a controlled manner, pass `[null, null]`.
     * To display an invalid date error in either input field, pass `new Date(undefined)`
     * for the appropriate date in the value prop.
     */
    value?: DateRange;
}
export interface IDateRangeInputState {
    isOpen?: boolean;
    boundaryToModify?: DateRangeBoundary;
    lastFocusedField?: DateRangeBoundary;
    formattedMinDateString?: string;
    formattedMaxDateString?: string;
    isStartInputFocused?: boolean;
    isEndInputFocused?: boolean;
    startInputString?: string;
    endInputString?: string;
    startHoverString?: string;
    endHoverString?: string;
    selectedEnd?: moment.Moment;
    selectedStart?: moment.Moment;
    shouldSelectAfterUpdate?: boolean;
    wasLastFocusChangeDueToHover?: boolean;
}
export declare class DateRangeInput extends AbstractComponent<IDateRangeInputProps, IDateRangeInputState> {
    static defaultProps: IDateRangeInputProps;
    static displayName: string;
    private startInputRef;
    private endInputRef;
    private refHandlers;
    constructor(props: IDateRangeInputProps, context?: any);
    /**
     * Public method intended for unit testing only. Do not use in feature work!
     */
    reset(props?: IDateRangeInputProps): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    componentWillReceiveProps(nextProps: IDateRangeInputProps): void;
    protected validateProps(props: IDateRangeInputProps): void;
    private renderInputGroup;
    private handleDateRangePickerChange;
    private handleDateRangePickerHoverChange;
    private handleStartInputEvent;
    private handleEndInputEvent;
    private handleInputEvent;
    private handleInputKeyDown;
    private handleInputMouseDown;
    private handleInputClick;
    private handleInputFocus;
    private handleInputBlur;
    private handleInputChange;
    private handlePopoverClose;
    private shouldFocusInputRef(isFocused, inputRef);
    private dateStringToMoment;
    private getInitialRange;
    private getSelectedRange;
    private getInputGroupCallbackForEvent;
    private getInputDisplayString;
    private getInputPlaceholderString;
    private getInputProps;
    private getInputRef;
    private getFormattedDateString;
    private getStateKeysAndValuesForBoundary;
    private getDateRangeForCallback;
    private getDateForCallback;
    private getOtherBoundary;
    private doBoundaryDatesOverlap;
    /**
     * Returns true if the provided boundary is an END boundary overlapping the
     * selected start date. (If the boundaries overlap, we consider the END
     * boundary to be erroneous.)
     */
    private doesEndBoundaryOverlapStartBoundary;
    private isControlled;
    private isInputEmpty;
    private isInputInErrorState;
    private isMomentValidAndInRange;
    private isMomentInRange;
    private isNextDateRangeValid(nextMomentDate, boundary);
    private getFormattedMinMaxDateString(props, propName);
}
