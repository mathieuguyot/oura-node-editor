import React, { Component } from 'react';
import * as _ from 'lodash';

import { LinkProps } from './common';
import { default_styles } from '../default_styles';

export default class LineLink extends Component<LinkProps, {}> {

    shouldComponentUpdate(nextProps: LinkProps) {
        return !_.isEqual(this.props, nextProps);
    }

    render() {
        const {link} = this.props;
        if(link.inputPinPosition && link.outputPinPosition) {
            let x1 = link.inputPinPosition.x;
            let y1 = link.inputPinPosition.y;
            let x2 = link.outputPinPosition.x;
            let y2 = link.outputPinPosition.y;
            return (
                <line x1={x1} y1={y1} x2={x2} y2={y2} 
                    style={default_styles.dark.link} />
            );
        }
        return null;
    }
}