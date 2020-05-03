import * as React from "react";
import PropTypes from 'prop-types';
import { DiagramComponent } from "@syncfusion/ej2-react-diagrams";
import { withStyles } from '@material-ui/core/styles';
import { SampleBase } from './../Samplebase';
import './../../assets/kitdrawer.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Link from '@material-ui/core/Link';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
//Initializes the connector for the diagram
let connectors = [
    {
        id: "connector1",
        sourceID: "Start",
        targetID: "Alarm"
    },
    { id: "connector2", sourceID: "Alarm", targetID: "Ready" },
    {
        id: "connector3",
        sourceID: "Ready",
        targetID: "Climb",
    },
    { id: "connector4", sourceID: "Climb", targetID: "End" },
];


const styles = (theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),

    }
});

class KitConditional extends SampleBase {

    state = {
        activity_id: null,
        pendingOpen: false,
        approvedOpen: false,
        diagramInstance: null,
        actionSelection: 'approve',
        message: null,
        remark: '',
        activityRemark: null,
        approverRemark: null,
        activityDocument: null,
        nodes: [
            {
                id: "Start",
                height: 50,
                width: 100,
                offsetX: 250,
                offsetY: 60,
                shape: { type: "Flow", shape: "Terminator" },
                annotations: [
                    {
                        content: "Start"
                    }
                ],
                style: { fill: "#A2D8B0" }
            },
            {
                id: "Alarm",
                height: 50,
                width: 100,
                offsetX: 250,
                offsetY: 160,
                shape: { type: "Flow", shape: "Process" },
                annotations: [
                    {
                        content: "Alarm Rings"
                    }
                ],
                style: { fill: "#A2D8B0" }
            },
            {
                id: "Ready",
                height: 80,
                width: 100,
                offsetX: 250,
                offsetY: 260,
                shape: { type: "Flow", shape: "Decision" },
                annotations: [
                    {
                        content: "Ready to Get Up?"
                    }
                ],
                style: { fill: "#FFB2B2" }
            },
            {
                id: "Climb",
                height: 50,
                width: 100,
                offsetX: 250,
                offsetY: 370,
                shape: { type: "Flow", shape: "Process" },
                annotations: [
                    {
                        content: "Climb Out of Bed"
                    }
                ],
                style: { fill: "#DCDCDC" }
            },
            {
                id: "End",
                height: 50,
                width: 100,
                offsetX: 250,
                offsetY: 460,
                shape: { type: "Flow", shape: "Terminator" },
                annotations: [
                    {
                        content: "End"
                    }
                ],
                style: { fill: "#DCDCDC" }
            }
        ]
    }


    handleActivityOpen = (activity_args) => {
        if (activity_args.actualObject && activity_args.actualObject.propName === 'nodes') {
            const id = activity_args.actualObject.properties.id;
            let status = "\""+activity_args.actualObject.properties.annotations[0].properties.content+"\"";
            let diagramTempInstance = this.state.diagramInstance;
            for (let i = 0; i < diagramTempInstance.nodes.length; i++) {
                if (diagramTempInstance.nodes[i].id === id) {
                    if (diagramTempInstance.nodes[i].style.fill === "#DCDCDC") {
                        status += " is pending for approval/rejection from " + diagramTempInstance.nodes[i].associate;
                        this.setState({
                            ...this.state,
                            pendingOpen: true,
                            activity_id: id
                        })
                    } else if (diagramTempInstance.nodes[i].style.fill === "#A2D8B0") {
                        status += " is approved by " + diagramTempInstance.nodes[i].associate;
                        console.log(status);
                        this.setState({
                            ...this.state,
                            approvedOpen: true,
                            message: status,
                            approverRemark: diagramTempInstance.nodes[i].approverRemark,
                            activityRemark: diagramTempInstance.nodes[i].remark ? diagramTempInstance.nodes[i].remark : null,
                            activityDocument: diagramTempInstance.nodes[i].document ? diagramTempInstance.nodes[i].document : null
                        })
                    } else if (diagramTempInstance.nodes[i].style.fill === "#FFB2B2") {
                        status += " is rejected by " + diagramTempInstance.nodes[i].associate;
                        console.log(status);
                        this.setState({
                            ...this.state,
                            approvedOpen: true,
                            message: status,
                            approverRemark: diagramTempInstance.nodes[i].approverRemark,
                            activityRemark: diagramTempInstance.nodes[i].remark ? diagramTempInstance.nodes[i].remark : null,
                            activityDocument: diagramTempInstance.nodes[i].document ? diagramTempInstance.nodes[i].document : null
                        })
                    }
                }
            }
        }
    };

    changeActionSelection = (event) => {
        this.setState({
            ...this.state,
            actionSelection: event.target.value,
        })
    }
    changeActivityRemarkListener = (event) => {
        this.setState({
            ...this.state,
            remark: event.target.value,
        })
    };


    handleActivityClose = () => {
        this.setState({
            ...this.state,
            pendingOpen: false,
            approvedOpen: false
        })
    };

    handleCloseSnackBar = () => {
        this.setState({
            ...this.state,
            snackbar: false
        })
    }


