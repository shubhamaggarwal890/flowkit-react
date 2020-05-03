import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function BetterAlert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
}));

export default function Roles(props) {
  const classes = useStyles();
  const [individual, setIndividual] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState(null);
  const [emailMessage, setEmailMessage] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(false);
  const [snackbarError, setSnackbarError] = React.useState(false);


  const individualEntryHandler = () => {
    setMessage(null);
    if (individual === null || individual.length === 0) {
      setMessage("Individual name is required");
      return;
    }

    if (email !== null && email.length !== 0 && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailMessage("Doesn't look like an email address to us!")
      return;
    }
    if (email !== null && email.length !== 0) {
      axios.post('/add_individual', {
        vertical: individual,
        associates: {
          emailId: email
        }
      }).then(response => {
        if (/Success:/.test(response.data)) {
          setSnackbar(true);
          setIndividual("");
        }
        else {
          setSnackbarError(true);
          return;
        }
      }).catch(error => {
        setSnackbarError(true);
        return;
      })
    } else {
      axios.post('/add_individual', {
        vertical: individual,
      }).then(response => {
        if (/Success:/.test(response.data)) {
          setSnackbar(true);
          setIndividual("");
        }
        else {
          setSnackbarError(true);
          return;
        }
      }).catch(error => {
        setSnackbarError(true);
        return;
      })
    }
  }

  const handleCloseSnackBar = () => {
    setSnackbar(false);
    setSnackbarError(false);
  }


  const individualHandler = (event) => {
    setIndividual(event.target.value);
    setMessage(null);
  }

  const emailHandler = (event) => {
    setEmail(event.target.value);
    setEmailMessage(null);
  }



  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Vertical based Associate
        </Typography>

        <Grid container spacing={2} style={{ marginTop: "15px" }}>
          <Grid item xs={12}>
            <TextField
              style={{ width: "100%" }}
              variant="outlined"
              required
              fullWidth
              id="individual"
              value={individual}
              label="Vertical"
              name="individual"
              helperText={message}
              onChange={individualHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: "100%" }}
              variant="outlined"
              fullWidth
              id="email"
              value={email}
              label="Email Address"
              name="email"
              helperText={emailMessage}
              onChange={emailHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={individualEntryHandler}
            >
              Add Vertical
          </Button>
          </Grid>
        </Grid>

        <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleCloseSnackBar}>
          <BetterAlert onClose={handleCloseSnackBar} severity="success">
            Vertical succesfully entered. Now you'll be able to vertical while adding activity.
            </BetterAlert>
        </Snackbar>
        <Snackbar open={snackbarError} autoHideDuration={3000} onClose={handleCloseSnackBar}>
          <BetterAlert onClose={handleCloseSnackBar} severity="error">
            Oh No, You shouldn't have seen this, please try again.
            </BetterAlert>
        </Snackbar>

      </div>
    </Container>
  );
}