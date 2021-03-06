import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import reducer from './store/reducer';
import { Provider } from 'react-redux';
import axios from 'axios';
import { SnackbarProvider } from 'notistack';
import Button from '@material-ui/core/Button';


axios.defaults.baseURL = 'http://localhost:8085';
const store = createStore(reducer);
const notistackRef = React.createRef();

const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key);
}

ReactDOM.render(
    <Provider store={store}>
        <SnackbarProvider
            maxSnack={6}
            ref={notistackRef}
            action={(key) => (
                <Button onClick={onClickDismiss(key)} color="secondary">
                    Dismiss
                </Button>
            )}>
            <App />
        </SnackbarProvider>
    </Provider>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
