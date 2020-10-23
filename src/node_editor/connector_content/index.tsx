import React from "react";

import { ConnectorContentProps } from "./common";
import DefaultConnectorContent from "./default";
import StringConnectorContent from "./string";

export default function createConnectorComponent(props: ConnectorContentProps): JSX.Element {
    const { node, connector, getZoom } = props;
    if (connector.contentType === "string") {
        return <StringConnectorContent node={node} connector={connector} getZoom={getZoom} />;
    }
    // Defaut return connector name
    return <DefaultConnectorContent node={node} connector={connector} getZoom={getZoom} />;
}
