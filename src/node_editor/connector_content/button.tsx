import ErrorConnectorContent from "./error";
import { ConnectorContentProps } from "./common";

const ButtonConnectorContent = ({ connector, node }: ConnectorContentProps): JSX.Element => {
    if (!("label" in connector.data) || !("onClick" in connector.data)) {
        const message =
            "'button' connector types must provide a string field named 'label' and a callback 'onClick'";
        return <ErrorConnectorContent message={message} />;
    }

    return (
        <button
            className="btn btn-primary btn-xs w-full"
            onClick={() => connector.data.onClick(node)}
        >
            {connector.data.label}
        </button>
    );
};

export default ButtonConnectorContent;
