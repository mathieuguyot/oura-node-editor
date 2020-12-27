import React, { Component } from "react";
import produce from "immer";
import _ from "lodash";

import ErrorConnectorContentProps from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel } from "../model";
import { ThemeContext } from "../theme";

type StringConnectorContentState = {
    preventPropation: boolean;
};

export default class StringConnectorContent extends Component<
    ConnectorContentProps,
    StringConnectorContentState
> {
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
        const { nodeId, cId, connector, onConnectorUpdate } = this.props;
        const newConnector = produce(connector, (draft: ConnectorModel) => {
            draft.data.value = event.currentTarget.value;
        });
        onConnectorUpdate(nodeId, cId, newConnector);
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
        const { theme } = this.context;
        const { connector } = this.props;
        if (!("value" in connector.data)) {
            const message = "'string' connector types must provide a string field named 'value'";
            return <ErrorConnectorContentProps message={message} />;
        }
        return (
            <input
                style={theme?.connectors?.string}
                tabIndex={-1}
                value={connector.data.value}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
                onChange={this.onChange}
                placeholder={connector.name}
            />
        );
    }
}

StringConnectorContent.contextType = ThemeContext;
