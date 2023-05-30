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
            className="one-preflight one-btn one-btn-primary one-btn-xs one-w-full one-text-primary-content"
            onClick={() => connector.data.onClick(node)}
            style={{ border: "0px", marginBottom: "2px" }}
        >
            {connector.data.label}
        </button>
    );
};

export default ButtonConnectorContent;
