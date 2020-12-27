import React, { useContext } from "react";
import CSS from "csstype";

import { PanZoomModel } from "./model";
import { ThemeContext } from "./theme";

export interface BackGroundProps {
    panZoomInfo: PanZoomModel;
}

export default function BackGround(props: React.PropsWithChildren<BackGroundProps>): JSX.Element {
    const { buildBackgroundStyle } = useContext(ThemeContext);
    const { panZoomInfo, children } = props;

    let style: CSS.Properties = {
        position: "relative",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        overflow: "hidden"
    };

    if (buildBackgroundStyle) {
        style = { ...style, ...buildBackgroundStyle(panZoomInfo) };
    }

    return <div style={style}>{children}</div>;
}
