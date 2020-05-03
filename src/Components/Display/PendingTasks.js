import React, { Component } from 'react';
import PendingCard from './PendingCard';
import KitConditional from './KitConditional';
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
class PendingTasks extends Component {

    state = {
        showPending: true,
        workflow_instance_data: null,
        waiting: false,
        message: "Fetching workflows associated for you from server, Please wait!",
        nodes: null,
        connectors: null,
        error: false,
        error_message: null,
        delete_success: false
    }

    fetch_workflows_instance_associate = () => {
        axios.post('/get_workflows_instance_associate', {
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
                    message: "No associated workflow for you found.",
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
        this.fetch_workflows_instance_associate();
    }

    handleCloseSnackBar = () => {
        this.setState({
            ...this.state,
            error: false
        })
    }

    checkWorkFlowInstanceForAssociateStatus = (flow_id) => {
        this.setState({
            ...this.state,
            waiting: true
        })
        axios.post('/get_workflow_instance_associate_activity', {
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
                        ],
                        remark: element.remark,
                        document: element.document,
                        associate_name: element.associate_name,
                        associate_email: element.associate_email,
                        associate_remark: element.associate_remark
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
                    showPending: false,
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


    toggleWorkFlowInstanceForAssociateStatus = () => {
        this.setState({
            showPending: true,
            waiting: true
        })
        this.fetch_workflows_instance_associate();
    }

    render() {
        let workflows = null;
        if (this.state.workflow_instance_data) {
            workflows = this.state.workflow_data.map(workflow => {
                return <PendingCard key={workflow.workflow_id} title={workflow.workflow_title}
                    associate_name={workflow.creator_name} associate_email={workflow.creator_email}
                    clicked={this.checkWorkFlowInstanceForAssociateStatus.bind(this, workflow.workflow_id)}
                    date={workflow.initiate_date}
                    customer_name={workflow.customer_name} customer_email={workflow.customer_email}
                    deadline={workflow.deadline_date} />
            })
        }
        return (
            <div>
                {this.state.showPending ?
                    <div style={{ flexGrow: 1 }}>
                        <Grid container spacing={1} style={{ padding: "10px" }}>
                            {workflows ? workflows : <p style={{ padding: "15px" }}>{this.state.message}</p>}
                        </Grid> </div> : <KitConditional nodes={this.state.nodes} connectors={this.state.connectors}
                            clicked={this.toggleWorkFlowInstanceForAssociateStatus} />}
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

export default connect(mapStateToProps)(PendingTasks);
