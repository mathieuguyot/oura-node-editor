import React, { useCallback, useRef } from "react";
import produce from "immer";

import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel } from "../model";

export default function TextAreaConnectorContent({
    connector,
    nodeId,
    cId,
    onConnectorUpdate
}: ConnectorContentProps) {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const onChange = useCallback(
        (event: React.FormEvent<HTMLTextAreaElement>) => {
            const newConnector = produce(connector, (draft: ConnectorModel) => {
                draft.data.value = event.currentTarget.value;
            });
            onConnectorUpdate(nodeId, cId, newConnector);
        },
        [cId, connector, nodeId, onConnectorUpdate]
    );

    const onMouseUp = useCallback(() => {
        if (textAreaRef.current) {
            const height = textAreaRef.current.style.height;
            const newConnector = produce(connector, (draft: ConnectorModel) => {
                draft.data.height = height;
            });
            onConnectorUpdate(nodeId, cId, newConnector);
        }
    }, [cId, connector, nodeId, onConnectorUpdate]);

    if (!("value" in connector.data)) {
        const message = "'text_area' connector types must provide a string field named 'value'";
        return <ErrorConnectorContent message={message} />;
    }
    const height = "height" in connector.data ? connector.data.height : 100;
    return (
        <div className="one-form-control one-w-full">
            <label className="one-label" style={{ paddingBottom: 0, paddingTop: 0 }}>
                <span className="one-label-text one-text-xs">{connector.name}</span>
            </label>
            <textarea
                ref={textAreaRef}
                style={{
                    height: height,
                    whiteSpace: "pre",
                    resize: "vertical"
                }}
                className="one-preflight  one-textarea one-textarea-primary focus:one-outline-0 one-text-base-content"
                value={connector.data.value}
                onChange={onChange}
                onMouseUp={onMouseUp}
                placeholder={connector.name}
            />
        </div>
    );
}
