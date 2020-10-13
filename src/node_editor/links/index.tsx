import React from 'react';

import { LinkProps } from './common';

import BezierLink from './link_bezier';
import LineLink from './link_line';

export function createLinkComponent(props: LinkProps)
{
    if(props.link.linkType === "line")
    {
        return <LineLink {...props}/>;
    }
    // Return default bezier curve
    return <BezierLink {...props}/>;
};
