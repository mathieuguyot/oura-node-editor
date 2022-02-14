import React, { useContext } from "react";
import CSS from "csstype";

import { ThemeContext } from "../theme";

type PinProps = {
    className: string;
    contentType: string;
    leftPinPosition: number;
    pinPxRadius: number;

    onMouseDown: (event: React.MouseEvent) => void;
};

const Pin = (props: PinProps): JSX.Element => {
    const { className, contentType, leftPinPosition, pinPxRadius, onMouseDown } = props;
    const { theme } = useContext(ThemeContext);

    let customStyle: CSS.Properties | undefined = undefined;
    if(theme?.node?.customPins && theme?.node?.customPins[contentType]) {
        customStyle = theme?.node?.customPins[contentType];
    }

    const style: CSS.Properties = {
        ...{
            position: "absolute",
            width: `${pinPxRadius * 2}px`,
            height: `${pinPxRadius * 2}px`,
            left: `${leftPinPosition}px`,
            top: `calc(50% - ${pinPxRadius}px)`
        },
        ...theme?.node?.basePin,
        ...customStyle
    };

    return <div className={className} style={style} onMouseDown={onMouseDown} />;
};

export default Pin;
