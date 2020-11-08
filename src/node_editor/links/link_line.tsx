import React, { Component } from "react";
import * as _ from "lodash";

import { LinkProps } from "./common";
import defaultStyles from "../default_styles";

export default class LineLink extends Component<LinkProps> {
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

        const selectedStyle = isLinkSelected ? defaultStyles.dark.linkSelected : {};

        return (
            <line
                x1={linkPosition.inputPinPosition.x}
                y1={linkPosition.inputPinPosition.y}
                x2={linkPosition.outputPinPosition.x}
                y2={linkPosition.outputPinPosition.y}
                style={{ ...defaultStyles.dark.link, ...selectedStyle }}
                onClick={this.onSelectLink.bind(this)}
            />
        );
    }
}
