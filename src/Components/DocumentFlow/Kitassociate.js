import * as React from "react";
import PropTypes from 'prop-types';
import { DiagramComponent, NodeConstraints, ConnectorConstraints } from "@syncfusion/ej2-react-diagrams";
import { withStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import { SampleBase } from './../Samplebase';
import './../../assets/kitdrawer.css';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import SaveIcon from '@material-ui/icons/Save';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';
import { connect } from 'react-redux';
import Badge from '@material-ui/core/Badge';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

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

class kitassociate extends SampleBase {

    componentDidMount() {
        let diagramTempInstance = this.state.diagramInstance;
        for (let i = 0; i < diagramTempInstance.nodes.length; i++) {
            diagramTempInstance.nodes[i].constraints &= ~(NodeConstraints.Resize | NodeConstraints.Rotate | NodeConstraints.Drag);
            diagramTempInstance.nodes[i].constraints &= ~(NodeConstraints.Delete);
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

    state = {
        showTitle: false,
        snackbar: false,
        activity: false,
        title: '',
        wf_desc: '',
        auto: false,
        role: null,
        individual: null,
        other: null,
        any_all: null,
        description: null,
        message_title: null,
        end_email: '',
        message_end_email: null,
        activity_title: '',
        message_activity_title: null,
        message_remark: null,
        message_associate: null,
        remark: '',
        associate: '',
        document: null,
        activity_id: null,
        diagramInstance: null,
        progress: false,
        message: null,
        error_snackbar: false,
        error_message: false,
        manager: null,
        same_as_initiator: false,
        document_id: null
    }

    handleActivityTitleOpen = (activity_args) => {
        if (activity_args.actualObject && activity_args.actualObject.propName === 'nodes') {
            this.state.diagramInstance.nodes.forEach(element => {
                if (element.id === activity_args.actualObject.properties.id) {
                    this.setState({
                        ...this.state,
                        activity: true,
                        activity_title: element.annotations[0].content,
                        description: element.description,
                        role: element.role,
                        individual: element.individual,
                        manager: element.manager,
                        other: element.other,
                        any_all: element.any_all,
                        auto: element.auto,
                        associate: element.associate ? element.associate : '',
                        activity_id: element.id,
                        document: element.document ? element.document : null,
                        remark: element.remark ? element.remark : '',
                        message_activity_title: null,
                        message_remark: null,
                        message_associate: null,
                        document_id: element.document_id ? element.document_id : null
                    })
                }
            });
        }
    }

    handleActivityCloseTitle = () => {
        this.setState({
            ...this.state,
            activity: false,
        })
    }

    handleWorkflowTitleOpen = () => {
        let diagramTempInstance = this.state.diagramInstance;
        for (let i = 0; i < diagramTempInstance.nodes.length; i++) {
            if (!diagramTempInstance.nodes[i].validated) {
                this.setState({
                    ...this.state,
                    error_snackbar: true,
                    error_message: "Kindly document all the activities in the workflow."
                })
                return;
            }
        }
        this.setState({
            ...this.state,
            showTitle: true,
        })
    }

    handleWorkflowTitleClose = () => {
        this.setState({
            ...this.state,
            showTitle: false,
            title: '',
            wf_desc: '',
            end_email: '',
        })
    }

    changeWorkflowTitleListener = (event) => {
        this.setState({
            ...this.state,
            title: event.target.value,
            message_title: null
        })
    }

    changeWorkflowEmailListener = (event) => {
        this.setState({
            ...this.state,
            end_email: event.target.value,
            message_end_email: null
        })
    }

    changeActivityTitleListener = (event) => {
        this.setState({
            ...this.state,
            activity_title: event.target.value,
            message_activity_title: null
        })
    }

    changeActivityRemarkListener = (event) => {
        this.setState({
            ...this.state,
            remark: event.target.value,
            message_remark: null
        })

    }

    changeActivityAssociateListener = (event) => {
        this.setState({
            ...this.state,
            associate: event.target.value,
            message_associate: null
        })
    }

    changeActivityDocumentListener = (event) => {
        this.setState({
            ...this.state,
            document: event.target.files[0],
            document_id: null
        })
    }

    changeWorkflowDescListener = (event) => {
        this.setState({
            ...this.state,
            wf_desc: event.target.value,
        })
    }

    changeWorkflowEmailToggle = () => {
        this.setState({
            ...this.state,
            same_as_initiator: !this.state.same_as_initiator
        })
    }

    uploadDocumentActivity = () => {
        if (this.state.document !== null) {
            this.setState({
                ...this.state,
                progress: true
            })
            const formData = new FormData();
            formData.append('file', this.state.document);
            formData.append('uploader', this.props.id);
            axios.post('/upload_document', formData).then(response => {
                if (response.data) {
                    this.setState({
                        ...this.state,
                        document_id: response.data.id,
                        progress: false
                    })
                    this.savingDiagramInstance();
                } else {
                    this.setState({
                        ...this.state,
                        error_snackbar: true,
                        error_message: "Oh No, We failed uploading your document, Kindly try again!",
                        progress: false
                    })
                }
            }).catch(error => {
                console.log("Error", error);
                this.setState({
                    ...this.state,
                    error_snackbar: true,
                    error_message: "Oh No, We failed uploading your document, Kindly try again!",
                    progress: false
                })
            })

        }
    }

    verifyEmailAddressAssociate = () => {

        this.setState({
            ...this.state,
            progress: true
        })
        axios.post('/verify_email', {
            emailId: this.state.associate
        }).then(response => {
            if (/Success:/.test(response.data)) {
                this.savingDiagramInstance();
                this.setState({
                    ...this.state,
                    progress: false,
                })
            } else {
                this.setState({
                    ...this.state,
                    message_associate: "Oh, We couldn't find this email address registered with us",
                    progress: false
                })
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                ...this.state,
                message_associate: "Oh No, You were not supposed to see this. Please try again.",
                progress: false
            })
        })
    }

    saveWorkflowAndActivities = () => {
        let activities = [];
        this.state.diagramInstance.nodes.forEach(element => {
            let activity = {
                id: element.id,
                title: element.annotations[0].content,
                remark: element.remark,
                associate: element.associate !== null && element.associate.length !== 0 ? element.associate : null,
                predecessor: null,
                successor: null,
                document: {
                    id: element.document_id,
                }
            }
            this.state.diagramInstance.connectors.forEach(connector => {
                if (connector.sourceID === element.id) {
                    activity.successor = connector.targetID
                }
                if (connector.targetID === element.id) {
                    activity.predecessor = connector.sourceID
                }
            })
            activities.push(activity)
        });

        axios.post('/add_workflow_instance', {
            id: this.props.workflow_id,
            title: this.state.title,
            description: this.state.wf_desc,
            creator: this.props.id,
            customer: this.state.same_as_initiator ? null : this.state.end_email,
            activities: activities

        }).then(response => {
            if (/Success:/.test(response.data)) {
                this.setState({
                    ...this.state,
                    title_snackbar: true,
                    showTitle: false,
                    progress: false,
                    message: "Workflow documented successfully. Redirecting to all workflows page."
                })
            }
            else {
                this.setState({
                    ...this.state,
                    error_snackbar: true,
                    showTitle: false,
                    progress: false,
                    error_message: "Oh No, Seems like some issue occurred, Please try again."
                })
            }
        }).catch(error => {
            this.setState({
                ...this.state,
                error_snackbar: true,
                showTitle: false,
                progress: false,
                error_message: "Oh No, Seems like some issue occurred, Please try again."
            })
            return;
        })
    }

    saveWorkFlow = () => {
        if (this.state.title === null || this.state.title.length === 0) {
            this.setState({
                ...this.state,
                message_title: "Title Required"
            })
            return;
        }
        this.setState({
            ...this.state,
            progress: true
        })

        if (!this.state.same_as_initiator) {
            if ((this.state.end_email === null || this.state.end_email.length === 0)) {
                this.setState({
                    ...this.state,
                    message_end_email: "End user email address required"
                })
                return;
            }
            if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.end_email)) {
                this.setState({
                    ...this.state,
                    message_end_email: "Doesn't look like an email address to us!"
                })
                return;
            }

            axios.post('/verify_email', {
                emailId: this.state.end_email
            }).then(response => {
                if (/Success:/.test(response.data)) {
                    this.saveWorkflowAndActivities()
                } else {
                    this.setState({
                        ...this.state,
                        message_end_email: "Oh, We couldn't find this email address registered with us",
                        progress: false
                    })
                }
            }).catch(error => {
                console.log(error);
                this.setState({
                    ...this.state,
                    message_end_email: "Oh No, You were not supposed to see this. Please try again.",
                    progress: false
                })
            })
        } else {
            this.saveWorkflowAndActivities()
        }
    }

    handleCloseSnackBar = () => {
        this.setState({
            ...this.state,
            snackbar: false,
            error_snackbar: false
        })
    }

    handleCloseTitleSnackBar = () => {
        this.setState({
            ...this.state,
            title_snackbar: false,
        })
        this.props.exitButton();
    }


    viewUploadedFile = () => {
        this.setState({
            ...this.state,
            progress: true
        })
        if (this.state.document_id !== null) {
            axios.post('/get_document', {
                id: this.state.document_id
            }, { responseType: 'arraybuffer' }).then(response => {
                if (response.data) {
                    const file = new Blob([response.data], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL, "_blank");
                } else {

                }
            }).catch(error => {
                console.log("Error", error);
            })
            this.setState({
                ...this.state,
                progress: false
            })
        }
    }

    savingDiagramInstance = () => {
        let diagramTempInstance = this.state.diagramInstance;
        for (let i = 0; i < diagramTempInstance.nodes.length; i++) {
            if (diagramTempInstance.nodes[i].id === this.state.activity_id) {
                diagramTempInstance.nodes[i].annotations[0].content = this.state.activity_title
                diagramTempInstance.nodes[i].associate = this.state.associate
                diagramTempInstance.nodes[i].document = this.state.document
                diagramTempInstance.nodes[i].remark = this.state.remark
                diagramTempInstance.nodes[i].validated = true
                diagramTempInstance.nodes[i].document_id = this.state.document_id
                diagramTempInstance.nodes[i].style.fill = "#DCDCDC";
            }
        }
        this.setState({
            ...this.state,
            diagramInstance: diagramTempInstance,
            activity: false,
            snackbar: true,
            message: "Activity \"" + this.state.activity_title + "\" documented successfully."
        })
    }

    saveActivityListener = () => {
        if (this.state.activity_title === null || this.state.activity_title.length === 0) {
            this.setState({
                ...this.state,
                message_activity_title: "Activity title required"
            })
            return;
        }
        if (this.state.remark === null || this.state.remark.length === 0) {
            this.setState({
                ...this.state,
                message_remark: "Activity remark required"
            })
            return;
        }

        //!this.state.auto && this.state.role === null && this.state.individual === null && this.state.other === null

        //this.state.individual !== null && /Manager/.test(this.state.individual.name) && this.state.manager === null

        if (this.state.associate === null || this.state.associate.length === 0) {
            if (!this.state.auto && this.state.role == null && this.state.individual == null && this.state.other == null) {
                this.setState({
                    ...this.state,
                    message_associate: "Activity associate required"
                })
                return;
            }
            if (this.state.individual !== null && /Manager/.test(this.state.individual.name) && this.state.manager === null) {
                this.setState({
                    ...this.state,
                    message_associate: "Activity associate required"
                })
                return;
            }
            if (this.state.document) {
                this.uploadDocumentActivity();
            } else {
                this.savingDiagramInstance();
            }

        } else {
            if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.associate)) {
                this.setState({
                    ...this.state,
                    message_associate: "Doesn't look like an email address to us!"
                })
                return;
            } else {
                this.verifyEmailAddressAssociate();
            }
        }
    }

    render() {
        return (<div className="control-pane">
            <div className="control-section">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <ButtonGroup color="primary" aria-label="outlined primary button group"
                            style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '10px' }}>
                            <Button startIcon={<SaveIcon />}
                                onClick={this.handleWorkflowTitleOpen}>Save</Button>
                            <Button startIcon={<ExitToAppIcon />} onClick={this.props.exitButton}>Exit</Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <h3>{this.props.workflow_title}</h3>
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
                                this.handleActivityTitleOpen(args);
                            }}
                        />
                    </div>
                </div>

                <Dialog open={this.state.activity}
                    aria-labelledby="form-dialog-activity" style={{ zIndex: '200' }}>
                    <DialogTitle id="form-dialog-activity">Add Activity Details</DialogTitle>
                    <DialogContent>
                        {
                            this.state.description ?
                                <DialogContentText>
                                    {this.state.description}
                                </DialogContentText> : null
                        }
                        {
                            this.state.role !== null ?
                                <DialogContentText>A request would be sent to {this.state.role.name} and request has to be accepted by {this.state.any_all ? "all" : "any one"} of them
                            </DialogContentText> : null
                        }

                        {
                            this.state.individual !== null && /Manager/.test(this.state.individual.name) && this.state.manager === null ?
                                <DialogContentText>
                                    Oh couldn't find a manager for you in the database, kindly send request to custom associate
                                </DialogContentText> : null
                        }

                        {
                            this.state.individual !== null && /Manager/.test(this.state.individual.name) && this.state.manager !== null ?
                                <DialogContentText>
                                    A request would be sent to your {this.state.individual.name} {this.state.manager.name}, at email address {this.state.manager.email}
                                </DialogContentText> : null
                        }

                        {
                            this.state.individual !== null && !/Manager/.test(this.state.individual.name) ?
                                <DialogContentText>
                                    A request would be sent to {this.state.individual.name} {this.state.individual.individual.name}, at email address {this.state.individual.individual.email}
                                </DialogContentText> : null
                        }

                        {
                            this.state.other ?
                                <DialogContentText>A request would be sent to {this.state.other.name} at email address {this.state.other.email}
                                </DialogContentText> : null
                        }

                        {
                            !this.state.auto && this.state.role === null && this.state.individual === null && this.state.other === null ?
                                <DialogContentText>A request would be sent to your entered associate email address, kindly add email address based on description of the activity.
                                </DialogContentText> : null
                        }

                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Title"
                            type="text"
                            fullWidth
                            required
                            helperText={this.state.message_activity_title}
                            onChange={this.changeActivityTitleListener}
                            value={this.state.activity_title}
                        />

                        <TextField
                            margin="dense"
                            id="name"
                            label="Remark"
                            type="text"
                            fullWidth
                            required
                            helperText={this.state.message_remark}
                            onChange={this.changeActivityRemarkListener}
                            value={this.state.remark}
                        />
                        <Grid container spacing={1} alignItems="flex-end" style={{ paddingTop: "10px" }}>
                            {
                                (!this.state.auto && this.state.role === null && this.state.individual === null && this.state.other === null) ?
                                    <>
                                        <Grid item>
                                            <AccountCircle />
                                        </Grid>
                                        <Grid item>
                                            <TextField id="input-with-icon-grid" label="Add Associate"
                                                onChange={this.changeActivityAssociateListener}
                                                helperText={this.state.message_associate}
                                                required value={this.state.associate} />
                                        </Grid></> : null
                            }

                            {
                                (this.state.individual !== null && /Manager/.test(this.state.individual.name) && this.state.manager === null) ?
                                    <>
                                        <Grid item>
                                            <AccountCircle />
                                        </Grid>
                                        <Grid item>
                                            <TextField id="input-with-icon-grid" label="Add Associate"
                                                onChange={this.changeActivityAssociateListener}
                                                helperText={this.state.message_associate}
                                                required value={this.state.associate} />
                                        </Grid></> : null
                            }
                            <>
                                <Grid item>
                                    <CloudUploadIcon />
                                </Grid>
                                <Grid item>
                                    <label htmlFor="file-upload"
                                        style={{
                                            border: "1px solid #ccc", display: "inline-block", padding: "6px 12px",
                                            cursor: "pointer"
                                        }}>{this.state.document ? this.state.document.name : "Upload document"}</label>
                                    <input type='file' style={{ display: "none" }} id="file-upload" accept="application/pdf"
                                        onChange={this.changeActivityDocumentListener} />
                                </Grid>
                            </>
                        </Grid>
                        {this.state.document_id ?
                            <Grid container spacing={1} alignItems="flex-end" style={{ paddingTop: "10px" }}>
                                <Grid item>
                                    <Badge badgeContent={1} color="primary">
                                        <CloudDownloadIcon />
                                    </Badge>
                                </Grid>
                                <Grid item>
                                    <Button color="primary" onClick={this.viewUploadedFile}>View Uploaded File</Button>
                                </Grid>

                            </Grid> : null}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleActivityCloseTitle} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.saveActivityListener} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.showTitle}
                    aria-labelledby="form-dialog-title" style={{ zIndex: '200' }}>
                    <DialogTitle id="form-dialog-title">Initiate the Workflow</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To Initiate the workflow, please enter the title.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Title"
                            type="text"
                            fullWidth
                            required
                            helperText={this.state.message_title}
                            onChange={this.changeWorkflowTitleListener}
                            value={this.state.title}
                        />
                        <TextField
                            id="desc"
                            label="Workflow Description"
                            fullWidth
                            multiline
                            onChange={this.changeWorkflowDescListener}
                            value={this.state.wf_desc}
                        />
                        {!this.state.same_as_initiator ?
                            <TextField
                                margin="dense"
                                id="end_email"
                                label="End user Email Address"
                                type="text"
                                fullWidth
                                required
                                helperText={this.state.message_end_email}
                                onChange={this.changeWorkflowEmailListener}
                                value={this.state.end_email}
                            /> : null}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.same_as_initiator}
                                    onChange={this.changeWorkflowEmailToggle}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Email Address same as initiator"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleWorkflowTitleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.saveWorkFlow} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                <Backdrop style={{ zIndex: '300', color: '#000' }} open={this.state.progress}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Snackbar open={this.state.snackbar} autoHideDuration={3000} onClose={this.handleCloseSnackBar}>
                    <Alert onClose={this.handleCloseSnackBar} severity="success">
                        {this.state.message}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.error_snackbar} autoHideDuration={3000} onClose={this.handleCloseSnackBar}>
                    <Alert onClose={this.handleCloseSnackBar} severity="error">
                        {this.state.error_message}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.title_snackbar} autoHideDuration={4000} onClose={this.handleCloseTitleSnackBar}>
                    <Alert onClose={this.handleCloseTitleSnackBar} severity="success">
                        {this.state.message}
                    </Alert>
                </Snackbar>

            </div>
        </div >);
    }
}

kitassociate.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        id: state.associate.id,
    };
}

export default connect(mapStateToProps)(withStyles(styles)(kitassociate));
