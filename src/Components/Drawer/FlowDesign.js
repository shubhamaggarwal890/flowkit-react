import React, { Component } from 'react';
import Kitdrawer from './Kitdrawer'
import DrawerButton from './DrawerButton';
import WorkFlows from './WorkFlows'
import { connect } from 'react-redux'

class FlowDesign extends Component {

    state = {
        openDrawer: false
    }

    handleClickedButton = () => {
        this.setState({
            openDrawer: true
        })
    }

    render() {
        if (this.props.flows_designing_activity === 0) {
            if(this.state.openDrawer) return <Kitdrawer />
            else return <DrawerButton buttonClick={this.handleClickedButton}/>
        } else {
            return <WorkFlows />
        }
    }
}


const mapStateToProps = state => {
    return {
        flows_designing_activity: state.flows_designing.activity
    };
}

export default connect(mapStateToProps, null)(FlowDesign);