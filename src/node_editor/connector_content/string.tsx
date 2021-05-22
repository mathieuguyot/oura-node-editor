import React, { Component } from "react";
import produce from "immer";
import _ from "lodash";

import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel } from "../model";
import { ThemeContext } from "../theme";

export default class StringConnectorContent extends Component<ConnectorContentProps> {
    constructor(props: ConnectorContentProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    shouldComponentUpdate(nextProps: ConnectorContentProps): boolean {
        return !_.isEqual(this.props, nextProps);
    }

    onChange(event: React.FormEvent<HTMLInputElement>): void {
        const { nodeId, cId, connector, onConnectorUpdate } = this.props;
        const newConnector = produce(connector, (draft: ConnectorModel) => {
            draft.data.value = event.currentTarget.value;
        });
        onConnectorUpdate(nodeId, cId, newConnector);
    }

    render(): JSX.Element {
        const { theme } = this.context;
        const { connector } = this.props;
        if (!("value" in connector.data)) {
            const message = "'string' connector types must provide a string field named 'value'";
            return <ErrorConnectorContent message={message} />;
        }
        return (
            <input
                style={theme?.connectors?.string}
                tabIndex={-1}
                value={connector.data.value}
                onChange={this.onChange}
                placeholder={connector.name}
            />
        );
    }
}

StringConnectorContent.contextType = ThemeContext;
