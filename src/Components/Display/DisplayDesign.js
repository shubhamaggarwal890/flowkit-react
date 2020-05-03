import React, { Component } from 'react';
import UserFlows from './UserFlows';
import PendingTasks from './PendingTasks';
import { connect } from 'react-redux';

class DisplayDesign extends Component {
    render(){
        if (this.props.associated_flows_activity === 0) {
            return < UserFlows />
        }
        return (
            <PendingTasks />
        )
    }
}

const mapStateToProps = state => {
    return {
        associated_flows_activity: state.associated_flows.activity
    };
}

export default connect(mapStateToProps, null)(DisplayDesign);