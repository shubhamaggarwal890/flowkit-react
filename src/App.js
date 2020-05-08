import React, { Component } from 'react';
import Flowkit from './PaperBase/Flowkit';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import SignInSide from './Components/SignIn/SignInSide';
import { connect } from 'react-redux';


class App extends Component {
 
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {this.props.id ? <Route path="/:id" exact component={Flowkit} /> : null}
          <Route path="/" component={SignInSide} />
        </Switch>

      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    id: state.associate.id,
  };
}

export default connect(mapStateToProps)(App);