    saveActivityListener = () => {
        let diagramTempInstance = this.state.diagramInstance;
        for (let i = 0; i < diagramTempInstance.nodes.length; i++) {
            if (diagramTempInstance.nodes[i].id === this.state.activity_id) {
                if (this.state.actionSelection === "approve") {
                    diagramTempInstance.nodes[i].style.fill = "#A2D8B0";

                } else if (this.state.actionSelection === "reject") {
                    diagramTempInstance.nodes[i].style.fill = "#FFB2B2";
                }
                this.state.remark || this.state.remark.length ? diagramTempInstance.nodes[i].approverRemark = this.state.remark :
                    diagramTempInstance.nodes[i].approverRemark = null
            }
        }
        this.setState({
            ...this.state,
            diagramInstance: diagramTempInstance,
            snackbar: true,
            pendingOpen: false,
            actionSelection: 'approve',
            remark: ''
        })
    };



    nullifyCommands() {
        let commandManager = {
            commands: [
                {
                    name: "delete",
                    canExecute: () => {
                        return false;
                    },
                },
                {
                    name: "selectAll",
                    canExecute: () => {
                        return false;
                    }
                },
                {
                    name: "cut",
                    canExecute: () => {
                        return false;
                    }
                },
                {
                    name: "copy",
                    canExecute: () => {
                        return false;
                    }
                },
                {
                    name: "paste",
                    canExecute: () => {
                        return false;
                    }
                },
                {
                    name: "undo",
                    canExecute: () => {
                        return false;
                    }
                },
                {
                    name: "redo",
                    canExecute: () => {
                        return false;
                    }
                }
            ]
        };
        return commandManager;
    }
    render() {
        // const { classes } = this.props;
        return (<div className="control-pane">
            <div className="col-lg-8 control-section">
                <Button variant="outlined" color="primary"
                    style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '10px' }}
                    onClick={this.props.clicked} startIcon={<ExitToAppIcon />}>
                    Exit
                </Button>
                <div style={{ width: "100%", height: "80%" }}>
                    <div id="diagram-space" className="sb-mobile-diagram">
                        <DiagramComponent id="diagram" ref={diagram => (this.state.diagramInstance = diagram)}
                            width={"130%"} height={"645px"} nodes={this.state.nodes} connectors={connectors}
                            getConnectorDefaults={(args, diagram) => {
                                args.targetDecorator.height = 5;
                                args.targetDecorator.width = 5;
                                args.style.strokeColor = "#797979";
                                args.targetDecorator.style = {
                                    fill: "#797979",
                                    strokeColor: "#797979"
                                };
                                return args;
                            }}
                            click={(args) => {
                                this.handleActivityOpen(args);

                            }}
                            commandManager={this.nullifyCommands()} />
                    </div>
                </div>

            </div>
            <div className="col-lg-4 property-section">
                <div>
                    <h4 className="property-panel-header">Color Commands</h4>
                    <div className="property-panel-content">
                        <table id="property1" style={{ fontSize: "12px" }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: "50%" }}><Brightness1Icon fontSize='large'
                                        style={{ color: '#DCDCDC' }} /> </td>
                                    <td style={{ width: "50%" }}>Pending Action</td>
                                </tr>
                                <tr>
                                    <td style={{ width: "50%" }}><Brightness1Icon fontSize='large'
                                        style={{ color: '#A2D8B0' }} /> </td>
                                    <td style={{ width: "50%" }}>Approved</td>
                                </tr>
                                <tr>
                                    <td style={{ width: "50%" }}><Brightness1Icon fontSize='large'
                                        style={{ color: '#FFB2B2' }} /> </td>
                                    <td style={{ width: "50%" }}>Rejected</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Dialog open={this.state.pendingOpen}
                aria-labelledby="form-dialog-activity" style={{ zIndex: '200' }}>
                <DialogTitle id="form-dialog-activity">WorkFlow activity status</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select to approve/reject the activity in the flow. Also add a suitable remark.
                        </DialogContentText>
                    <FormLabel component="legend">Status Selection</FormLabel>
                    <RadioGroup aria-label="status" name="select status" value={this.state.actionSelection}
                        onChange={this.changeActionSelection}>
                        <FormControlLabel value="approve" control={<Radio />} label="Approve" />
                        <FormControlLabel value="reject" control={<Radio />} label="Reject" />
                    </RadioGroup>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Remark"
                        type="text"
                        fullWidth
                        onChange={this.changeActivityRemarkListener}
                        value={this.state.remark}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleActivityClose} color="primary">
                        Cancel
                        </Button>
                    <Button onClick={this.saveActivityListener} color="primary">
                        Save
                        </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={this.state.approvedOpen} fullWidth={true} maxWidth="sm" scroll="paper"
                aria-labelledby="form-dialog-activity" style={{ zIndex: '200' }}>
                <DialogTitle id="form-dialog-activity">WorkFlow activity status</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText>
                        {this.state.message}
                    </DialogContentText>
                    <DialogContentText>
                        Initiator Remark - {this.state.activityRemark}
                    </DialogContentText>
                    {this.state.approverRemark ? <DialogContentText>Approver Remark - {this.state.approverRemark}</DialogContentText> : null}
                    {this.state.activityDocument ?
                        <DialogContentText>
                            <Link component="button" variant="body2" onClick={() => {
                                window.open("./xyz.pdf", "_blank")
                            }}>Document Link</Link>
                        </DialogContentText> : null}
                </DialogContent >
                <DialogActions>
                    <Button onClick={this.handleActivityClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog >

            <Snackbar open={this.state.snackbar} autoHideDuration={5000} onClose={this.handleCloseSnackBar}>
                <Alert onClose={this.handleCloseSnackBar} severity="success">
                    Activity in WorkFlow updated successfully!
                    </Alert>
            </Snackbar>


        </div >);
    }
}

KitConditional.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(KitConditional);
