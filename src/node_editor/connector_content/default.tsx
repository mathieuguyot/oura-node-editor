import { ConnectorContentProps } from "./common";
import { PinLayout } from "../model";

export default function DefaultConnectorContent(props: ConnectorContentProps) {
    return (
        <div
            className="node-background one-text-base-content"
            style={{
                textAlign: props.connector.pinLayout === PinLayout.RIGHT_PIN ? "right" : "left"
            }}
        >
            {props.connector.name}
        </div>
    );
}
