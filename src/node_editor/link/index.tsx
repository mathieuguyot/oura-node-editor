/* eslint-disable react/jsx-props-no-spreading */
import React from "react";

import { LinkProps } from "./common";
import BezierLink from "./link_bezier";
import LineLink from "./link_line";

export default function createLink(props: LinkProps): JSX.Element {
    const { link } = props;
    if (link?.linkType === "line") {
        return <LineLink {...props} />;
    }
    // Return default bezier curve
    return <BezierLink {...props} />;
}
