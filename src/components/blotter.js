import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import { listOperaciones } from './../graphql/queries';

import { DataGrid } from '@mui/x-data-grid';

import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Grid from '@material-ui/core/Grid';


const columns = [
    { field: 'id', headerName: 'Nro', width: 80, type: 'number',},
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 150,
    },
    {
      field: 'operacion',
      headerName: 'Operación',
      width: 180,
    },
    {
      field: 'cedente',
      headerName: 'Cedente',
      width: 180,
    },
    {
        field: 'acciones',
        headerName: 'Acciones',
        type: 'number',
        width: 150,
      },
      {
        field: 'cesionario',
        headerName: 'Cesionario',
        width: 180,
      },      
      {
        field: "Opciones",
        width: 180,
        renderCell: (cellValues) => {
          return <Link to={{
            pathname: "/",
            state: {
              accionistaId: cellValues.row.id,
            },
          }} >Revisar</Link>;
          //return <Link to='/transferencias' >Cesión</Link>;
          //return <Link href={`#${cellValues.row.url}`}>Cesión</Link>;
        }
      },
  ];
  
  const handleClick = (event, cellValues) => {
    console.log(cellValues.row);
  };

  const defaultTheme = createTheme();
  const useStyles = makeStyles(
    (theme) => ({
      root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      },
      textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%',
        },
        margin: theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5),
        },
        '& .MuiInput-underline:before': {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
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
        //padding: theme.spacing(0),
      },
    }),
    { defaultTheme },
  );
  

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

function QuickSearchToolbar(props) {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <TextField
          variant="standard"
          value={props.value}
          onChange={props.onChange}
          placeholder="Buscar operacion..."
          className={classes.textField}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
            endAdornment: (
              <IconButton
                title="Clear"
                aria-label="Clear"
                size="small"
                style={{ visibility: props.value ? 'visible' : 'hidden' }}
                onClick={props.clearSearch}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
        />
      </div>
    );
  }
  
  QuickSearchToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };
  

  export default function Blotter() {

    const [operaciones, setOperaciones] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        
      fetchOperaciones();
    }, [operaciones]);
   
    
    async function fetchOperaciones() {
      const apiData = await API.graphql({ query: listOperaciones });
      const operacionesFromAPI = apiData.data.listOperaciones.items;
      await Promise.all(operacionesFromAPI.map(async accionista => {
      return accionista;
      }))
      setOperaciones(apiData.data.listOperaciones.items);
      if(count == 0)
        {      
        setCount(1);
        setRows(apiData.data.listOperaciones.items);
        }

    }

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = operaciones.filter((row) => {
          return Object.keys(row).some((field) => {

            if (row[field] != null) {
            return searchRegex.test(row[field].toString());
            }
          });
        });
        setRows(filteredRows);
      };




  const classes = useStyles();
  return (
    <main className={classes.content}>
    <div className={classes.appBarSpacer} />
      <Grid container spacing={0}>

        <Grid item xs={12} md={8} lg={9}>
      <ButtonGroup size="small" aria-label="small outlined button group" style={{paddingBottom: 10}}>
        <Button color="secondary" variant="contained">Pendientes</Button>
        <Button>Rechazadas</Button>
        <Button>Aprobadas</Button>
        <Button>Anuladas</Button>
        </ButtonGroup>
      <DataGrid
        //disableColumnMenu 
        components={{ Toolbar: QuickSearchToolbar }}
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20]}
        componentsProps={{
            toolbar: {
              value: searchText,
              onChange: (event) => requestSearch(event.target.value),
              clearSearch: () => requestSearch(''),
            },
          }}
      />
           </Grid>
         </Grid>

      </main>

  );
}