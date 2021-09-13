import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { Button } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';


const useStyles = makeStyles((theme) => ({


    appBarSpacer: {
        //display: 'flex',
        //alignItems: 'center',
        //justifyContent: 'flex-end',
        //padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing(2),
      },
/*
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  */
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  
}));

export default function Operaciones() {
  const classes = useStyles();

  return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
                <ButtonGroup size="small" aria-label="small outlined button group" style={{paddingBottom: 10}}>
                    <Button color="secondary" variant="contained">Pendientes</Button>
                    <Button>Rechazadas</Button>
                    <Button>Aprobadas</Button>
                    <Button>Anuladas</Button>
                </ButtonGroup>
                <Button>Pruebame</Button>
                
            </Grid>
         </Grid>

      </main>


  );
}