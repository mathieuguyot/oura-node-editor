import { useCallback } from "react";
import produce from "immer";

import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel } from "../model";

export default function CheckBox(props: ConnectorContentProps) {
    const onChange = useCallback(() => {
        const newConnector = produce(props.connector, (draft: ConnectorModel) => {
            draft.data.value = !draft.data.value;
        });
        props.onConnectorUpdate(props.nodeId, props.cId, newConnector);
    }, [props]);

    if (!("value" in props.connector.data)) {
        const message = "'check_box' connector types must provide a bool field named 'value'";
        return <ErrorConnectorContent message={message} />;
    }

    return (
        <div
            className="one-label one-preflight node-background"
            style={{ justifyContent: "flex-start" }}
        >
            <input
                tabIndex={-1}
                checked={props.connector.data.value}
                onChange={onChange}
                type="checkbox"
                disabled={props.connector.data.disabled}
                className="one-preflight  one-checkbox one-checkbox-xs one-checkbox-primary focus:one-outline-0 one-text-base-content"
            />
            <div className="one-preflight" style={{ paddingLeft: 3 }}>
                {props.connector.name}
            </div>
        </div>
    );
}
