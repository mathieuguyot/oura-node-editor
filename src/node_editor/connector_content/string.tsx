import React, { Component } from "react";

import * as _ from "lodash";
import { ConnectorContentProps } from "./common";

class StringConnectorContent extends Component<ConnectorContentProps> {
    shouldComponentUpdate(nextProps: ConnectorContentProps): boolean {
        return !_.isEqual(this.props, nextProps);
    }

    render(): JSX.Element {
        return (
            <input
                style={{
                    width: "100%",
                    backgroundColor: "#585858",
                    color: "white",
                    border: 0,
                    outline: "none"
                }}
            />
        );
    }
}

export default StringConnectorContent;
