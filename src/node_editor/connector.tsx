import React, { Component } from "react";
import * as _ from "lodash";
import { ConnectorModel, ConnectorType, XYPosition } from "./model";
import { createConnectorComponent } from "./connector_content";
import CSS from "csstype";
import { default_styles } from "./default_styles";
import DragWrapper from "./drag_wrapper";

type ConnectorProps = {
    nodeId: number,
    nodeX: number,
    nodeY: number,
    width: number,
    connectorModel: ConnectorModel,

    getZoom: () => number,

    onCreateLink: (inputNodeId: number, inputConnectorId: number, outputNodeId: number, outputConnectorId: number) => void,
    onUpdatePreviewLink: (inputPosition: XYPosition | null, outputPosition: XYPosition | null) => void
}

class Connector extends Component<ConnectorProps>  {
    private dragWrapper: DragWrapper = new DragWrapper();
    private connectorPinRef = React.createRef<HTMLDivElement>();
    private pinPxRadius = 7;

    constructor(props: ConnectorProps) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
    }

    shouldComponentUpdate(nextProps: ConnectorProps) : boolean {
        return !_.isEqual(this.props, nextProps);
    }

    getConnectorPinPosition() : XYPosition | null {
        const pin = this.connectorPinRef.current;
        const parent = pin?.parentElement;
        if(pin && parent) {
            const widthOffset = this.props.connectorModel.connectorType === ConnectorType.Output ? this.props.width : 0;
            const x = this.props.nodeX + widthOffset;
            const y = this.props.nodeY + parent.offsetTop + parent.offsetHeight / 2;
            return {x: x, y: y};
        }
        return null;
    }

    onMouseDown(event : React.MouseEvent) : void {
        const pinPosition = this.getConnectorPinPosition();
        const zoom = this.props.getZoom();
        if(pinPosition) {
            this.dragWrapper.onMouseDown(event, pinPosition, zoom,
                (initialPos: XYPosition, finalPos: XYPosition) => {
                    this.props.onUpdatePreviewLink(initialPos, finalPos);
                },
                (initialPos: XYPosition, finalPos: XYPosition, targetClassName: string) => {
                    const connectorRegex = /node-(.+)-connector-(.+)-(input|output)/;
                    const tag = targetClassName.match(connectorRegex);
                    if(tag !== null)
                    {
                        this.props.onCreateLink(this.props.nodeId, this.props.connectorModel.id, +tag[1], +tag[2]);
                    }
                    this.props.onUpdatePreviewLink(null, null);
                });
        }
    }

    render() : JSX.Element {
        const pinLeftPos  = this.props.connectorModel.connectorType === ConnectorType.Input ? -this.pinPxRadius : this.props.width - this.pinPxRadius;
        
        const connector_style: CSS.Properties  = {
            position:"absolute",
            width: (this.pinPxRadius * 2) + "px",
            height: (this.pinPxRadius * 2) + "px",
            left: pinLeftPos + "px",
            top: "calc(50% - " + this.pinPxRadius + "px)",
        };

        return (
            <div style={{
                position: "relative",
                paddingLeft: this.pinPxRadius * 2,
                paddingRight: this.pinPxRadius * 2
            }}>
                <div
                    className={"node-" + this.props.nodeId + "-connector-" + this.props.connectorModel.id + "-input"} 
                    style={{...connector_style, ...default_styles.dark.connector}}
                    ref={this.connectorPinRef}
                    onMouseDown={this.onMouseDown}
                />
                <div style={{overflow: "hidden"}}>
                    {createConnectorComponent(this.props)}
                </div>
            </div>
        );
    }

}

export default Connector;
