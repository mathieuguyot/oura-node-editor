import { useCallback } from "react";
import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel } from "..";
import produce from "immer";

const SelectConnectorContent = ({
    connector,
    nodeId,
    cId,
    onConnectorUpdate
}: ConnectorContentProps): JSX.Element => {
    const setSelectedValue = useCallback(
        (selected_index: number) => {
            const newConnector = produce(connector, (draft: ConnectorModel) => {
                draft.data.selected_index = selected_index;
            });
            onConnectorUpdate(nodeId, cId, newConnector);
        },
        [onConnectorUpdate, nodeId, cId, connector]
    );

    if (!("values" in connector.data) || !("selected_index" in connector.data)) {
        const message =
            "'select' connector types must provide a string array field named 'values' and a number field 'selected_index'";
        return <ErrorConnectorContent message={message} />;
    }

    return (
        <div className="one-form-control one-w-full">
            <label className="one-label" style={{ paddingBottom: 0, paddingTop: 0 }}>
                <span className="one-label-text one-text-xs">{connector.name}</span>
            </label>
            <select
                className="one-preflight  one-input one-input-bordered one-input-primary one-input-xs one-w-full focus:one-outline-0"
                onChange={(event) => setSelectedValue(event.target.selectedIndex)}
                defaultValue={connector.data.values[connector.data.selected_index]}
            >
                {connector.data.values.map((value: string) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectConnectorContent;
