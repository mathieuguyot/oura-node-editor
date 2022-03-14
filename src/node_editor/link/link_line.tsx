import React, { Component } from "react";
import * as _ from "lodash";

import { LinkProps } from "./common";
import { ThemeContext } from "../theme";

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
        const { theme } = this.context;
        const { linkId, linkPosition, isLinkSelected } = this.props;

        const style = isLinkSelected ? 
            {...theme?.link?.selected, ...this.props.link?.theme?.selected} : 
            {...theme?.link?.unselected, ...this.props.link?.theme?.unselected};

        return (
            <line
                id={`link_${linkId}`}
                x1={linkPosition.inputPinPosition.x}
                y1={linkPosition.inputPinPosition.y}
                x2={linkPosition.outputPinPosition.x}
                y2={linkPosition.outputPinPosition.y}
                style={style}
                onClick={this.onSelectLink.bind(this)}
            />
        );
    }
}

LineLink.contextType = ThemeContext;
