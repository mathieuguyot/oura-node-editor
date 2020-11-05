import React from "react";

import { ConnectorContentProps } from "./common";
import DefaultConnectorContent from "./default";
import StringConnectorContent from "./string";

export default function createConnectorComponent(props: ConnectorContentProps): JSX.Element {
    const { nodeId, connectorId, node, connector, getZoom, onConnectorUpdate } = props;
    if (connector.contentType === "string") {
        return (
            <StringConnectorContent
                nodeId={nodeId}
                connectorId={connectorId}
                node={node}
                connector={connector}
                getZoom={getZoom}
                onConnectorUpdate={onConnectorUpdate}
            />
        );
    }
    // Defaut return connector name
    return (
        <DefaultConnectorContent
            nodeId={nodeId}
            connectorId={connectorId}
            node={node}
            connector={connector}
            getZoom={getZoom}
            onConnectorUpdate={onConnectorUpdate}
        />
    );
}
