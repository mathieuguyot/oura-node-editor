import { ConnectorModel} from '../model';

export type ConnectorContentProps = {
    nodeId: number,
    nodeX: number,
    nodeY: number,
    width: number,
    connectorModel: ConnectorModel,

    getZoom: () => number,
};
