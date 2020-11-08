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

    onSelectLink(): void {
        const { linkId, onSelectLink } = this.props;
        if (onSelectLink && linkId) {
            onSelectLink(linkId);
        }
    }

    render(): JSX.Element {
        const { linkPosition, isLinkSelected } = this.props;
        const sourceX = linkPosition.inputPinPosition.x;
        const sourceY = linkPosition.inputPinPosition.y;
        const targetX = linkPosition.outputPinPosition.x;
        const targetY = linkPosition.outputPinPosition.y;
        const center = getCenter(linkPosition.inputPinPosition, linkPosition.outputPinPosition);

        const path = `M${sourceX},${sourceY} C${center.x},${sourceY} ${center.x},${targetY} ${targetX},${targetY}`;

        const selectedStyle = isLinkSelected ? defaultStyles.dark.linkSelected : {};

        return (
            <path
                d={path}
                style={{ ...defaultStyles.dark.link, ...selectedStyle }}
                onClick={this.onSelectLink.bind(this)}
            />
        );
    }
}
