import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Chart from './chart';
import Deposits from './deposits';
import Orders from './orders';
import Title from './title'
import ChartAcciones from './chartacciones';
import ChartParticipacion from './chartparticipacion';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}));

export default function Dashboard() {
  const classes = useStyles();
   
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Accionistas */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>

              <React.Fragment>
                <Title>Accionistas</Title>
                <Typography component="p" variant="h4">
                    405
                </Typography>
                <Title>Transferencias</Title>
                <Typography component="p" variant="h4">
                    97
                </Typography>
                <Title>Juntas</Title>
                <Typography component="p" variant="h4">
                    8
                </Typography>                
              </React.Fragment>
              </Paper>
            </Grid>
            {/* Chart pruebas*/}
            <Grid item xs={12} md={8} lg={4}>
              <Paper className={fixedHeightPaper}>
                <ChartAcciones />
              </Paper>
            </Grid>            {/* Chart */}
            <Grid item xs={12} md={8} lg={5}>
              <Paper className={fixedHeightPaper}>
                <ChartParticipacion />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Orders />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}