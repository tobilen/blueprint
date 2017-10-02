/// <reference types="react" />
/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */
import * as React from "react";
export interface IKeyComboProps {
    allowInInput?: boolean;
    combo: string;
    disabled?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
}
export declare class KeyCombo extends React.Component<IKeyComboProps, {}> {
    render(): JSX.Element;
}
