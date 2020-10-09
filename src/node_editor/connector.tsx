import React, { Component } from 'react';
import { ConnectorModel, ConnectorType, XYPosition } from './model';
import * as _ from 'lodash'
import { createConnectorComponent } from "./connector_content";

type ConnectorProps = {
    nodeId: number,
    nodeX: number,
    nodeY: number,
    width: number,
    connectorModel: ConnectorModel,

    getZoom: () => number,

    onConnectorDragStart: (connectorModel: ConnectorModel, pinPosition: XYPosition) => void,
    onConnectorMouseMove: (mousePosition: XYPosition) => void,
    onConnectorMouseUp: () => void,
    onMouseOverConnector: (connectorModel: ConnectorModel, pinPosition: XYPosition) => void,
    onMouseLeavesConnector: (mousePosition: XYPosition) => void
}

class Connector extends Component<ConnectorProps, {}>  {
    private connectorPinRef = React.createRef<HTMLDivElement>();
    private pageX: number = 0;
    private pageY: number = 0;

    constructor(props: ConnectorProps) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseOverConnector = this.onMouseOverConnector.bind(this);
        this.onMouseLeavesConnector = this.onMouseLeavesConnector.bind(this);
    }

    shouldComponentUpdate(nextProps: ConnectorProps) {
        return !_.isEqual(this.props, nextProps);
    }

    getConnectorPinPosition() : XYPosition | null {
        const pin = this.connectorPinRef.current;
        const parent = pin?.parentElement;
        if(pin && parent) {
            const widthOffset = this.props.connectorModel.connectorType === ConnectorType.Output ? this.props.width : 0;
            const x = this.props.nodeX + widthOffset;
            const y = this.props.nodeY + parent.offsetTop + (parent.offsetHeight / 2);
            return {x: x, y: y};
        }
        return null;
    }

    onMouseDown(event : React.MouseEvent) {
        event.stopPropagation();
        const pin = this.connectorPinRef.current;
        const pinPosition = this.getConnectorPinPosition();
        const zoom = this.props.getZoom();
        if(pinPosition && pin) {
            window.addEventListener("mousemove", this.onMouseMove);
            window.addEventListener("mouseup", this.onMouseUp);
            this.pageX = event.pageX / zoom;
            this.pageY = event.pageY / zoom;
            this.props.onConnectorDragStart(this.props.connectorModel, pinPosition);
        }
    }

    onMouseMove(event: MouseEvent) {
        const pin = this.connectorPinRef.current;
        const zoom = this.props.getZoom();
        if(pin) {
            let deltaX = event.pageX / zoom - this.pageX;
            let deltaY = event.pageY / zoom - this.pageY;
            this.pageX = event.pageX / zoom;
            this.pageY = event.pageY / zoom;
            this.props.onConnectorMouseMove({x: deltaX, y: deltaY});
        }
    }

    onMouseUp() {
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
        this.props.onConnectorMouseUp();
    }

    onMouseOverConnector() {
        const pinPosition = this.getConnectorPinPosition();
        if(pinPosition) {
            this.props.onMouseOverConnector(this.props.connectorModel, pinPosition);
        }
    }

    onMouseLeavesConnector(event: React.MouseEvent) {
        const mousePosition = {x: event.pageX, y: event.pageY};
        this.props.onMouseLeavesConnector(mousePosition);
    }

    render() {
        const pinPxRadius = 7;
        const pinLeftPos  = this.props.connectorModel.connectorType === ConnectorType.Input ? -pinPxRadius : this.props.width - pinPxRadius;
        return (
            <div style={{
                color: "white",
                backgroundColor: "rgba(63, 63, 63, 0.75)",
                userSelect: "none",
                MozUserSelect: "none",
                position: "relative",
                paddingLeft: pinPxRadius * 2,
                paddingRight: pinPxRadius * 2
                }}>
                    <div style={{
                        width: pinPxRadius * 2,
                        height: pinPxRadius * 2,
                        left: pinLeftPos,
                        top: "calc(50% - " + pinPxRadius + "px)",
                        backgroundColor: "rgba(199, 199, 41, 1)",
                        position: "absolute",
                        borderRadius:"10px 10px 10px 10px",
                        cursor: "grab",
                        }}
                        ref={this.connectorPinRef}
                        onMouseDown={this.onMouseDown}
                        onMouseOver={this.onMouseOverConnector}
                        onMouseLeave={this.onMouseLeavesConnector}
                    />
                    <div style={{overflow: "hidden"}}>
                        {createConnectorComponent(this.props)}
                    </div>
            </div>
        );
    }

}

export default Connector;