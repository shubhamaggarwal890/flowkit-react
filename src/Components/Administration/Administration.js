import React, { Component } from 'react';
import SignUp from './SignUp'
import Roles from './Roles'
import Individual from './Individual'
import axios from 'axios';
import { connect } from 'react-redux'

class Administration extends Component {

    constructor(props){
        super(props);
        this.getRolesFromDatabase();
    }

    state = {
        roles: null
    }
    
    getRolesFromDatabase = () => {
        axios.get('/get_roles').then(response => {
            if (response.data) {
                this.setState({
                    roles: response.data
                })
            }
        }).catch(error => {
        })
    }

    render() {
        if (this.props.dashboard === 0) {
            return < SignUp associate_roles={this.state.roles} />
        } else if (this.props.dashboard === 1) {
            return <Roles />
        }
        return (
            <Individual />
        )
    }
}
const mapStateToProps = state => {
    return {
        dashboard: state.dashboard.activity
    };
}

export default connect(mapStateToProps, null)(Administration);