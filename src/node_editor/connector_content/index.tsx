/* eslint-disable react/jsx-props-no-spreading */
import React from "react";

import { ConnectorContentProps } from "./common";
import DefaultConnectorContent from "./default";
import StringConnectorContent from "./string";
import CheckBox from "./check_box";
import ErrorConnectorComponent from "./error";
import NumberConnectorContent from "./number";

export type { ConnectorContentProps };
export { ErrorConnectorComponent };

export function createConnectorComponent(props: ConnectorContentProps): JSX.Element {
    const { connector } = props;
    if (connector.contentType === "string") {
        return <StringConnectorContent {...props} />;
    }
    if(connector.contentType === "number") {
        return <NumberConnectorContent {...props} />;
    }
    if (connector.contentType === "check_box") {
        return <CheckBox {...props} />;
    }
    // Defaut return connector name
    return <DefaultConnectorContent {...props} />;
}
