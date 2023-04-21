export type ErrorConnectorContentProps = {
    message: string;
};

const ErrorConnectorComponent = (props: ErrorConnectorContentProps): JSX.Element => {
    const { message } = props;
    return <div style={{ color: "red" }}>{`error: ${message}`}</div>;
};

export default ErrorConnectorComponent;
