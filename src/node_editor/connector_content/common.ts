import { ConnectorModel, NodeModel } from "../model";

export type ConnectorContentProps = {
    nodeId: string;
    cId: string;
    node: NodeModel;
    connector: ConnectorModel;

    getZoom: () => number;
    onConnectorUpdate: (nodeId: string, cId: string, connector: ConnectorModel) => void;
};
