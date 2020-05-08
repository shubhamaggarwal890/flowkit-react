import * as React from "react";
import { SymbolPaletteComponent, DiagramComponent, Node } from "@syncfusion/ej2-react-diagrams";
import { SampleBase } from './../Samplebase';
import './../../assets/kitdrawer.css';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import axios from 'axios';

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
class Kitmodifier extends SampleBase {
    state = {
        showTitle: false,
        message: null,
        title: '',
        confirmation: false,
        snackbar: false,
        error: false,
        diagramInstance: null,
    }

    handleOpenBackdrop = () => {
        this.setState({
            ...this.state,
            confirmation: true
        })
        return;
    }

    handleCloseSnackBar = () => {
        this.setState({
            ...this.state,
            snackbar: false,
            error: false
        })
        setTimeout(function () {
            this.props.clicked();
        }.bind(this, 2000))

    }


    handleShowTitle = () => {
        this.setState({
            ...this.state,
            showTitle: true
        })
        return;
    }

    handleCloseTitle = () => {
        this.setState({
            ...this.state,
            showTitle: false,
            title: ''
        })
        return;
    }

    changeTitleListener = (event) => {
        this.setState({
            ...this.state,
            title: event.target.value,
            message: null
        })
        return;

    }
    saveWorkFlow = (data) => {
        if (this.state.title === null || this.state.title.length === 0) {
            this.setState({
                ...this.state,
                message: "Title Required"
            })
            return;
        }
        let nodes_data = [];
        this.handleOpenBackdrop();
        this.state.diagramInstance.nodes.forEach(element => {
            let node_object = {
                activity_id: element.id,
                activity_title: element.annotations[0].content,
                activity_offsetX: element.offsetX,
                activity_offsetY: element.offsetY,
                activity_shape: element.shape.shape,
                activity_predecessor: null,
                activity_successor: null
            }
            this.state.diagramInstance.connectors.forEach(connector => {
                if (connector.sourceID === element.id) {
                    node_object.activity_successor = connector.targetID
                }
                if (connector.targetID === element.id) {
                    node_object.activity_predecessor = connector.sourceID
                }
            })
            nodes_data.push(node_object)
        });

        axios.post('/add_workflow', {
            workflow_title: this.state.title,
            workflow_creator: this.props.id,
            activity_data: nodes_data,
            deadline: 30
        }).then(response => {
            if (/Success:/.test(response.data)) {
                this.setState({
                    ...this.state,
                    snackbar: true,
                    showTitle: false,
                    confirmation: false,
                })
            }
            else {
                this.setState({
                    ...this.state,
                    error: true,
                    showTitle: false,
                    confirmation: false,
                })
            }
        }).catch(error => {
            this.setState({
                ...this.state,
                error: true,
                showTitle: false,
                confirmation: false,
            })
            return;
        })
        return;
    }
    render() {
        return (<div className="control-pane">
            <div className="control-section">
                <ButtonGroup color="primary" aria-label="outlined primary button group"
                    style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '10px' }}
                >
                    <Button startIcon={<CreateIcon />}
                        onClick={() => { this.state.diagramInstance.clear() }}>New</Button>
                    <Button startIcon={<SaveIcon />}
                        onClick={() => { this.handleShowTitle() }}>Save</Button>
                    <Button startIcon={<ExitToAppIcon />}
                        onClick={() => { this.props.clicked() }}>Exit</Button>
                </ButtonGroup>
                <Dialog open={this.state.showTitle}
                    aria-labelledby="form-dialog-title" style={{ zIndex: '200' }}>
                    <DialogTitle id="form-dialog-title">Save Workflow</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To save the modified workflow, please enter the title the workflow.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Title"
                            type="text"
                            fullWidth
                            required
                            helperText={this.state.message}
                            onChange={this.changeTitleListener}
                            value={this.state.title}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseTitle} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.saveWorkFlow} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                <Backdrop style={{ zIndex: '300', color: '#000' }} open={this.state.confirmation}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Snackbar open={this.state.snackbar} autoHideDuration={5000} onClose={this.handleCloseSnackBar}>
                    <Alert onClose={this.handleCloseSnackBar} severity="success">
                        Modified WorkFlow successfully stored. Redirecting to all workflows page.
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.error} autoHideDuration={5000} onClose={this.handleCloseSnackBar}>
                    <Alert onClose={this.handleCloseSnackBar} severity="error">
                        Oh No! Some error occurred please try selecting workflow again. 
                        Redirecting to all workflows page.
                    </Alert>
                </Snackbar>

                <div style={{ width: "100%", height: "80%" }}>
                    <div id="palette-space" className="sb-mobile-palette">
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
                    </div>

                    <div id="diagram-space" className="sb-mobile-diagram">
                        <DiagramComponent id="diagram" ref={diagram => (this.state.diagramInstance = diagram)}
                            width={"100%"} height={"645px"} nodes={this.props.nodes} snapSettings={{
                                horizontalGridlines: gridlines,
                                verticalGridlines: gridlines
                            }} connectors={this.props.connectors} getConnectorDefaults={(args, diagram) => {
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
            </div>
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        id: state.associate.id,
    };
}

export default connect(mapStateToProps)(Kitmodifier);