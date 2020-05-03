import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from './CopyRight';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function BetterAlert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp(props) {
  const classes = useStyles();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailId, setEmailId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("");
  const [message, setMessage] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(false);

  const signUpHandler = () => {
    setMessage(null);
    if (!firstName.length || !lastName.length || !emailId.length || !password.length || !role.length) {
      setMessage("Important fields missing!")
      return;
    }
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailId)) {
      axios.post('/add_associate', {
        firstName: firstName,
        lastName: lastName,
        emailId: emailId,
        password: password,
        role: role
      }).then(response => {
        if (/Success:/.test(response.data)) {
          setSnackbar(true);
        }
        else if (/Warning:/.test(response.data)) {
          setMessage("Oh, looks like you have already registered with this Email Address. Please sign in");
          return;
        }
        else {
          setMessage("Oh, this was unexpected. Failed to create a user for you. Please try again!");
          return;
        }
      }).catch(error => {
        console.log(error);
        setMessage("Oh, this was unexpected. Please try again!");
        return;
      })
    } else {
      setMessage("Doesn't look like an email address to us!");
      return;
    }
  }

  const handleCloseSnackBar = () => {
    setSnackbar(false);
    setTimeout(function (){
      props.history.replace("/")
    }.bind(this, 2000))
  }

  const firstNameHandler = (event) => {
    setFirstName(event.target.value);
    setMessage(null);
  }

  const lastNameHandler = (event) => {
    setLastName(event.target.value);
    setMessage(null);
  }

  const emailIdHandler = (event) => {
    setEmailId(event.target.value);
    setMessage(null);
  }

  const passwordHandler = (event) => {
    setPassword(event.target.value);
    setMessage(null);
  }

  const roleHandler = (event) => {
    setRole(event.target.value);
    setMessage(null);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                value={firstName}
                id="firstName"
                label="First Name"
                onChange={firstNameHandler}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                value={lastName}
                label="Last Name"
                name="lastName"
                onChange={lastNameHandler}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                value={emailId}
                label="Email Address"
                name="email"
                onChange={emailIdHandler}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                value={password}
                type="password"
                id="password"
                onChange={passwordHandler}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel htmlFor="role-select">Role</InputLabel>
                <Select
                  native
                  value={role}
                  onChange={roleHandler}
                  label="role"
                  inputProps={{
                    name: 'role',
                    id: 'role-select',
                  }}
                >
                  <option aria-label="None" value="" />
                  <option value={"DESIGNER"}>Designer</option>
                  <option value={"EMPLOYEE"}>Employee</option>
                  <option value={"CUSTOMER"}>Customer</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {message ? <Alert severity="error">{message}</Alert> : null}
            </Grid>
          </Grid>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signUpHandler}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleCloseSnackBar}>
            <BetterAlert onClose={handleCloseSnackBar} severity="success">
              Sign Up successful. Email Address is registered. Redirecting to sign in page!
            </BetterAlert>
          </Snackbar>
        </div>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}