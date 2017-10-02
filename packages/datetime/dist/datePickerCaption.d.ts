/// <reference types="react" />
import * as React from "react";
import * as ReactDayPicker from "react-day-picker";
export interface IDatePickerCaptionProps extends ReactDayPicker.CaptionElementProps {
    maxDate: Date;
    minDate: Date;
    onMonthChange?: (month: number) => void;
    onYearChange?: (year: number) => void;
}
export declare class DatePickerCaption extends React.Component<IDatePickerCaptionProps, {}> {
    private displayedMonthText;
    private displayedYearText;
    private containerElement;
    private monthArrowElement;
    private yearArrowElement;
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private containerRefHandler;
    private monthArrowRefHandler;
    private yearArrowRefHandler;
    private positionArrows();
    private handleMonthSelectChange;
    private handleYearSelectChange;
}
