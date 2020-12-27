/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import CheckBox from "./check_box";

import { ConnectorContentProps } from "./common";
import DefaultConnectorContent from "./default";
import StringConnectorContent from "./string";

export default function createConnectorComponent(props: ConnectorContentProps): JSX.Element {
    const { connector } = props;
    if (connector.contentType === "string") {
        return <StringConnectorContent {...props} />;
    }
    if (connector.contentType === "check_box") {
        return <CheckBox {...props} />;
    }
    // Defaut return connector name
    return <DefaultConnectorContent {...props} />;
}
