import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Container from '@material-ui/core/Container';
import Typography from './Typography';
import image1 from '../../assets/images/fk6.png'
import image2 from '../../assets/images/fk2.png'
import image3 from '../../assets/images/fk3.png'
import image4 from '../../assets/images/fk4.png'
import image5 from '../../assets/images/fk5.png'
import image6 from '../../assets/images/fk7.png'

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  images: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    position: 'relative',
    display: 'block',
    padding: 0,
    borderRadius: 0,
    height: '40vh',
    [theme.breakpoints.down('sm')]: {
      width: '100% !important',
      height: 100,
    },
    '&:hover': {
      zIndex: 1,
    },
    '&:hover $imageBackdrop': {
      opacity: 0.15,
    },
    '&:hover $imageMarked': {
      opacity: 0,
    },
    '&:hover $imageTitle': {
      border: '4px solid currentColor',
    },
  },
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: theme.palette.common.black,
    opacity: 0.5,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
});

function DrawerButton(props) {
  const { classes } = props;

  const images = [
    {
      url: image3,
      title: 'Get Started',
      width: '30%',
    },
    {
      url: image2,
      width: '25%',
    },
    {
      url: image1,
      width: '45%',
    },
    {
      url: image5,
      width: '38%',
    },
    {
      url: image4,
      width: '38%',
    },
    {
      url: image6,
      width: '24%',
    }
  ];

  return (
    <Container className={classes.root} component="section">
      <div className={classes.images}>
        {images.map((image, index) => (
          <ButtonBase
            key={index}
            className={classes.imageWrapper}
            style={{
              width: image.width,
            }}
          >
            <div
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${image.url})`,
              }}
            />
            <div className={classes.imageBackdrop} />
            {index===0?
            <div className={classes.imageButton} onClick={props.buttonClick}>
              <Typography
                component="h3"
                variant="h6"
                color="inherit"
                className={classes.imageTitle}
              >
                {image.title}
                <div className={classes.imageMarked} />
              </Typography>
            </div>:null}
          </ButtonBase>
        ))}
      </div>
    </Container>
  );
}

export default withStyles(styles)(DrawerButton);