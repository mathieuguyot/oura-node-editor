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
        const { connector } = this.props;
        if (!("value" in connector.data)) {
            const message = "'string' connector types must provide a string field named 'value'";
            return <ErrorConnectorContent message={message} />;
        }
        return (
            <div className="form-control w-full">
                <label className="label" style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <span className="label-text text-xs">{connector.name}</span>
                </label>
                <input
                    type="text"
                    className="input input-bordered input-primary input-xs w-full focus:outline-0"
                    value={connector.data.value}
                    onChange={this.onChange}
                    placeholder={connector.name}
                    disabled={"disabled" in connector.data ? connector.data.disabled : false}
                />
            </div>
        );
    }
}

StringConnectorContent.contextType = ThemeContext;
