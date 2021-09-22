import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import { listAccionistas } from '../graphql/queries';

import { DataGrid } from '@mui/x-data-grid';

import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import Grid from '@material-ui/core/Grid';

const columns = [
    { field: 'id', headerName: 'Nro', width: 80, type: 'number',},
    {
      field: 'identificacion',
      headerName: 'Identificacion',
      width: 150,
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 180,
      flex: 1 ,
    },
    {
      field: 'paisNacionalidad',
      headerName: 'Nacionalidad',
      width: 150,
    },
    {
        field: 'cantidadAcciones',
        headerName: 'Acciones',
        type: 'number',
        width: 120,
      },
      {
        field: 'tipoAcciones',
        headerName: 'Tipo',
        width: 90,
      },      
      {
        field: 'estado',
        headerName: 'Estado',
        width: 110,
      },      
      {
        field: "Operaciones",
        width: 180,
        renderCell: (cellValues) => {
          return <Link to={{
            pathname: "/transferencias",
            state: {
              accionistaId: cellValues.row.id,
            },
          }} >Cesión</Link>;
        }
      },
  ];
  
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
        ...theme.mixins.toolbar,
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing(2),        
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
          placeholder="Buscar accionista…"
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
  

  export default function Accionistas() {

    const [accionistas, setAccionistas] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {

      fetchAccionistas();


    }, [accionistas]);
   
    async function fetchAccionistas() {
      const apiData = await API.graphql({ query: listAccionistas });
      const accionistasFromAPI = apiData.data.listAccionistas.items;

      //await Promise.all(accionistasFromAPI.map(async accionista => {
      //return accionista;
      //}))

      setAccionistas(accionistasFromAPI);
      if(count === 0)
        {      
        setCount(1);
        setRows(accionistasFromAPI);
        }

    }

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = accionistas.filter((row) => {
          return Object.keys(row).some((field) => {
            //if (row[field] != null) {
            return row[field] && searchRegex.test(row[field].toString());
            //}

          });
        });
        setRows(filteredRows);
      };




  const classes = useStyles();
  return (
    <main className={classes.content}>
    <div className={classes.appBarSpacer} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
      <DataGrid
                          density="compact"             
                          autoHeight='true'
                          autoPageSize='true'
        disableColumnMenu 
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