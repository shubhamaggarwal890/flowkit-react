import * as React from "react";
import PropTypes from 'prop-types';
import { DiagramComponent, NodeConstraints, ConnectorConstraints } from "@syncfusion/ej2-react-diagrams";
import { withStyles } from '@material-ui/core/styles';
import { SampleBase } from './../Samplebase';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import Backdrop from '@material-ui/core/Backdrop';
import './../../assets/kitdrawer.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import { connect } from 'react-redux';
import Badge from '@material-ui/core/Badge';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


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

    componentDidMount() {
        let diagramTempInstance = this.state.diagramInstance;
        for (let i = 0; i < diagramTempInstance.nodes.length; i++) {
            diagramTempInstance.nodes[i].constraints &= ~(NodeConstraints.Resize | NodeConstraints.Rotate | NodeConstraints.Drag);
            diagramTempInstance.nodes[i].constraints &= ~(NodeConstraints.Delete);
            diagramTempInstance.nodes[i].constraints |= NodeConstraints.ReadOnly;
            if (diagramTempInstance.nodes[i].status === "PENDING") {
                diagramTempInstance.nodes[i].style.fill = "#DCDCDC"
            } else if (diagramTempInstance.nodes[i].status === "ACCEPT") {
                diagramTempInstance.nodes[i].style.fill = "#A2D8B0"
            } else if (diagramTempInstance.nodes[i].status === "REJECT") {
                diagramTempInstance.nodes[i].style.fill = "#FFB2B2"
            }
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


    state = {
        activity: false,
        title: '',
        description: null,
        document: null,
        status: '',
        auto: false,
        any_all: false,
        associate: null,
        snackbar: false,
        message: null,
        diagramInstance: null,
        progress: false,
        choice: "ACCEPT",
        remark: '',
        activity_id: null,
        success_snackbar: false,
    }

    viewUploadedFile = () => {
        this.setState({
            ...this.state,
            progress: true
        })
        if (this.state.document !== null) {
            axios.post('/get_document', {
                id: this.state.document
            }, { responseType: 'arraybuffer' }).then(response => {
                if (response.data) {
                    const file = new Blob([response.data], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL, "_blank");
                } else {

                }
            }).catch(error => {
                console.log("Error", error);
                this.setState({
                    ...this.state,
                    message: "Oh No, Document couldn't be loaded, Some error occurred. Please try again.",
                    snackbar: true
                })
            })
            this.setState({
                ...this.state,
                progress: false
            })
        }
    }

    handleCloseSnackBar = () => {
        this.setState({
            ...this.state,
            snackbar: false,
            message: null
        })
    }

    handleSuccessSnackBar = () => {
        this.setState({
            ...this.state,
            success_snackbar: false,
            message: null
        })
        this.props.exitButton();
    }


    addRemarkHandler = (event) => {
        this.setState({
            ...this.state,
            remark: event.target.value
        })
    }



    handleActivityStatusOpen = (activity_args) => {
        if (activity_args.actualObject && activity_args.actualObject.propName === 'nodes') {
            this.state.diagramInstance.nodes.forEach(element => {
                if (element.id === activity_args.actualObject.properties.id) {
                    this.setState({
                        ...this.state,
                        activity: true,
                        activity_id: element.id,
                        title: element.annotations[0].content,
                        description: element.description,
                        document: element.document !== null ? element.document : null,
                        status: element.status,
                        auto: element.auto,
                        any_all: element.any_all,
                        snackbar: false,
                        message: null
                    })
                }
            });
        }
    }

    choiceChangeHandler = (event) => {
        this.setState({
            ...this.state,
            choice: event.target.value,
        })
    }

    handleActivityStatusClose = () => {
        this.setState({
            ...this.state,
            activity: false,
            message: null,
        })
    }

    handleActivitySave = () => {
        this.setState({
            ...this.state,
            progress: true
        })
        axios.post('/save_associate_response', {
            workflow: this.props.workflow_id,
            activity_instance: this.state.activity_id,
            associate: this.props.id,
            status: this.state.choice,
            any_all: this.state.any_all,
            remark: this.state.remark
        }).then(response => {
            if (response.data) {
                this.setState({
                    ...this.state,
                    message: "Your response saved successfully. Redirecting to inbox.",
                    success_snackbar: true,
                    progress: false
                })
    
            } else {
                this.setState({
                    ...this.state,
                    message: "Oh No, Your reponse couldn't be saved. Please try again.",
                    snackbar: true,
                    progress: false
                })

            }
        }).catch(error => {
            console.log("Error", error);
            this.setState({
                ...this.state,
                message: "Oh No, Your reponse couldn't be saved. Please try again.",
                snackbar: true,
                progress: false
            })
        })

    }

    render() {
        return (
            <div className="control-pane">
                <div className="col-lg-8 control-section">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <ButtonGroup color="primary" aria-label="outlined primary button group"
                                style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '10px' }}>
                                <Button startIcon={<ExitToAppIcon />} onClick={this.props.exitButton}>Exit</Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <h3>{this.props.title}</h3>
                        </Grid>
                    </Grid>

                    <div style={{ width: "100%", height: "80%" }}>
                        <div id="diagram-space" className="sb-mobile-diagram">
                            <DiagramComponent id="diagram" ref={diagram => (this.state.diagramInstance = diagram)} width={"130%"}
                                height={"645px"} nodes={this.props.nodes} connectors={this.props.connectors}
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
                                    this.handleActivityStatusOpen(args);
                                }}
                            />
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
                                        <td style={{ width: "50%" }}>Pending</td>
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

                <Dialog open={this.state.activity}
                    aria-labelledby="form-dialog-activity" style={{ zIndex: '200' }}>
                    <DialogTitle id="form-dialog-activity">Activity - {this.state.title} - {
                        this.state.status !== "PENDING" ? <>{this.state.status}ED</> : this.state.status}</DialogTitle>
                    <DialogContent>
                        {
                            this.state.description ?
                                <DialogContentText>
                                    {this.state.description}
                                </DialogContentText> : null
                        }

                        {
                            this.state.document !== null ?
                                <Grid container spacing={1} alignItems="flex-end" style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                                    <Grid item>
                                        <Badge badgeContent={1} color="primary">
                                            <CloudDownloadIcon />
                                        </Badge>
                                    </Grid>
                                    <Grid item>
                                        <Button color="primary" onClick={this.viewUploadedFile}>View Uploaded File</Button>
                                    </Grid>

                                </Grid> : null
                        }

                        {this.state.status === "PENDING" ?
                            <Grid item xs={12} style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Your choice for the activity</FormLabel>
                                    <RadioGroup value={this.state.choice} onChange={this.choiceChangeHandler} row>
                                        <FormControlLabel value="ACCEPT" control={<Radio />} label="Accept" labelPlacement="start" />
                                        <FormControlLabel value="REJECT" control={<Radio />} label="Reject" labelPlacement="start" />
                                    </RadioGroup>
                                </FormControl>

                                <TextField
                                    id="desc"
                                    label="Remark"
                                    fullWidth
                                    multiline
                                    onChange={this.addRemarkHandler}
                                    value={this.state.remark}
                                />

                            </Grid> : null
                        }

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleActivityStatusClose} color="primary">
                            Close
                    </Button>
                        {this.state.status === "PENDING" ?
                            <Button onClick={this.handleActivitySave} color="primary">
                                Save
                        </Button> : null
                        }
                    </DialogActions>
                </Dialog>

                <Backdrop style={{ zIndex: '300', color: '#000' }} open={this.state.progress}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Snackbar open={this.state.snackbar} autoHideDuration={3000} onClose={this.handleCloseSnackBar}>
                    <Alert onClose={this.handleCloseSnackBar} severity="error">
                        {this.state.message}
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.success_snackbar} autoHideDuration={4000} onClose={this.handleSuccessSnackBar}>
                    <Alert onClose={this.handleSuccessSnackBar} severity="success">
                        {this.state.message}
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}


KitConditional.propTypes = {
    classes: PropTypes.object.isRequired,
};


const mapStateToProps = state => {
    return {
        id: state.associate.id,
    };
}

export default connect(mapStateToProps)(withStyles(styles)(KitConditional));
