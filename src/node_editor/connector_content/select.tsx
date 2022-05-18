import React, { useCallback, useContext } from "react";
import _ from "lodash";

import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";
import { ConnectorModel, ThemeContext } from "..";
import produce from "immer";

const SelectConnectorContent = ({connector, nodeId, cId, onConnectorUpdate}: ConnectorContentProps): JSX.Element => {
    const { theme } = useContext(ThemeContext);

    if(!("values" in connector.data) || !("selected_index" in connector.data) ) {
        const message = "'select' connector types must provide a string array field named 'values' and a number field 'selected_index'";
        return <ErrorConnectorContent message={message} />;
    }

    const setSelectedValue = useCallback((selected_index: number) => {
        const newConnector = produce(connector, (draft: ConnectorModel) => {
            draft.data.selected_index = selected_index;
        });
        onConnectorUpdate(nodeId, cId, newConnector);
    }, [onConnectorUpdate, nodeId, cId, connector]);

    return (
        <div style={{display: "flex"}}>
            <div className="node-background" style={theme?.connectors?.leftText}>{ connector.name }</div>
            <select 
                onChange={(event) => setSelectedValue(event.target.selectedIndex)}
                style={theme?.connectors?.select}
                defaultValue={connector.data.values[connector.data.selected_index]}
            >
                {connector.data.values.map((value: string) => {
                    return <option key={value} value={value}>{value}</option>
                })}
            </select>
        </div>

    );
}

export default SelectConnectorContent;