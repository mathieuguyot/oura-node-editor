import React from 'react';
import { ConnectorType } from '../model';
import { ConnectorContentProps } from './common';
import StringConnectorContent from './string';

export function createConnectorComponent(props: ConnectorContentProps)
{
    if(props.connectorModel.contentType === "string")
    {
        return <StringConnectorContent {...props}/>;
    }
    // Defaut return connector name
    const ct = props.connectorModel.connectorType;
    return <div style={{textAlign: ct === ConnectorType.Output ? "right" : "left"}}>
        {props.connectorModel.name}
    </div>;
}