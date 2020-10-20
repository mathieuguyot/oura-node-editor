import React from "react";

import { ConnectorType } from "../model";
import { ConnectorContentProps } from "./common";

import StringConnectorContent from "./string";

export default function createConnectorComponent(props: ConnectorContentProps): JSX.Element {
    const { nodeId, nodeX, nodeY, width, connectorModel, getZoom } = props;
    if (connectorModel.contentType === "string") {
        return (
            <StringConnectorContent
                nodeId={nodeId}
                nodeX={nodeX}
                nodeY={nodeY}
                width={width}
                connectorModel={connectorModel}
                getZoom={getZoom}
            />
        );
    }
    // Defaut return connector name
    const ct = connectorModel.connectorType;
    return (
        <div style={{ textAlign: ct === ConnectorType.Output ? "right" : "left" }}>
            {connectorModel.name}
        </div>
    );
}
