import React from "react";

import { LinkProps } from "./common";
import BezierLink from "./link_bezier";
import LineLink from "./link_line";

export default function createLinkComponent(props: LinkProps): JSX.Element {
    const { linkPosition, key, linkType } = props;
    if (linkType === "line") {
        return <LineLink linkPosition={linkPosition} key={key} />;
    }
    // Return default bezier curve
    return <BezierLink linkPosition={linkPosition} key={key} />;
}
