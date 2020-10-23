import React, { Component } from "react";
import * as _ from "lodash";

import { LinkProps } from "./common";
import defaultStyles from "../default_styles";

export default class LineLink extends Component<LinkProps> {
    shouldComponentUpdate(nextProps: LinkProps): boolean {
        return !_.isEqual(this.props, nextProps);
    }

    render(): JSX.Element {
        const { linkPosition } = this.props;
        return (
            <line
                x1={linkPosition.inputPinPosition.x}
                y1={linkPosition.inputPinPosition.y}
                x2={linkPosition.outputPinPosition.x}
                y2={linkPosition.outputPinPosition.y}
                style={defaultStyles.dark.link}
            />
        );
    }
}
