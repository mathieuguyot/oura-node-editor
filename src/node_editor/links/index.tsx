import React from "react";

import { LinkProps } from "./common";
import BezierLink from "./link_bezier";
import LineLink from "./link_line";

export default function createLinkComponent(props: LinkProps): JSX.Element {
    const { link, key } = props;
    if (link.linkType === "line") {
        return <LineLink link={link} key={key} />;
    }
    // Return default bezier curve
    return <BezierLink link={link} key={key} />;
}
