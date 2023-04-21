import React, { useCallback } from "react";
import produce from "immer";

import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel } from "../model";

export default function NumberConnectorContent({
    connector,
    nodeId,
    cId,
    onConnectorUpdate
}: ConnectorContentProps) {
    const onChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            if (isNaN(Number(event.currentTarget.value))) {
                return;
            }
            const newConnector = produce(connector, (draft: ConnectorModel) => {
                draft.data.value = event.currentTarget.value;
            });
            onConnectorUpdate(nodeId, cId, newConnector);
        },
        [cId, connector, nodeId, onConnectorUpdate]
    );

    if (!("value" in connector.data)) {
        const message = "'number' connector types must provide a string field named 'value'";
        return <ErrorConnectorContent message={message} />;
    }
    return (
        <div className="form-control w-full">
            <label className="label" style={{ paddingBottom: 0, paddingTop: 0 }}>
                <span className="label-text text-xs">{connector.name}</span>
            </label>
            <input
                className="input input-bordered input-primary input-xs w-full focus:outline-0"
                disabled={"disabled" in connector.data ? connector.data.disabled : false}
                value={connector.data.value}
                onChange={onChange}
                placeholder={connector.name}
            />
        </div>
    );
}
