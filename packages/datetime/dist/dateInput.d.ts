/// <reference types="react" />
import * as moment from "moment";
import { AbstractComponent, HTMLInputProps, IInputGroupProps, IPopoverProps, IProps, Position } from "@blueprintjs/core";
import { IDatePickerBaseProps } from "./datePickerCore";
import { TimePickerPrecision } from "./timePicker";
export interface IDateInputProps extends IDatePickerBaseProps, IProps {
    /**
     * Allows the user to clear the selection by clicking the currently selected day.
     * Passed to `DatePicker` component.
     * @default true
     */
    canClearSelection?: boolean;
    /**
     * Whether the calendar popover should close when a date is selected.
     * @default true
     */
    closeOnSelection?: boolean;
    /**
     * Whether the date input is non-interactive.
     * @default false
     */
    disabled?: boolean;
    /**
     * The default date to be used in the component when uncontrolled.
     */
    defaultValue?: Date;
    /**
     * The format of the date. See http://momentjs.com/docs/#/displaying/format/.
     * @default "YYYY-MM-DD"
     */
    format?: string;
    /**
     * Props to pass to the [input group](#core/components/forms/input-group.javascript-api).
     * `disabled` and `value` will be ignored in favor of the top-level props on this component.
     * `type` is fixed to "text" and `ref` is not supported; use `inputRef` instead.
     */
    inputProps?: HTMLInputProps & IInputGroupProps;
    /**
     * The error message to display when the date selected is invalid.
     * @default "Invalid date"
     */
    invalidDateMessage?: string;
    /**
     * Called when the user selects a new valid date through the `DatePicker` or by typing
     * in the input.
     */
    onChange?: (selectedDate: Date) => void;
    /**
     * Called when the user finishes typing in a new date and the date causes an error state.
     * If the date is invalid, `new Date(undefined)` will be returned. If the date is out of range,
     * the out of range date will be returned (`onChange` is not called in this case).
     */
    onError?: (errorDate: Date) => void;
    /**
     * If `true`, the popover will open when the user clicks on the input.
     * @deprecated since 1.13.0.
     * @default true
     */
    openOnFocus?: boolean;
    /**
     * The error message to display when the date selected is out of range.
     * @default "Out of range"
     */
    outOfRangeMessage?: string;
    /**
     * The position the date popover should appear in relative to the input box.
     * @default Position.BOTTOM
     * @deprecated since v1.15.0, use `popoverProps.position`
     */
    popoverPosition?: Position;
    /**
     * Props to pass to the `Popover`.
     * Note that `content`, `autoFocus`, and `enforceFocus` cannot be changed.
     */
    popoverProps?: Partial<IPopoverProps> & object;
    /**
     * Element to render on right side of input.
     */
    rightElement?: JSX.Element;
    /**
     * The currently selected day. If this prop is provided, the component acts in a controlled manner.
     * To display no date in the input field, pass `null` to the value prop. To display an invalid date error
     * in the input field, pass `new Date(undefined)` to the value prop.
     */
    value?: Date;
    /**
     * Adds a time chooser to the bottom of the popover.
     * Passed to the `DateTimePicker` component.
     */
    timePrecision?: TimePickerPrecision;
}
export interface IDateInputState {
    value?: moment.Moment;
    valueString?: string;
    isInputFocused?: boolean;
    isOpen?: boolean;
}
export declare class DateInput extends AbstractComponent<IDateInputProps, IDateInputState> {
    static defaultProps: IDateInputProps;
    static displayName: string;
    private inputRef;
    constructor(props?: IDateInputProps, context?: any);
    render(): JSX.Element;
    componentWillReceiveProps(nextProps: IDateInputProps): void;
    validateProps(props: IDateInputProps): void;
    private createMoment(valueString);
    private getDateString;
    private isMomentValidAndInRange(value);
    private isMomentInRange(value);
    private handleClosePopover;
    private handleDateChange;
    private shouldCheckForDateChanges(prevMomentDate, nextMomentDate);
    private hasMonthChanged(prevMomentDate, nextMomentDate);
    private hasTimeChanged(prevMomentDate, nextMomentDate);
    private handleInputFocus;
    private handleInputClick;
    private handleInputChange;
    private handleInputBlur;
    private setInputRef;
    /** safe wrapper around invoking input props event handler (prop defaults to undefined) */
    private safeInvokeInputProp(name, e);
}
