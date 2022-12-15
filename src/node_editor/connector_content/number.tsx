import React, { Component } from "react";
import produce from "immer";
import _ from "lodash";

import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel } from "../model";
import { ThemeContext, ThemeContextType } from "../theme";

export default class NumberConnectorContent extends Component<ConnectorContentProps> {
    constructor(props: ConnectorContentProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    shouldComponentUpdate(nextProps: ConnectorContentProps): boolean {
        return !_.isEqual(this.props, nextProps);
    }

    onChange(event: React.FormEvent<HTMLInputElement>): void {
        const { nodeId, cId, connector, onConnectorUpdate } = this.props;
        if (isNaN(Number(event.currentTarget.value))) {
            return;
        }
        const newConnector = produce(connector, (draft: ConnectorModel) => {
            draft.data.value = event.currentTarget.value;
        });
        onConnectorUpdate(nodeId, cId, newConnector);
    }

    render(): JSX.Element {
        const { theme } = this.context as ThemeContextType;
        const { connector } = this.props;
        if (!("value" in connector.data)) {
            const message = "'number' connector types must provide a string field named 'value'";
            return <ErrorConnectorContent message={message} />;
        }
        return (
            <div style={{ display: "flex" }}>
                <div className="node-background" style={theme?.connectors?.leftText}>
                    {connector.name}
                </div>
                <input
                    disabled={"disabled" in connector.data ? connector.data.disabled : false}
                    style={theme?.connectors?.number}
                    value={connector.data.value}
                    onChange={this.onChange}
                    placeholder={connector.name}
                />
            </div>
        );
    }
}

NumberConnectorContent.contextType = ThemeContext;
