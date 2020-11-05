import { ConnectorModel, NodeModel } from "../model";

export type ConnectorContentProps = {
    nodeId: string;
    connectorId: string;
    node: NodeModel;
    connector: ConnectorModel;

    getZoom: () => number;
    onConnectorUpdate: (nodeId: string, connectorId: string, connector: ConnectorModel) => void;
};
