import { useCallback, useContext } from "react";
import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel, ThemeContext } from "..";
import produce from "immer";

const SelectConnectorContent = ({
    connector,
    nodeId,
    cId,
    onConnectorUpdate
}: ConnectorContentProps): JSX.Element => {
    const { theme } = useContext(ThemeContext);

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
        <div className="form-control w-full">
            <label className="label" style={{ paddingBottom: 0, paddingTop: 0 }}>
                <span className="label-text text-xs">{connector.name}</span>
            </label>
            <select
                className="input input-bordered input-primary input-xs w-full focus:outline-0"
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
