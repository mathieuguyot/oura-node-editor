import React, { Component } from "react";
import produce from "immer";
import _ from "lodash";

import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel } from "../model";
import { ThemeContext, ThemeContextType } from "../theme";

export default class TextAreaConnectorContent extends Component<ConnectorContentProps> {
    private textAreaRef = React.createRef<HTMLTextAreaElement>();

    constructor(props: ConnectorContentProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    shouldComponentUpdate(nextProps: ConnectorContentProps): boolean {
        return !_.isEqual(this.props, nextProps);
    }

    onChange(event: React.FormEvent<HTMLTextAreaElement>): void {
        const { nodeId, cId, connector, onConnectorUpdate } = this.props;
        const newConnector = produce(connector, (draft: ConnectorModel) => {
            draft.data.value = event.currentTarget.value;
        });
        onConnectorUpdate(nodeId, cId, newConnector);
    }

    onMouseUp() {
        if(this.textAreaRef.current) {
            const { nodeId, cId, connector, onConnectorUpdate } = this.props;
            const height = this.textAreaRef.current.style.height;
            const newConnector = produce(connector, (draft: ConnectorModel) => {
                draft.data.height = height;
            });
            onConnectorUpdate(nodeId, cId, newConnector);
        }
    }

    render(): JSX.Element {
        const { theme } = this.context as ThemeContextType;
        const { connector } = this.props;
        if (!("value" in connector.data)) {
            const message = "'text_area' connector types must provide a string field named 'value'";
            return <ErrorConnectorContent message={message} />;
        }
        const height = "height" in connector.data ? connector.data.height : 100;
        return (
            <textarea
                ref= {this.textAreaRef}
                style={{height: height, whiteSpace: "pre", resize: "vertical", ...theme?.connectors?.string}}
                value={connector.data.value}
                onChange={this.onChange}
                onMouseUp={this.onMouseUp}
                placeholder={connector.name}
            />
        );
    }
}

TextAreaConnectorContent.contextType = ThemeContext;
