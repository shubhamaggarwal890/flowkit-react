import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from 'axios';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


function SnackAlert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class WorkFlowSaver extends Component {

    state = {
        title: "",
        description: "",
        snackbar: false,
        error_snackbar: false,
        message: null,
        confirmation: false
    }

    descriptionHandler = (event) => {
        this.setState({
            ...this.state,
            description: event.target.value
        })
    }

    titleHandler = (event) => {
        this.setState({
            ...this.state,
            title: event.target.value
        })
    }

    handleShowBackdrop = () => {
        this.setState({
            ...this.state,
            confirmation: true
        })
    }

    handleHideBackdrop = () => {
        this.setState({
            ...this.state,
            confirmation: false
        })
    }

    saveWorkflowHandler = () => {
        if (this.state.title == null || this.state.title.length === 0) {
            this.setState({
                ...this.state,
                message: "Required fields are missing!"
            })
            return;
        }
        let nodes_data = [];
        this.handleShowBackdrop();
        this.props.nodes.forEach(element => {
            let node_object = {
                id: element.id,
                title: element.annotations[0].content,
                description: element.description.length > 0 ? element.description : null,
                offsetX: element.offsetX,
                offsetY: element.offsetY,
                shape: element.shape.shape,
                predecessor: null,
                successor: null,
                auto: element.auto === "true" ? true : false,
                role: {
                    id: element.role.length > 0 ? element.role : null
                },
                individual: {
                    id: element.individual.length > 0 ? element.individual : null
                },
                other: {
                    email: element.other_associate.length > 0 ? element.other_associate : null
                },
                any_all: element.role_approval === "all" ? true : false
            }

            this.props.connectors.forEach(connector => {
                if (connector.sourceID === element.id) {
                    node_object.successor = connector.targetID
                }
                if (connector.targetID === element.id) {
                    node_object.predecessor = connector.sourceID
                }
            })
            nodes_data.push(node_object)
        });
        
        axios.post('/add_workflow', {
            title: this.state.title,
            description: this.state.description.length > 0 ? this.state.description : null,
            creator: {
                id: this.props.creator_id
            },
            activities: nodes_data,
            deadline: 30
        }).then(response => {
            if (/Success:/.test(response.data)) {
                this.setState({
                    ...this.state,
                    snackbar: true,
                    confirmation: false,
                })
            }
            else {
                this.setState({
                    ...this.state,
                    error_snackbar: true,
                    confirmation: false,
                })
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                ...this.state,
                error: true,
                confirmation: false,
            })
            return;
        })
        return;

    }

    handleCloseSnackBar = () => {
        this.setState({
            ...this.state,
            snackbar: false,
        })
        this.props.resetDrawer();
        this.props.resetActiveStep();
    }

    handleCloseErrorSnackBar = () => {
        this.setState({
            ...this.state,
            error_snackbar: false
        })
        this.props.resetActiveStep();
    }


    render() {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", alignItems: 'center' }}></div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            required
                            id="title"
                            value={this.state.title}
                            label="WorkFlow Title"
                            name="title"
                            onChange={this.titleHandler}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="description"
                            value={this.state.description}
                            label="WorkFlow description"
                            name="description"
                            onChange={this.descriptionHandler}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {this.state.message ? <Alert severity="error">{this.state.message}</Alert> : null}
                    </Grid>

                </Grid>
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "10px", marginBottom: "15px" }}
                    onClick={this.saveWorkflowHandler}
                >
                    Save Workflow
              </Button>
                <Snackbar open={this.state.snackbar} autoHideDuration={3000} onClose={this.handleCloseSnackBar}>
                    <SnackAlert onClose={this.handleCloseSnackBar} severity="success">
                        Workflow successfully stored, Redirecting to drawer!
                    </SnackAlert>
                </Snackbar>
                <Snackbar open={this.state.error_snackbar} autoHideDuration={3000} onClose={this.handleCloseErrorSnackBar}>
                    <SnackAlert onClose={this.handleCloseErrorSnackBar} severity="error">
                        Oh No! Some error occurred please try again, Redirecting to drawer!
                    </SnackAlert>
                </Snackbar>
                <Backdrop style={{ zIndex: '300', color: '#000' }} open={this.state.confirmation}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        nodes: state.drawer.nodes,
        connectors: state.drawer.connectors,
        creator_id: state.associate.id
    };
}

const mapDispatchToProps = dispatch => {
    return {
        resetDrawer: () => dispatch({ type: 'reset_drawer' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkFlowSaver);