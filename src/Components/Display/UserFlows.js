import React, { Component } from 'react';
import UserFlowCard from './UserFlowCard';
import Kitdisplay from './Kitdisplay';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class UserFlows extends Component {

    state = {
        showFlow: true,
        workflow_instance_data: null,
        waiting: false,
        message: "Fetching workflows documented for you from server, Please wait!",
        nodes: null,
        connectors: null,
        error: false,
        error_message: null,
        delete_success: false,
        title: null,
    }

    fetch_workflows_instance = () => {
        axios.post('/get_workflows_instance',
            {
                id: this.props.id
            }).then(response => {
                if (response.data) {
                    this.setState({
                        ...this.state,
                        workflow_instance_data: response.data,
                        waiting: false,
                    })
                } else {
                    this.setState({
                        ...this.state,
                        message: "No workflow documented for you found.",
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
        this.fetch_workflows_instance();
    }

    handleCloseSnackBar = () => {
        this.setState({
            ...this.state,
            error: false
        })
    }

    checkWorkFlowInstanceStatus = (workflowInstanceId, workflowInstanceTitle) => {
        this.setState({
            ...this.state,
            waiting: true,
            title: workflowInstanceTitle
        })

        axios.post('/get_workflow_instance_activity', {
            id: workflowInstanceId
        }).then(response => {
            console.log(response.data);
            if (response.data) {
                let activities = [];
                let connectors = [];
                let index = 1;
                response.data.forEach(element => {
                    activities.push({
                        id: element.id,
                        description: element.description,
                        height: 50,
                        width: 100,
                        offsetX: element.offsetX,
                        offsetY: element.offsetY,
                        shape: { type: "Flow", shape: element.shape },
                        annotations: [
                            {
                                content: element.title
                            }
                        ],
                        document: element.document===null?null:element.document.id,
                        associates: element.associates,
                        any_all: element.any_all,
                        auto: element.auto,
                        status: element.status
                    })
                    if (element.successor) {
                        connectors.push({
                            id: "connector" + index,
                            sourceID: element.id,
                            targetID: element.successor
                        })
                        index += 1;
                    }
                })
                this.setState({
                    ...this.state,
                    waiting: false,
                    showFlow: false,
                    nodes: activities,
                    connectors: connectors
                })
            } else {
                this.setState({
                    ...this.state,
                    waiting: false,
                    error_message: "Oh No! Please try selecting workflow again!",
                    error: true
                })
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                ...this.state,
                waiting: false,
                error_message: "Oh No! Some error occurred please try selecting workflow again!",
                error: true
            })

        })
    }

    toggleWorkFlowInstanceStatus = () => {
        this.setState({
            showFlow: !this.state.showFlow,
            waiting: true
        })
        this.fetch_workflows_instance();
    }

    render() {
        let workflows = null;
        if (this.state.workflow_instance_data) {
            workflows = this.state.workflow_instance_data.map(workflow => {
                return <UserFlowCard key={workflow.id} title={workflow.title}
                    associate_name={workflow.initiator.name} associate_email={workflow.initiator.email}
                    clicked={this.checkWorkFlowInstanceStatus.bind(this, workflow.id, workflow.title)}
                    date={workflow.date} description={workflow.description} wf_description={workflow.wf_description}
                    deadline={workflow.deadline} />
            })
        }
        return (
            <div>
                {this.state.showFlow ?
                    <div style={{ flexGrow: 1 }}>
                        <Grid container spacing={1} style={{ padding: "10px" }}>
                            {workflows ? workflows : <p style={{ padding: "15px" }}>{this.state.message}</p>}
                        </Grid> </div> : <Kitdisplay nodes={this.state.nodes} connectors={this.state.connectors}
                            exitButton={this.toggleWorkFlowInstanceStatus} title={this.state.title}/>}
                <Backdrop style={{ zIndex: '300', color: '#000' }} open={this.state.waiting}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Snackbar open={this.state.error} autoHideDuration={5000} onClose={this.handleCloseSnackBar}>
                    <Alert onClose={this.handleCloseSnackBar} severity="error">
                        {this.state.error_message}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        id: state.associate.id,
    };
}

export default connect(mapStateToProps)(UserFlows);
