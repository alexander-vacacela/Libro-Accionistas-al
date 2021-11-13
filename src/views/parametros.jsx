import React, {useState, useEffect} from 'react'
import {makeStyles, Paper, Grid, Button, TextField, CircularProgress, Snackbar} from '@material-ui/core'
import { API } from 'aws-amplify';
import { getParametro } from './../graphql/queries'
import { updateParametro } from './../graphql/mutations'
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.secondary,
      height:'calc(100%)',
    },
    appBarSpacer: {
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),        
    },

  
  }));
  
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  

export default function Parametros(){

    const [cantidadEmitido, setCantidadEmitido] = useState(0);
    const handleCantidadEmitidoChange = (event) => {

      setCantidadEmitido(event.target.value.replace(/[^0-9]/g, ''));
    
      //return null;
/*
      event.target.value < 0
      ? setCantidadEmitido(0)
      : setCantidadEmitido(event.target.value)
*/
    };
    const classes = useStyles();
    const [circular, setCircular] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);

    useEffect(() => {
        fetchParametros();
    }, []);
 
  
    async function fetchParametros() {

        console.log('entro de nuevo a parametros??', 'Siiiii')

        const apiData = await API.graphql({ query: getParametro , variables: { id: '1' } });

        const parametrosFromAPI = apiData.data.getParametro;    

        console.log('parametrosFromAPI', parametrosFromAPI)
        setCantidadEmitido(parametrosFromAPI.cantidadEmitida);
    }

    //const apiDataUpdate =  async(nuevoSecuencial) => await API.graphql({ query: updateNumeroSecuencial, variables: { input: {id: '1', numerotitulo: nuevoSecuencial} } });

    const addCantidadEmitida = async () => {
        try {
            
            if (!cantidadEmitido) return
    
            setCircular(true);
    
            const operID = await API.graphql({ query: updateParametro, variables: { input: {id: '1', cantidadEmitida: cantidadEmitido} } });
    
            setCircular(false);
            setOpenSnack(true)
    
             } catch (err) {
            console.log('error creating transaction:', err)
        }   
      }
    
      const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnack(false);
      };
      

return(
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
        <Paper variant="outlined" className={classes.paper}>
            <Grid container>
                <Grid item xs={12} style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                    <TextField
                        //type="number"
                        //required
                        //InputProps={{ inputProps: { min: 0, max: 10 } }}
                        //InputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        id="outlined-required"
                        label="Total Emitido"
                        //defaultValue="0"
                        value={cantidadEmitido}
                        onChange={handleCantidadEmitidoChange}
                    /> 
                    <Button onClick={addCantidadEmitida} size='small' variant='contained' color='primary' style={{marginLeft:20}}>Grabar</Button>
                </Grid>     
                {circular && <CircularProgress />}      

            </Grid>
            <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                    <Alert onClose={handleCloseSnack} severity="success">
                    Se registró correctamente.
                    </Alert>
                </Snackbar> 
        </Paper>        
        </main>
);
    
}