import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import AppBar from '@material-ui/core/AppBar';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';


class ActivityDrawer extends Component {

    setupStateWhenSwitch = (index) => {
        let description = "";
        let auto = "false";
        let role = "";
        let individual = "";
        let associate = "user";
        let other_associate = "";
        let role_approval = "any"

        if (this.props.nodes != null && this.props.nodes.length > index) {
            if (this.props.nodes[index].description != null) {
                description = this.props.nodes[index].description
            }
            if (this.props.nodes[index].auto != null) {
                auto = this.props.nodes[index].auto
            }
            if (this.props.nodes[index].associate != null) {
                associate = this.props.nodes[index].associate
            }
            if (this.props.nodes[index].role != null) {
                role = this.props.nodes[index].role
            }
            if (this.props.nodes[index].individual != null) {
                individual = this.props.nodes[index].individual
            }
            if (this.props.nodes[index].other != null) {
                other_associate = this.props.nodes[index].other
            }
            if (this.props.nodes[index].role_approval != null) {
                role_approval = this.props.nodes[index].role_approval
            }

            this.setState({
                ...this.state,
                description: description,
                auto: auto,
                role: role,
                individual: individual,
                associate: associate,
                value: index,
                other_associate: other_associate,
                role_approval: role_approval
            })

        }
    }

    setStateOfActivity = (index) => {
        if (this.props.nodes != null && this.props.nodes.length > index) {
            let nodesTemp = this.props.nodes
            nodesTemp[index].description = this.state.description
            nodesTemp[index].auto = this.state.auto
            nodesTemp[index].role = this.state.role
            nodesTemp[index].individual = this.state.individual
            nodesTemp[index].associate = this.state.associate
            nodesTemp[index].other_associate = this.state.other_associate
            nodesTemp[index].others_vertical = this.state.others_vertical
            nodesTemp[index].role_approval = this.state.role_approval
            this.props.diagramSettings(nodesTemp, this.props.connectors)
        }
    }

    constructor(props) {
        super(props);
        let description = "";
        let auto = "false";
        let role = "";
        let individual = "";
        let associate = "user";
        let other_associate = "";
        let role_approval = "any";

        if (this.props.nodes != null && this.props.nodes.length > 0) {
            if (this.props.nodes[0].description != null) {
                description = this.props.nodes[0].description
            }
            if (this.props.nodes[0].auto != null) {
                auto = this.props.nodes[0].auto
            }
            if (this.props.nodes[0].associate != null) {
                associate = this.props.nodes[0].associate
            }
            if (this.props.nodes[0].role != null) {
                role = this.props.nodes[0].role
            }
            if (this.props.nodes[0].individual != null) {
                individual = this.props.nodes[0].individual
            }
            if (this.props.nodes[0].other != null) {
                other_associate = this.props.nodes[0].other
            }
            if (this.props.nodes[0].role_approval != null) {
                role_approval = this.props.nodes[0].role_approval
            }

            this.state = {
                value: 0,
                description: description,
                auto: auto,
                associate: associate,
                role: role,
                individual: individual,
                other_associate: other_associate,
                roles_list: null,
                individual_list: null,
                message: null,
                success: null,
                role_approval: role_approval
            }
        } else {
            this.state = {
                value: 0,
                description: "",
                auto: "false",
                associate: "user",
                role: "",
                individual: "",
                other_associate: "",
                roles_list: null,
                individual_list: null,
                others_vertical: null,
                message: null,
                success: null,
                role_approval: "any"
            }
        }
        this.getRolesFromDatabase();
        this.getIndividualsFromDatabase();
    }

