import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom"


import { createTheme,ThemeProvider } from '@material-ui/core/styles';
//import { ThemeProvider } from "@material-ui/styles";
import cyan from '@material-ui/core/colors/cyan';
import orange from '@material-ui/core/colors/orange';
import CssBaseline from "@material-ui/core/CssBaseline";

import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);


const myTheme = createTheme({
  palette: {
    primary: {
      main: cyan[500],
      contrastText: '#fff',
    },
    
    secondary: {
      main: orange[300],
    }, 
    background: {
      default: '#f9f9f9',

    }
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 12,
  },
});


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
