import React, { Component } from "react";
import produce from "immer";
import _ from "lodash";

import ErrorConnectorContentProps from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel } from "../model";

type StringConnectorContentState = {
    preventPropation: boolean;
};

class StringConnectorContent extends Component<ConnectorContentProps, StringConnectorContentState> {
    constructor(props: ConnectorContentProps) {
        super(props);
        this.state = {
            preventPropation: false
        };

        this.onChange = this.onChange.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    shouldComponentUpdate(nextProps: ConnectorContentProps): boolean {
        return !_.isEqual(this.props, nextProps);
    }

    onChange(event: React.FormEvent<HTMLInputElement>): void {
        const { nodeId, connectorId, connector, onConnectorUpdate } = this.props;
        const newConnector = produce(connector, (draft: ConnectorModel) => {
            draft.data.value = event.currentTarget.value;
        });
        onConnectorUpdate(nodeId, connectorId, newConnector);
    }

    onMouseDown(): void {
        this.setState({
            preventPropation: true
        });
    }

    onMouseUp(): void {
        this.setState({
            preventPropation: false
        });
    }

    onMouseMove(event: React.MouseEvent): void {
        const { preventPropation } = this.state;
        if (preventPropation) {
            event.stopPropagation();
        }
    }

    render(): JSX.Element {
        const { connector } = this.props;
        if (!("value" in connector.data)) {
            const message = "'string' connector types must provide a string field named 'value'";
            return <ErrorConnectorContentProps message={message} />;
        }
        return (
            <input
                tabIndex={-1}
                value={connector.data.value}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
                onChange={this.onChange}
                placeholder={connector.name}
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
