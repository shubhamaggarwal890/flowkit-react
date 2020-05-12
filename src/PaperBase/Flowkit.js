import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import Paperbase from './Paperbase';
import axios from 'axios';
import { connect } from 'react-redux';


// const sleep = (milliseconds) => {
//     return new Promise(resolve => setTimeout(resolve, milliseconds))
// }

class Flowkit extends Component {

    constructor(props) {
        super(props);
        this.fetchNotifications();
    }

    componentDidUpdate(){
        console.log("hello world");
    }

    state = {
        notifications: []
    }

    fetchNotifications = () => {
        axios.post('/get_notifications', {
            id: this.props.id,
        }).then(response => {
            console.log(response);
            if (response.data) {
                this.setState({
                    ...this.state,
                    notifications: response.data
                })
            }
        }).catch(error => {
            console.log("Error", error);
        })
    }

    getNotifications = () => {
        this.state.notifications.forEach((element, index) => {
            this.props.enqueueSnackbar(element.message, {
                autoHideDuration: 10000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            })
        });
    }



    render() {
        return <Paperbase match={this.props.match} getNotifications={this.getNotifications}
            number={this.state.notifications.length} />
    }
}

const mapStateToProps = state => {
    return {
        id: state.associate.id,
    };
}


export default connect(mapStateToProps)(withSnackbar(Flowkit));