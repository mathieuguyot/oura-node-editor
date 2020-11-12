import React from "react";
import CSS from "csstype";

import defaultStyles from "./default_styles";

type PinProps = {
    className: string;
    leftPinPosition: number;
    pinPxRadius: number;

    onMouseDown: (event: React.MouseEvent) => void;
};

const Pin = (props: PinProps): JSX.Element => {
    const { className, leftPinPosition, pinPxRadius, onMouseDown } = props;

    const connectorStyle: CSS.Properties = {
        position: "absolute",
        width: `${pinPxRadius * 2}px`,
        height: `${pinPxRadius * 2}px`,
        left: `${leftPinPosition}px`,
        top: `calc(50% - ${pinPxRadius}px)`
    };

    return (
        <div
            className={className}
            style={{ ...connectorStyle, ...defaultStyles.dark.pin }}
            onMouseDown={onMouseDown}
        />
    );
};

export default Pin;