    getRolesFromDatabase = () => {
        axios.get('/get_roles').then(response => {
            if (response.data) {
                this.setState({
                    roles_list: response.data
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    getIndividualsFromDatabase = () => {
        axios.get('/get_individuals').then(response => {
            if (response.data) {
                response.data.forEach(element => {
                    if (/Others/.test(element.vertical)) {
                        this.setOtherVertical(element.id)
                    }
                });

                this.setState({
                    individual_list: response.data
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    handleActivityChange = (event, newValue) => {
        this.setupStateWhenSwitch(newValue);
        this.setState({
            message: null,
            success: null
        })
    };

    descriptionHandler = (event) => {
        this.setState({
            ...this.state,
            description: event.target.value,
            message: null
        })
    }

    autoChangeHandler = (event) => {
        if (event.target.value === "true") {
            this.setState({
                ...this.state,
                associate: "",
                role: "",
                individual: "",
                auto: event.target.value,
                message: null
            })
        } else {
            this.setState({
                ...this.state,
                auto: event.target.value,
                message: null
            })
        }
    }

    associateChangeHandler = (event) => {
        this.setState({
            ...this.state,
            associate: event.target.value,
            message: null
        })
    }

    roleChangeHandler = (event) => {
        this.setState({
            ...this.state,
            role: event.target.value,
            message: null
        })
    }

    individualChangeHandler = (event) => {
        this.setState({
            ...this.state,
            individual: event.target.value,
            message: null
        })
    }

    setOtherVertical = (id) => {
        this.setState({
            ...this.state,
            others_vertical: id,
            message: null
        })
    }

    otherAssociateHandler = (event) => {
        this.setState({
            ...this.state,
            other_associate: event.target.value,
            message: null
        })

    }

    roleApprovalChangeHandler = (event) => {
        this.setState({
            ...this.state,
            role_approval: event.target.value,
            message: null
        })
    }

    saveActivityHandler = () => {
        let message = null
        if (this.state.auto === "false") {
            if (this.state.associate === "role" && (this.state.role == null || this.state.role.length === 0)) {
                message = "Please set role for the manual activity flow"
                this.setState({
                    ...this.state,
                    message: message
                })
                return;
            }
            if (this.state.associate === "individual" && (this.state.individual == null || this.state.individual.length === 0)) {
                message = "Please set a vertical role for the manual activity flow"
                this.setState({
                    ...this.state,
                    message: message
                })
                return;

            }
            // eslint-disable-next-line eqeqeq
            else if (this.state.associate === "individual" && this.state.others_vertical == this.state.individual &&
                this.state.other_associate.length === 0) {
                message = "Please set a custom associate email address for the manual activity flow"
                this.setState({
                    ...this.state,
                    message: message
                })
                return
            }
            // eslint-disable-next-line eqeqeq
            else if (this.state.associate === "individual" && this.state.others_vertical == this.state.individual &&
                !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.other_associate)) {
                message = "This doesn't look like an email id to us"
                this.setState({
                    ...this.state,
                    message: message
                })
                return
            }

        }
        const index = this.state.value
        if (this.props.nodes != null && this.props.nodes.length > index) {
            let nodesTemp = this.props.nodes
            nodesTemp[index].description = this.state.description
            nodesTemp[index].auto = this.state.auto
            nodesTemp[index].role = this.state.role
            nodesTemp[index].individual = this.state.individual
            nodesTemp[index].associate = this.state.associate
            nodesTemp[index].other_associate = this.state.other_associate
            nodesTemp[index].others_vertical = this.state.others_vertical
            nodesTemp[index].role_approval = this.state.role_approval
            nodesTemp[index].valid = true
            this.props.diagramSettings(nodesTemp, this.props.connectors)

            this.setState({
                ...this.state,
                success: "Activity saved successfully"
            })
            return
        }
        this.setState({
            ...this.state,
            message: "Oh no this wasn't supposed to happen, Please try again"
        })
    }

    render() {

        let tab = null;
        let roles_select = null;
        let individual_select = null;
        if (this.state.roles_list) {
            roles_select = this.state.roles_list.map(element => {
                return <option key={element.id} value={element.id}>{element.name}</option>
            })
        }

        if (this.state.individual_list) {
            individual_select = this.state.individual_list.map(element => {
                return <option key={element.id} value={element.id}>{element.vertical}</option>

            })
        }
        if (this.props.nodes != null) {
            tab = this.props.nodes.map((element, index) => {
                if (element.valid != null && element.valid) {
                    return <Tab key={element.id} label={element.annotations[0].content}
                        id={"scrollable-auto-tab-" + index} style={{ backgroundColor: "lightgreen" }} />
                } else {
                    return <Tab key={element.id} label={element.annotations[0].content}
                        id={"scrollable-auto-tab-" + index} />
                }
            })
        }

        return (
            <div style={{ flexGrow: '1', width: '100%', marginTop: "15px" }}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleActivityChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                    >
                        {tab}
                    </Tabs>
                </AppBar>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Grid container spacing={2} style={{ marginTop: "15px" }}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="description"
                                value={this.state.description}
                                label="Activity Description"
                                name="description"
                                onChange={this.descriptionHandler}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Activity flow</FormLabel>
                                <RadioGroup value={this.state.auto} onChange={this.autoChangeHandler} row>
                                    <FormControlLabel value="true" control={<Radio />} label="Auto" labelPlacement="start" />
                                    <FormControlLabel value="false" control={<Radio />} label="Manual" labelPlacement="start" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        {this.state.auto === "false" ?
                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Associate</FormLabel>
                                    <RadioGroup value={this.state.associate} onChange={this.associateChangeHandler} row>
                                        <FormControlLabel value="role" control={<Radio />} label="Role specific" labelPlacement="start" />
                                        <FormControlLabel value="individual" control={<Radio />} label="Initiator related" labelPlacement="start" />
                                        <FormControlLabel value="user" control={<Radio />} label="User specified" labelPlacement="start" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid> : null
                        }

                        {this.state.associate === "role" ?
                            <Grid item xs={12}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="role-select">Role Specific</InputLabel>
                                    <Select
                                        native
                                        value={this.state.role}
                                        onChange={this.roleChangeHandler}
                                        label="role"
                                        required
                                        inputProps={{
                                            name: 'role',
                                            id: 'role-select',
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        {roles_select}
                                    </Select>
                                </FormControl>


                            </Grid> : null
                        }

                        {this.state.associate === "individual" ?
                            <Grid item xs={12}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="individual-select">Verticals</InputLabel>
                                    <Select
                                        native
                                        value={this.state.individual}
                                        required
                                        onChange={this.individualChangeHandler}
                                        label="individual"
                                        inputProps={{
                                            name: 'individual',
                                            id: 'individual-select',
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        {individual_select}
                                    </Select>
                                </FormControl>
                            </Grid> : null
                        }
                        {this.state.associate === "individual" &&
                            // eslint-disable-next-line eqeqeq
                            this.state.others_vertical == this.state.individual ?
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="other_associate"
                                    value={this.state.other_associate}
                                    label="Associate Email Address"
                                    name="other associate"
                                    required
                                    onChange={this.otherAssociateHandler}
                                />
                            </Grid> : null
                        }
                        {this.state.associate === "role" && this.state.role.length > 0 ?
                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Role Approval</FormLabel>
                                    <RadioGroup value={this.state.role_approval} onChange={this.roleApprovalChangeHandler} row>
                                        <FormControlLabel value="any" control={<Radio />} label="ANY" labelPlacement="start" />
                                        <FormControlLabel value="all" control={<Radio />} label="ALL" labelPlacement="start" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid> : null
                        }
                        {this.state.message ? <Grid item xs={12}>
                            <Alert severity="error">{this.state.message}</Alert>
                        </Grid> : null}
                        {this.state.success ? <Grid item xs={12}>
                            <Alert severity="success">{this.state.success}</Alert>
                        </Grid> : null}
                        <Grid item xs={12}>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{ marginBottom: "15px" }}
                                onClick={this.saveActivityHandler}
                            >
                                Save Activity
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        nodes: state.drawer.nodes,
        connectors: state.drawer.connectors
    };
}

const mapDispatchToProps = dispatch => {
    return {
        diagramSettings: (nodes, connectors) => dispatch({ type: 'drawer_diagram', nodes: nodes, connectors: connectors })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDrawer);