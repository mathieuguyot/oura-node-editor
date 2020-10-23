import { ConnectorModel, NodeModel } from "../model";

export type ConnectorContentProps = {
    node: NodeModel;
    connector: ConnectorModel;

    getZoom: () => number;
};
