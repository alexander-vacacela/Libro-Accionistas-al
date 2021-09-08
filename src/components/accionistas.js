import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { listAccionistas } from './../graphql/queries';
import Container from '@material-ui/core/Container';

import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';


function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    paddingTop: theme.spacing(10),
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',   
  },

}));

export default function Accionistas() {

    const [accionistas, setAccionistas] = useState([]);
  
    useEffect(() => {
      fetchAccionistas();
    }, []);
  
    async function fetchAccionistas() {
      const apiData = await API.graphql({ query: listAccionistas });
      const accionistasFromAPI = apiData.data.listAccionistas.items;
      await Promise.all(accionistasFromAPI.map(async accionista => {
      return accionista;
      }))
      setAccionistas(apiData.data.listAccionistas.items);
    }


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };


  const handleClick = (id) => {
    console.log("cell clicked", id)
}

const handleActionClose = (id, event) => {
  //let { anchorEls } = this.state;
  setAnchorEl(null);
  //anchorEls[id] = null;
  //this.setState({ anchorEls });
  console.log("cell clicked", id)
}

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nro</TableCell>
            <TableCell>Identificación</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Nacionalidad</TableCell>
            <TableCell align="right">Acciones</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="right">Capital USD</TableCell>
            <TableCell align="right">Participación %</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Operación</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accionistas.map((accionista) => (
            <TableRow key={accionista.id}>
              <TableCell>{accionista.id}</TableCell>
              <TableCell>{accionista.identificacion}</TableCell>
              <TableCell>{accionista.nombre}</TableCell>
              <TableCell>{accionista.paisNacionalidad}</TableCell>
              <TableCell align="right">{accionista.cantidadAcciones}</TableCell>
              <TableCell>{accionista.tipoAcciones}</TableCell>
              <TableCell align="right">{((parseFloat(accionista.cantidadAcciones) * 2.15) / 0.18).toFixed(2)}</TableCell>
              <TableCell align="right">{(parseFloat(accionista.cantidadAcciones) / 17000.00).toFixed(10)}</TableCell>
              <TableCell>{accionista.estado}</TableCell>
              <TableCell>
              <div>
                <IconButton
                  aria-label="acciones"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id={accionista.id}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>                    
                    <Link to={{ pathname: "/cesion",
                                state:  {
                                  cedenteId: true,
                                        },
                              }}>
                      Cesión
                      </Link>
                    </MenuItem>
                  <MenuItem onClick={handleClose}>Posesión Efectiva</MenuItem>
                  <MenuItem onClick={handleClose}>Partición</MenuItem>
                  <MenuItem onClick={handleClose}>Testamento</MenuItem>
                  <MenuItem onClick={handleClose}>Donación</MenuItem>
                  <MenuItem onClick={e => handleActionClose(accionista.id, e)}>Bloqueo</MenuItem>
                </Menu>
              </div>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

  );
}