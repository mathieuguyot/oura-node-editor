import React, { Component } from "react";
import produce from "immer";

import ErrorConnectorContentProps from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel } from "../model";

class CheckBox extends Component<ConnectorContentProps> {
    constructor(props: ConnectorContentProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(): void {
        const { nodeId, cId, connector, onConnectorUpdate } = this.props;
        const newConnector = produce(connector, (draft: ConnectorModel) => {
            draft.data.value = !draft.data.value;
        });
        onConnectorUpdate(nodeId, cId, newConnector);
    }

    render(): JSX.Element {
        const { connector } = this.props;
        if (!("value" in connector.data)) {
            const message = "'check_box' connector types must provide a bool field named 'value'";
            return <ErrorConnectorContentProps message={message} />;
        }
        return (
            <>
                <input
                    tabIndex={-1}
                    checked={connector.data.value}
                    onChange={this.onChange}
                    type="checkbox"
                    style={{
                        backgroundColor: "#585858",
                        color: "white",
                        border: 0,
                        outline: "none"
                    }}
                />
                {connector.name}
            </>
        );
    }
}

export default CheckBox;
