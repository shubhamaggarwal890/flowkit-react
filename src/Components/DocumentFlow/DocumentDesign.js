import React, { Component } from 'react';
import StartFlowCard from './StartFlowCard';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Kitassociate from './Kitassociate';
import { connect } from 'react-redux';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class DocumentDesign extends Component {

    state = {
        showFlow: true,
        workflow_data: null,
        waiting: false,
        message: "Fetching workflows from server, Please wait!",
        error: false,
        error_message: null,
        workflow_id: null,
        workflow_title: null,
        nodes: null,
        connectors: null,
        start_id: null,
        end_id: null,
        manager: null,
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
                    message: "No workflow found, Kindly report this to admin.",
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

    fetchManager = () => {
        axios.post('/associate_manager', {
            id: this.props.id
        }).then(response => {
            if (response.data) {
                this.setState({
                    ...this.state,
                    manager: response.data,
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    start_workflow_instance = (workflow_id, workflow_title) => {
        this.setState({
            ...this.state,
            waiting: true,
            workflow_id: workflow_id,
            workflow_title: workflow_title
        })
        this.fetchManager();
        axios.post('/get_workflow_activity', {
            id: workflow_id
        }).then(response => {
            if (response.data) {

                let nodes_data = [];
                let connector_data = [];
                let connector_count = 1;
                response.data.forEach(element => {
                    nodes_data.push({
                        id: element.id,
                        annotations: [
                            {
                                content: element.title
                            }
                        ],
                        height: 50,
                        width: 100,
                        offsetX: element.offsetX,
                        offsetY: element.offsetY,
                        shape: { type: "Flow", shape: element.shape },
                        description: element.description,
                        auto: element.auto,
                        role: element.role,
                        individual: element.individual,
                        manager: this.state.manager,
                        other: element.other,
                        any_all: element.any_all

                    })
                    if (element.successor) {
                        connector_data.push({
                            id: "connector" + connector_count,
                            sourceID: element.id,
                            targetID: element.successor
                        })
                        connector_count += 1;
                    }
                })
                this.setState({
                    ...this.state,
                    waiting: false,
                    showFlow: false,
                    nodes: nodes_data,
                    connectors: connector_data,
                })
            } else {
                this.setState({
                    ...this.state,
                    waiting: false,
                    error_message: "Oh No! Some error occurred please try selecting workflow again!",
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

    exitKeyAssociate = () => {
        this.setState({
            ...this.state,
            showFlow: true
        })
    }

    render() {
        let workflows = null;
        if (this.state.workflow_data) {
            workflows = this.state.workflow_data.map(workflow => {
                return <StartFlowCard
                    key={workflow.id}
                    title={workflow.title}
                    description={workflow.description}
                    clicked={this.start_workflow_instance.bind(this, workflow.id, workflow.title)}
                    deadline={workflow.deadline_days}
                />
            })
        }
        return (
            <div>
                {
                    this.state.showFlow ?
                        <div style={{ flexGrow: 1 }}>
                            <Grid container spacing={1} style={{ padding: "10px" }}>
                                {
                                    workflows ? workflows : <p style={{ padding: "15px" }}>{this.state.message}</p>
                                }
                            </Grid> </div> :
                        <Kitassociate nodes={this.state.nodes} connectors={this.state.connectors}
                            exitButton={this.exitKeyAssociate} workflow_id={this.state.workflow_id}
                            workflow_title={this.state.workflow_title} />
                }
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

export default connect(mapStateToProps)(DocumentDesign);