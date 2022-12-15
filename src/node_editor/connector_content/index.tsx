/* eslint-disable react/jsx-props-no-spreading */
import React from "react";

import { ConnectorContentProps } from "./common";
import DefaultConnectorContent from "./default";
import CheckBox from "./check_box";
import ErrorConnectorComponent from "./error";
import NumberConnectorContent from "./number";
import SelectConnectorContent from "./select";
import ButtonConnectorContent from "./button";
import TextAreaConnectorContent from "./text_area";
import StringConnectorContent from "./string";

export type { ConnectorContentProps };
export { ErrorConnectorComponent };

export function createConnectorComponent(props: ConnectorContentProps): JSX.Element {
    const { connector } = props;
    if (connector.contentType === "string") {
        return <StringConnectorContent {...props} />;
    }
    if (connector.contentType === "text_area") {
        return <TextAreaConnectorContent {...props} />;
    }
    if (connector.contentType === "number") {
        return <NumberConnectorContent {...props} />;
    }
    if (connector.contentType === "check_box") {
        return <CheckBox {...props} />;
    }
    if (connector.contentType === "select") {
        return <SelectConnectorContent {...props} />;
    }
    if (connector.contentType === "button") {
        return <ButtonConnectorContent {...props} />;
    }
    // Defaut return connector name
    return <DefaultConnectorContent {...props} />;
}
