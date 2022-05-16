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
    const [valorNominal, setValorNominal] = useState(0);
    const [baseImponible, setbaseImponible] = useState(0);
    const [retencionNoResidente, setRetencionNoResidente] = useState(0);

    const [FB1, setFB1] = useState(0);
    const [FB2, setFB2] = useState(0);
    const [FB3, setFB3] = useState(0);
    const [FB4, setFB4] = useState(0);
    const [FB5, setFB5] = useState(0);
    const [FB6, setFB6] = useState(0);

    const [FE1, setFE1] = useState(0);
    const [FE2, setFE2] = useState(0);
    const [FE3, setFE3] = useState(0);
    const [FE4, setFE4] = useState(0);
    const [FE5, setFE5] = useState(0);
    const [FE6, setFE6] = useState(0);

    const [RFB1, setRFB1] = useState(0);
    const [RFB2, setRFB2] = useState(0);
    const [RFB3, setRFB3] = useState(0);
    const [RFB4, setRFB4] = useState(0);
    const [RFB5, setRFB5] = useState(0);
    const [RFB6, setRFB6] = useState(0);

    const [RFE1, setRFE1] = useState(0);
    const [RFE2, setRFE2] = useState(0);
    const [RFE3, setRFE3] = useState(0);
    const [RFE4, setRFE4] = useState(0);
    const [RFE5, setRFE5] = useState(0);
    const [RFE6, setRFE6] = useState(0);

    const handleCantidadEmitidoChange = (event) => {

      setCantidadEmitido(event.target.value.replace(/[^0-9]/g, ''));
    
    };

    const handleValorNominalChange = (event) => {

      setValorNominal(event.target.value.replace(/[^0-9.]/g, ''));
    
    };

    const handleBaseImponibleChange = (event) => {

      setbaseImponible(event.target.value.replace(/[^0-9.]/g, ''));
    
    };

    const handleRetencionNoResidenteChange = (event) => {

      setRetencionNoResidente(event.target.value.replace(/[^0-9.]/g, ''));
    
    };

    const handleFB1Change = (event) => {setFB1(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleFE1Change = (event) => {setFE1(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFB1Change = (event) => {setRFB1(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFE1Change = (event) => {setRFE1(event.target.value.replace(/[^0-9.]/g, '')); };

    const handleFB2Change = (event) => {setFB2(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleFE2Change = (event) => {setFE2(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFB2Change = (event) => {setRFB2(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFE2Change = (event) => {setRFE2(event.target.value.replace(/[^0-9.]/g, '')); };

    const handleFB3Change = (event) => {setFB3(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleFE3Change = (event) => {setFE3(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFB3Change = (event) => {setRFB3(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFE3Change = (event) => {setRFE3(event.target.value.replace(/[^0-9.]/g, '')); };

    const handleFB4Change = (event) => {setFB4(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleFE4Change = (event) => {setFE4(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFB4Change = (event) => {setRFB4(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFE4Change = (event) => {setRFE4(event.target.value.replace(/[^0-9.]/g, '')); };

    const handleFB5Change = (event) => {setFB5(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleFE5Change = (event) => {setFE5(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFB5Change = (event) => {setRFB5(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFE5Change = (event) => {setRFE5(event.target.value.replace(/[^0-9.]/g, '')); };

    const handleFB6Change = (event) => {setFB6(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleFE6Change = (event) => {setFE6(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFB6Change = (event) => {setRFB6(event.target.value.replace(/[^0-9.]/g, '')); };
    const handleRFE6Change = (event) => {setRFE6(event.target.value.replace(/[^0-9.]/g, '')); };


    const classes = useStyles();
    const [circular, setCircular] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);

    useEffect(() => {
        fetchParametros();
    }, []);
 
  
    async function fetchParametros() {

        const apiData = await API.graphql({ query: getParametro , variables: { id: '1' } });

        const parametrosFromAPI = apiData.data.getParametro;    

        console.log('parametrosFromAPI', parametrosFromAPI)
        setCantidadEmitido(parametrosFromAPI.cantidadEmitida);
        setValorNominal(parametrosFromAPI.valorNominal);
        setbaseImponible(parametrosFromAPI.baseImponible);
        setRetencionNoResidente(parametrosFromAPI.noResidente);

        setFB1(parametrosFromAPI.IGdesde1);
        setFB2(parametrosFromAPI.IGdesde2);
        setFB3(parametrosFromAPI.IGdesde3);
        setFB4(parametrosFromAPI.IGdesde4);
        setFB5(parametrosFromAPI.IGdesde5);
        setFB6(parametrosFromAPI.IGdesde6);

        setFE1(parametrosFromAPI.IGhasta1);
        setFE2(parametrosFromAPI.IGhasta2);
        setFE3(parametrosFromAPI.IGhasta3);
        setFE4(parametrosFromAPI.IGhasta4);
        setFE5(parametrosFromAPI.IGhasta5);
        setFE6(parametrosFromAPI.IGhasta6);

        setRFB1(parametrosFromAPI.FBretencion1);
        setRFB2(parametrosFromAPI.FBretencion2);
        setRFB3(parametrosFromAPI.FBretencion3);
        setRFB4(parametrosFromAPI.FBretencion4);
        setRFB5(parametrosFromAPI.FBretencion5);
        setRFB6(parametrosFromAPI.FBretencion6);

        setRFE1(parametrosFromAPI.FEretencion1);
        setRFE2(parametrosFromAPI.FEretencion2);
        setRFE3(parametrosFromAPI.FEretencion3);
        setRFE4(parametrosFromAPI.FEretencion4);
        setRFE5(parametrosFromAPI.FEretencion5);
        setRFE6(parametrosFromAPI.FEretencion6);

    }

    //const apiDataUpdate =  async(nuevoSecuencial) => await API.graphql({ query: updateNumeroSecuencial, variables: { input: {id: '1', numerotitulo: nuevoSecuencial} } });

    const addCantidadEmitida = async () => {
        try {
            
            if (!cantidadEmitido) return
    
            setCircular(true);
    
            const operID = await API.graphql({ query: updateParametro, variables: { input: {id: '1', cantidadEmitida: cantidadEmitido, valorNominal: valorNominal, baseImponible: baseImponible, noResidente: retencionNoResidente,
            IGdesde1: FB1,
  IGhasta1: FE1,
  FBretencion1: RFB1,
  FEretencion1: RFE1,
  IGdesde2: FB2,
  IGhasta2: FE2,
  FBretencion2: RFB2,
  FEretencion2: RFE2,
  IGdesde3: FB3,
  IGhasta3: FE3,
  FBretencion3: RFB3,
  FEretencion3: RFE3,
  IGdesde4: FB4,
  IGhasta4: FE4,
  FBretencion4: RFB4,
  FEretencion4: RFE4,
  IGdesde5: FB5,
  IGhasta5: FE5,
  FBretencion5: RFB5,
  FEretencion5: RFE5,
  IGdesde6: FB6,
  IGhasta6: FE6,
  FBretencion6: RFB6,
  FEretencion6: RFE6,  

          } } });
    
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
                <Grid item xs={12} style={{display:'flex', flexDirection:'row', alignItems:'flex-start', justifyContent:'normal',}}>
                    <TextField
                        id="outlined-required1"
                        label="Total Emitido"
                        value={cantidadEmitido}
                        onChange={handleCantidadEmitidoChange}
                        style={{marginRight:20}}
                    /> 
                    <TextField
                        id="outlined-required2"
                        label="Valor Nominal"
                        value={valorNominal}
                        onChange={handleValorNominalChange}
                        style={{marginRight:20}}
                    /> 
                    <TextField
                        id="outlined-required3"
                        label="Base Imponible %"
                        value={baseImponible}
                        onChange={handleBaseImponibleChange}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-required4"
                        label="Retención No Residente %"
                        value={retencionNoResidente}
                        onChange={handleRetencionNoResidenteChange}
                        style={{marginRight:20}}
                        type="number"
                    />                                         
                    <Button onClick={addCantidadEmitida} size='small' variant='contained' color='primary' style={{marginLeft:20}}>Grabar</Button>
                </Grid>  

                <Grid item xs={12} style={{display:'flex', flexDirection:'row', alignItems:'flex-start', justifyContent:'normal', marginTop:'150px'}}>
                    <TextField
                        id="outlined-requiredFB1"
                        label="FB Desde"
                        value={FB1}
                        onChange={handleFB1Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredFE1"
                        label="FE Hasta"
                        value={FE1}
                        onChange={handleFE1Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFB1"
                        label="Retención Fracción Base"
                        value={RFB1}
                        onChange={handleRFB1Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFE1"
                        label="Retención Frección Excedente"
                        value={RFE1}
                        onChange={handleRFE1Change}
                        style={{marginRight:20}}
                        type="number"
                    />                                         
                </Grid>  

                <Grid item xs={12} style={{display:'flex', flexDirection:'row', alignItems:'flex-start', justifyContent:'normal', marginTop:'50px'}}>
                    <TextField
                        id="outlined-requiredFB2"
                        label="FB Desde"
                        value={FB2}
                        onChange={handleFB2Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredFE2"
                        label="FE Hasta"
                        value={FE2}
                        onChange={handleFE2Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFB2"
                        label="Retención Fracción Base"
                        value={RFB2}
                        onChange={handleRFB2Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFE2"
                        label="Retención Frección Excedente"
                        value={RFE2}
                        onChange={handleRFE2Change}
                        style={{marginRight:20}}
                        type="number"
                    />                                         
                </Grid>  

                <Grid item xs={12} style={{display:'flex', flexDirection:'row', alignItems:'flex-start', justifyContent:'normal', marginTop:'50px'}}>
                    <TextField
                        id="outlined-requiredFB3"
                        label="FB Desde"
                        value={FB3}
                        onChange={handleFB3Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredFE3"
                        label="FE Hasta"
                        value={FE3}
                        onChange={handleFE3Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFB3"
                        label="Retención Fracción Base"
                        value={RFB3}
                        onChange={handleRFB3Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFE3"
                        label="Retención Frección Excedente"
                        value={RFE3}
                        onChange={handleRFE3Change}
                        style={{marginRight:20}}
                        type="number"
                    />                                         
                </Grid>  

                <Grid item xs={12} style={{display:'flex', flexDirection:'row', alignItems:'flex-start', justifyContent:'normal', marginTop:'50px'}}>
                    <TextField
                        id="outlined-requiredFB4"
                        label="FB Desde"
                        value={FB4}
                        onChange={handleFB4Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredFE4"
                        label="FE Hasta"
                        value={FE4}
                        onChange={handleFE4Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFB4"
                        label="Retención Fracción Base"
                        value={RFB4}
                        onChange={handleRFB4Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFE4"
                        label="Retención Frección Excedente"
                        value={RFE4}
                        onChange={handleRFE4Change}
                        style={{marginRight:20}}
                        type="number"
                    />                                         
                </Grid>  

                <Grid item xs={12} style={{display:'flex', flexDirection:'row', alignItems:'flex-start', justifyContent:'normal', marginTop:'50px'}}>
                    <TextField
                        id="outlined-requiredFB5"
                        label="FB Desde"
                        value={FB5}
                        onChange={handleFB5Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredFE5"
                        label="FE Hasta"
                        value={FE5}
                        onChange={handleFE5Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFB5"
                        label="Retención Fracción Base"
                        value={RFB5}
                        onChange={handleRFB5Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFE5"
                        label="Retención Frección Excedente"
                        value={RFE5}
                        onChange={handleRFE5Change}
                        style={{marginRight:20}}
                        type="number"
                    />                                         
                </Grid>  

                <Grid item xs={12} style={{display:'flex', flexDirection:'row', alignItems:'flex-start', justifyContent:'normal', marginTop:'50px'}}>
                    <TextField
                        id="outlined-requiredFB6"
                        label="FB Desde"
                        value={FB6}
                        onChange={handleFB6Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredFE6"
                        label="FE Hasta"
                        value={FE6}
                        onChange={handleFE6Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFB6"
                        label="Retención Fracción Base"
                        value={RFB6}
                        onChange={handleRFB6Change}
                        style={{marginRight:20}}
                        type="number"
                    /> 
                    <TextField
                        id="outlined-requiredRFE6"
                        label="Retención Frección Excedente"
                        value={RFE6}
                        onChange={handleRFE6Change}
                        style={{marginRight:20}}
                        type="number"
                    />                                         
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