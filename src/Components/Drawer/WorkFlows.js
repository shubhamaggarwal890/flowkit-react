import React, { Component } from 'react';
import Kitmodifier from './Kitmodifier';
import WorkFlowCard from './WorkFlowCard';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class WorkFlows extends Component {

    state = {
        showFlow: true,
        workflow_data: null,
        waiting: false,
        message: "Fetching workflows from server, Please wait!",
        nodes: null,
        connectors: null,
        error: false,
        error_message: null,
        delete_success: false
    }

    fetch_workflows = () => {
        axios.get('/get_workflows').then(response => {
            if (response.data) {
                this.setState({
                    ...this.state,
                    workflow_data: response.data,
                    waiting: false,
                })
            } else {
                this.setState({
                    ...this.state,
                    message: "No workflow found, Kindly create a workflow.",
                    waiting: false
                })
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                ...this.state,
                message: "Oh No, You were not supposed to see this. Please try again.",
                waiting: false
            })
        })
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            waiting: true
        })
        this.fetch_workflows();
    }

    handleCloseSnackBar = () => {
        this.setState({
            ...this.state,
            error: false
        })
    }

    handleCloseSnackBarDeleteSuccess = () => {
        this.setState({
            ...this.state,
            delete_success: false
        })
    }

    checkWorkFlowStatus = (flow_id) => {
        this.setState({
            ...this.state,
            waiting: true
        })
        axios.post('/get_workflow_activity', {
            id: flow_id
        }).then(response => {
            if (response.data) {
                let nodes_data = [];
                let connector_data = [];
                let connector_count = 1;
                response.data.forEach(element => {
                    nodes_data.push({
                        id: element.activity_id,
                        height: 50,
                        width: 100,
                        offsetX: element.activity_offsetX,
                        offsetY: element.activity_offsetY,
                        shape: { type: "Flow", shape: element.activity_shape },
                        annotations: [
                            {
                                content: element.activity_title
                            }
                        ]
                    })
                    if (element.activity_successor) {
                        connector_data.push({
                            id: "connector" + connector_count,
                            sourceID: element.activity_id,
                            targetID: element.activity_successor
                        })
                        connector_count += 1;
                    }
                })
                this.setState({
                    ...this.state,
                    waiting: false,
                    showFlow: false,
                    nodes: nodes_data,
                    connectors: connector_data
                })
            } else {
                this.setState({
                    ...this.state,
                    waiting: false,
                    error_message: "Oh No! Some error occurred please try modifying workflow again!",
                    error: true
                })
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                ...this.state,
                waiting: false,
                error_message: "Oh No! Some error occurred please try modifying workflow again!",
                error: true
            })

        })
    }

    toggleWorkFlowStatus = () => {
        this.setState({
            showFlow: !this.state.showFlow,
            waiting: true
        })
        this.fetch_workflows();
    }

    deleteWorkflow = (flow_id) => {
        this.setState({
            ...this.state,
            waiting: true
        })
        axios.post('/delete_workflow', {
            id: flow_id
        }).then(response => {
            if (/Success:/.test(response.data)) {
                this.setState({
                    ...this.state,
                    workflow_data: null,
                    message: "Fetching workflows from server, Please wait!",
                })
                this.fetch_workflows();
                this.setState({
                    ...this.state,
                    delete_success: true,
                })
            } else if (/Warning:/.test(response.data)) {
                this.setState({
                    ...this.state,
                    waiting: false,
                    error_message: "Oh No! Can not delete the workflow because there a running instance related it.",
                    error: true
                })
            } else {
                this.setState({
                    ...this.state,
                    waiting: false,
                    error_message: "Oh No! Some issue occurred. Please try again.",
                    error: true
                })
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                ...this.state,
                waiting: false,
                error_message: "Oh No! Some issue occurred. Please try again.",
                error: true
            })
        })
    }
    render() {
        let workflows = null;
        if (this.state.workflow_data) {
            workflows = this.state.workflow_data.map(workflow => {
                return <WorkFlowCard key={workflow.workflow_id} title={workflow.workflow_title}
                    creator={workflow.creator_name} email={workflow.creator_email}
                    clicked={this.checkWorkFlowStatus.bind(this, workflow.workflow_id)}
                    deadline={workflow.deadline_days} delete={this.deleteWorkflow.bind(this, workflow.workflow_id)} />
            })
        }
        return (
            <div>
                {this.state.showFlow ?
                    <div style={{ flexGrow: 1 }}>
                        <Grid container spacing={1} style={{ padding: "10px" }}>
                            {workflows ? workflows : <p style={{ padding: "15px" }}>{this.state.message}</p>}
                        </Grid> </div> : <Kitmodifier nodes={this.state.nodes} connectors={this.state.connectors}
                            clicked={this.toggleWorkFlowStatus} />}
                <Backdrop style={{ zIndex: '300', color: '#000' }} open={this.state.waiting}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Snackbar open={this.state.error} autoHideDuration={5000} onClose={this.handleCloseSnackBar}>
                    <Alert onClose={this.handleCloseSnackBar} severity="error">
                        {this.state.error_message}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.delete_success} autoHideDuration={5000}
                    onClose={this.handleCloseSnackBarDeleteSuccess}>
                    <Alert onClose={this.handleCloseSnackBar} severity="success">
                        Workflow deleted successfully!
                    </Alert>
                </Snackbar>

            </div>
        )
    }
}
export default WorkFlows;
