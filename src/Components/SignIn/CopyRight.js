import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const CopyRight = () => (
    <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://iiitb.ac.in/">
      IIIT Bangalore
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>

)

export default CopyRight;