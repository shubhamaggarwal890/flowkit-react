import * as React from "react";
import { SymbolPaletteComponent, DiagramComponent, Node, NodeConstraints, ConnectorConstraints } from "@syncfusion/ej2-react-diagrams";
import { SampleBase } from './../Samplebase';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import './../../assets/kitdrawer.css';
import StepLabel from '@material-ui/core/StepLabel';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import ActivityDrawer from './Activitydrawer';
import WorkFlowSaver from './Workflowsaver';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


let interval;
interval = [
    1,
    9,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75,
    0.25,
    9.75
];
let gridlines = {
    lineColor: "#e0e0e0",
    lineIntervals: interval
};

//Initialize the flowshapes for the symbol palatte
let flowshapes = [
    { id: "Terminator", shape: { type: "Flow", shape: "Terminator" } },
    { id: "Process", shape: { type: "Flow", shape: "Process" } },
    { id: "Decision", shape: { type: "Flow", shape: "Decision" } },

];
//Initializes connector symbols for the symbol palette
let connectorSymbols = [
    {
        id: "Link1",
        type: "Orthogonal",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        targetDecorator: { shape: "Arrow" },
        style: { strokeWidth: 2 }
    },
    {
        id: "Link3",
        type: "Straight",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        targetDecorator: { shape: "Arrow" },
        style: { strokeWidth: 2 }
    }
];
class Kitdrawer extends SampleBase {

    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            diagramInstance: null,
            error_snackbar: false,
            error_message: null,
            modify_button: false,
        }
        this.props.resetDrawer();
    }

    componentDidUpdate() {
        if (this.state.diagramInstance !== null && this.state.modify_button) {
            let diagramTempInstance = this.state.diagramInstance;
            for (let i = 0; i < diagramTempInstance.nodes.length; i++) {
                diagramTempInstance.nodes[i].constraints &= ~(NodeConstraints.Resize | NodeConstraints.Rotate | NodeConstraints.Drag);
                diagramTempInstance.nodes[i].constraints &= ~(NodeConstraints.Delete | NodeConstraints.Select | NodeConstraints.Default);
                diagramTempInstance.nodes[i].constraints |= NodeConstraints.ReadOnly;
            }
            for (let i = 0; i < diagramTempInstance.connectors.length; i++) {
                diagramTempInstance.connectors[i].constraints &= ~(ConnectorConstraints.Resize | ConnectorConstraints.Rotate | ConnectorConstraints.Drag);
                diagramTempInstance.connectors[i].constraints &= ~(ConnectorConstraints.Delete);
                diagramTempInstance.connectors[i].constraints |= ConnectorConstraints.ReadOnly;
            }
    
            this.setState({
                ...this.state,
                diagramInstance: diagramTempInstance
            })
        }
    }

    resetActiveStep = () => {
        this.setState({
            ...this.state,
            activeStep: 0,
        })
    }

    handleNextStep = () => {
        if (this.state.diagramInstance != null) {
            this.props.diagramSettings(this.state.diagramInstance.nodes, this.state.diagramInstance.connectors)
            let count = 0;
            this.state.diagramInstance.nodes.forEach(element => {
                if (element.annotations[0] != null && element.annotations[0].content != null && element.annotations[0].content.length > 0) {
                    count += 1
                }
            });
            if (this.state.diagramInstance.nodes.length !== count || (this.state.diagramInstance.connectors == null
                || this.state.diagramInstance.connectors.length === 0)) {
                this.setState({
                    ...this.state,
                    error_message: "Kindly draw a valid workflow diagram!",
                    error_snackbar: true
                })
                return;
            }
        }

        if (this.state.activeStep === 1) {
            let valid_activity = 0;
            this.props.nodes.forEach(element => {
                if (element.valid != null && element.valid === true) {
                    valid_activity += 1
                }
            });
            if (this.props.nodes.length !== valid_activity) {
                this.setState({
                    ...this.state,
                    error_message: "Kindly fill all the details about activities in the workflow!",
                    error_snackbar: true
                })
                return;
            }
        }

        this.setState({
            ...this.state,
            modify_button: false,
            activeStep: this.state.activeStep + 1
        })
    }

    handlePreviousStep = () => {
        
        if (this.state.activeStep === 1) {
            this.setState({
                ...this.state,
                modify_button: true,
                activeStep: this.state.activeStep - 1
            })

        } else {
            this.setState({
                ...this.state,
                modify_button: false,
                activeStep: this.state.activeStep - 1
            })
        }
    }

    handleCloseSnackBar = () => {
        this.setState({
            ...this.state,
            error_snackbar: false
        })
    }

    clearDiagramInstance = () => {
        if(this.state.diagramInstance!=null){
            this.state.diagramInstance.clear()
            this.props.resetDrawer();
            if(this.state.modify_button){
                this.setState({
                    ...this.state,
                    modify_button: false,
    
                })
            }
        }
    }

    render() {
        const steps = getSteps();
        return (
            <div className="control-pane">
                <Stepper activeStep={this.state.activeStep} nonLinear>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <ButtonGroup color="primary" aria-label="outlined primary button group"
                    style={{ marginBottom: '10px', marginLeft: '10px' }}>
                    {this.state.activeStep === 0 ?
                        <Button startIcon={<CreateIcon />} onClick={this.clearDiagramInstance}>New</Button> :
                        <Button startIcon={<NavigateBeforeIcon />}
                            onClick={this.handlePreviousStep}>Back</Button>}

                    {this.state.activeStep !== 2 ?
                        <Button startIcon={<NavigateNextIcon />}
                            onClick={this.handleNextStep}>Next</Button> : null}

                </ButtonGroup>

                {this.state.activeStep === 0 ?

                    <div className="control-section">
                        <div style={{ width: "100%", height: "80%" }}>
                            {!this.state.modify_button ? <div id="palette-space" className="sb-mobile-palette">
                                <SymbolPaletteComponent id="symbolpalette" expandMode="Multiple" palettes={[
                                    {
                                        id: "flow",
                                        expanded: true,
                                        symbols: flowshapes,
                                        title: "Flow Shapes"
                                    },
                                    {
                                        id: "connectors",
                                        expanded: true,
                                        symbols: connectorSymbols,
                                        title: "Connectors"
                                    }
                                ]} //set default value for Node.
                                    getNodeDefaults={(symbol) => {
                                        if (symbol.id === "Terminator" ||
                                            symbol.id === "Process" ||
                                            symbol.id === "Delay") {
                                            symbol.width = 80;
                                            symbol.height = 40;
                                        }
                                        else if (symbol.id === "Decision" ||
                                            symbol.id === "Document" ||
                                            symbol.id === "PreDefinedProcess" ||
                                            symbol.id === "PaperTap" ||
                                            symbol.id === "DirectData" ||
                                            symbol.id === "MultiDocument" ||
                                            symbol.id === "Data") {
                                            symbol.width = 50;
                                            symbol.height = 40;
                                        }
                                        else {
                                            symbol.width = 50;
                                            symbol.height = 50;
                                        }
                                    }} symbolMargin={{ left: 15, right: 15, top: 15, bottom: 15 }} getSymbolInfo={(symbol) => {
                                        return { fit: true };
                                    }} width={"100%"} height={"700px"} symbolHeight={60} symbolWidth={60} />
                            </div>:null}

                            <div id="diagram-space" className="sb-mobile-diagram">
                                <DiagramComponent id="diagram" ref={diagram => (this.state.diagramInstance = diagram)}
                                    width={"100%"} height={"645px"} nodes={this.props.nodes} connectors={this.props.connectors}
                                    snapSettings={{
                                        horizontalGridlines: gridlines,
                                        verticalGridlines: gridlines
                                    }} getConnectorDefaults={(args, diagram) => {
                                        args.targetDecorator.height = 5;
                                        args.targetDecorator.width = 5;
                                        args.style.strokeColor = "#797979";
                                        args.targetDecorator.style = {
                                            fill: "#797979",
                                            strokeColor: "#797979"
                                        };
                                        return args;
                                    }}
                                    //Sets the Node style for DragEnter element.
                                    dragEnter={(args) => {
                                        let obj = args.element;
                                        if (obj instanceof Node) {
                                            let ratio = 100 / obj.width;
                                            obj.width = 100;
                                            obj.height *= ratio;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div> : null}
                {this.state.activeStep === 1 ? <ActivityDrawer /> : null}
                {this.state.activeStep === 2 ? <WorkFlowSaver resetActiveStep={this.resetActiveStep} /> : null}
                <Snackbar open={this.state.error_snackbar} autoHideDuration={3000} onClose={this.handleCloseSnackBar}>
                    <Alert onClose={this.handleCloseSnackBar} severity="error">
                        {this.state.error_message}
                    </Alert>
                </Snackbar>
            </div>);
    }
}
function getSteps() {
    return ['Draw the flow', 'Set conditions to activities', 'Save the flow'];
}

const mapStateToProps = state => {
    return {
        nodes: state.drawer.nodes,
        connectors: state.drawer.connectors
    };
}

const mapDispatchToProps = dispatch => {
    return {
        diagramSettings: (nodes, connectors) => dispatch({ type: 'drawer_diagram', nodes: nodes, connectors: connectors }),
        resetDrawer: () => dispatch({ type: 'reset_drawer' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Kitdrawer);