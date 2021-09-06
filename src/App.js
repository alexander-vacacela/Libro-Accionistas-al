import React, { useState, useEffect } from 'react';
import './App.css';
import {AmplifyAuthContainer, AmplifyAuthenticator, AmplifySignOut,AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Header from './components/header';
import logo from './images/logoUNACEMmedMarco.jpg';

import { Switch, Route, Link } from "react-router-dom";

import Orders from "./components/orders";
import Deposits from "./components/deposits";
import Dashboard from "./components/dashboard";


function App() {

    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();
  
    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);
    

    return authState === AuthState.SignedIn && user ? (
        <div className="App">        
            <Header/>

            <Switch>
              <Route path="/orders">
                <Orders/>
              </Route>
              <Route path="/deposits">
                <Deposits />
              </Route>
              <Route path="/">
                <Dashboard />
              </Route>
            </Switch>

        </div>
    ) : (
      <div style={{backgroundColor:"white",  backgroundImage: `url(${logo})`, backgroundRepeat: "no-repeat"}}>         
        <AmplifyAuthContainer>
          <AmplifyAuthenticator>        
            <AmplifySignIn
              hideSignUp="true" 
              slot="sign-in" 
              headerText="Libro de Accionistas"
              submitButtonText="Iniciar Sesión"            
              />
          </AmplifyAuthenticator>
        </AmplifyAuthContainer>
    </div>
  );

}

export default App;
