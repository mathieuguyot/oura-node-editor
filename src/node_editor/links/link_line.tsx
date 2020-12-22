import React, { Component } from "react";
import * as _ from "lodash";

import { LinkProps } from "./common";
import defaultStyles from "../default_styles";

export default class LineLink extends Component<LinkProps> {
    shouldComponentUpdate(nextProps: LinkProps): boolean {
        return !_.isEqual(this.props, nextProps);
    }

    onSelectLink(event: React.MouseEvent): void {
        const { linkId, onSelectLink } = this.props;
        if (onSelectLink && linkId) {
            onSelectLink(linkId, event.shiftKey);
        }
    }

    render(): JSX.Element {
        const { linkId, linkPosition, isLinkSelected } = this.props;

        const selectedStyle = isLinkSelected ? defaultStyles.dark.linkSelected : {};

        return (
            <line
                id={`link_${linkId}`}
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
