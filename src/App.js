import React, { useState, useEffect } from 'react';
import {AmplifyAuthContainer, AmplifyAuthenticator,AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Switch, Route, Redirect } from "react-router-dom";
import logo from './images/logoUNACEMmedMarco.jpg';

import Accionistas from './views/accionistas';
import Cesion from './views/cesion'
import Operaciones from './views/blotter';
import Layout from './components/layout';
import PersonaNatural from './views/personanatural';
import PersonaJuridica from './views/personajuridica';
import PosesionEfectiva from './views/posesionefectiva';
import Pdf from './components/pdf';
import Canje from './views/canje';
import Bloqueo from './views/bloqueo';
import Desbloqueo from './views/desbloqueo';
import Testamento from './views/testamento';
import Donacion from './views/donacion';
import Parametros from './views/parametros';
import Reportes from './views/reportes';
import Asambleas from './views/asambleas';
import Dividendos from './views/dividendos';
import AccionistaDashboard from './views/accionista-dashboard'

function App() {

    const [authState, setAuthState] = useState();
    const [user, setUser] = useState();
    const [perfil, setPerfil] = useState();
  
    useEffect(() => {

        return onAuthUIStateChange((nextAuthState, authData) => {

            setAuthState(nextAuthState);            
            setUser(authData)
            
            if(typeof(authData) !== 'undefined')
            {
              if(authData.signInUserSession != null)
              {
                //console.log("DATA USER", authData.signInUserSession);
                setPerfil(authData.signInUserSession.accessToken.payload['cognito:groups'][0]);              
              }
            }
            //setPerfil((typeof(authData.signInUserSession) !== 'undefined')  ? authData.signInUserSession.accessToken.payload['cognito:groups'][0] : "");
        });
    }, []);
    

    return authState === AuthState.SignedIn && user ? perfil === "Accionista" ? (
      <div>            
      <Layout>
        <Switch>
          <Route path="/accionistadashboard">
            <AccionistaDashboard />
          </Route>                
          <Route path="/">
            <Redirect to="/accionistadashboard" />
          </Route>
        </Switch>
      </Layout>
    </div>
    ) : (
        <div>            
          <Layout>
            <Switch>             
              <Route path="/dividendos">
                <Dividendos />
              </Route>  
              <Route path="/asambleas">
                <Asambleas />
              </Route>  
              <Route path="/reportes">
                <Reportes />
              </Route>                                 
              <Route path="/parametros">
                <Parametros />
              </Route>                                 
              <Route path="/testamento">
                <Testamento />
              </Route>                   
              <Route path="/donacion">
                <Donacion />
              </Route>                    
              <Route path="/desbloqueo">
                <Desbloqueo />
              </Route>                       
              <Route path="/bloqueo">
                <Bloqueo />
              </Route>                   
              <Route path="/canje">
                <Canje />
              </Route>     
              <Route path="/posesionefectiva">
                <PosesionEfectiva />
              </Route>                
              <Route path="/personajuridica">
                <PersonaJuridica />
              </Route>                
              <Route path="/personanatural">
                <PersonaNatural />
              </Route>              
              <Route path="/accionistas">
                <Accionistas />
              </Route>
              <Route path="/cesion">
                <Cesion />
              </Route>
              <Route path="/blotter">
                <Operaciones/>
              </Route>
              <Route path="/">
                <Redirect to="/blotter" />
              </Route>
            </Switch>
          </Layout>
        </div>
    ) : (
      <div style={{backgroundColor:"white",  backgroundImage: `url(${logo})`, backgroundRepeat: "no-repeat"}}>         
        <AmplifyAuthContainer>
          <AmplifyAuthenticator       style={{
        display: 'flex',
        justifyContent: 'right',
        marginRight:50,
      }}>        
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
