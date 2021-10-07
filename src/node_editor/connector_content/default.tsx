import React, { Component } from "react";

import * as _ from "lodash";
import { ConnectorContentProps } from "./common";
import { PinLayout } from "../model";

class DefaultConnectorContent extends Component<ConnectorContentProps> {
    shouldComponentUpdate(nextProps: ConnectorContentProps): boolean {
        return !_.isEqual(this.props, nextProps);
    }

    render(): JSX.Element {
        const { connector } = this.props;
        return (
            <div
                className="node-background"
                style={{
                    textAlign: connector.pinLayout === PinLayout.RIGHT_PIN ? "right" : "left"
                }}
            >
                {connector.name}
            </div>
        );
    }
}

export default DefaultConnectorContent;
