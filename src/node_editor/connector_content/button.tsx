import React, { useContext } from "react";
import _ from "lodash";

import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";
import { ThemeContext } from "..";

const ButtonConnectorContent = ({connector, node}: ConnectorContentProps): JSX.Element => {
    const { theme } = useContext(ThemeContext);

    if(!("label" in connector.data) || !("onClick" in connector.data) ) {
        const message = "'button' connector types must provide a string field named 'label' and a callback 'onClick'";
        return <ErrorConnectorContent message={message} />;
    }

    return (
        <button 
            style={theme?.connectors?.button} 
            onClick={() => connector.data.onClick(node)}
        >
            {connector.data.label}
        </button>
    );
}

export default ButtonConnectorContent;