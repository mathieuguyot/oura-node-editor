import React, { Component } from "react";
import * as _ from "lodash";

import { XYPosition } from "../model";
import { LinkProps } from "./common";
import defaultStyles from "../default_styles";

const getCenter = (source: XYPosition, target: XYPosition): XYPosition => {
    const offsetX = Math.abs(target.x - source.x) / 2;
    const xCenter = target.x < source.x ? target.x + offsetX : target.x - offsetX;
    const offsetY = Math.abs(target.y - source.y) / 2;
    const yCenter = target.y < source.y ? target.y + offsetY : target.y - offsetY;
    return { x: xCenter, y: yCenter };
};

export default class BezierLink extends Component<LinkProps> {
    shouldComponentUpdate(nextProps: LinkProps): boolean {
        return !_.isEqual(this.props, nextProps);
    }

    render(): JSX.Element | null {
        const { link } = this.props;
        if (link.inputPinPosition && link.outputPinPosition) {
            const sourceX = link.inputPinPosition.x;
            const sourceY = link.inputPinPosition.y;
            const targetX = link.outputPinPosition.x;
            const targetY = link.outputPinPosition.y;
            const center = getCenter(link.inputPinPosition, link.outputPinPosition);

            const path = `M${sourceX},${sourceY} C${center.x},${sourceY} ${center.x},${targetY} ${targetX},${targetY}`;

            return <path d={path} style={defaultStyles.dark.link} />;
        }
        return null;
    }
}
