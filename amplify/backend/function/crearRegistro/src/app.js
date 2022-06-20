/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

//import { LEDGER_NAME_PROD, LEDGER_NAME_STAG, LEDGER_NAME_DEV, ENV_PROD, ENV_STAG, ENV_DEV } from "./Constants";

const LEDGER_NAME_PROD = "prodLibroLedger";
//const LEDGER_NAME_STAG = "prodLibroLedger";
//const LEDGER_NAME_DEV = "prodLibroLedger";

//const LEDGER_NAME_PROD = "myLedgerPrueba";
const LEDGER_NAME_STAG = "myLedgerPrueba";
const LEDGER_NAME_DEV = "myLedgerPrueba";

const ENV_PROD = "prod";
const ENV_STAG = "staging";
const ENV_DEV = "dev";

const LEDGER = process.env.ENV == ENV_PROD ? LEDGER_NAME_PROD : process.env.ENV == ENV_STAG ? LEDGER_NAME_STAG : LEDGER_NAME_DEV;

var express = require('express')
//var bodyParser = require('body-parser')
//var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

/////////////////////////////
var qldb = require('amazon-qldb-driver-nodejs');
//const { getLicence } = require('./registro');

// Load the AWS SDK for node.js
var AWS = require("aws-sdk");
// Configure the SDK by setting the global configuration using 
//AWS.Config
var myConfig = new AWS.Config();
//myConfig.update({ region: "us-east-2" });




const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () =>
  console.log(`App server listening at http://localhost:${port}`)
);
//app.get("/", (req, res) => res.send("Welcome to Express!"));

//////////////////////////////



/*

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
*/
// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  //res.header("Access-Control-Allow-Headers", "*") 

  //res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "1800");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 

  /* 
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-Token")
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")  
  res.header("Access-Control-Allow-Origin", "http://localhost")  
  res.header("Access-Control-Allow-Origin", "https://localhost")  */
  next()
});
/*
app.listen(3000, function() {
  console.log("App started")
});
*/
/**********************
 * Example get method *
 **********************/

app.get('/registro', function(req, res) {

  const driver = new qldb.QldbDriver(LEDGER, myConfig);

  const query = req.query;
  // or
  // const query = req.apiGateway.event.queryStringParameters
  /*
  res.json({
    event: query.id, // to view all event data
    query: query,
    hash: LEDGER,
  });
*/
  //console.log("PARAMETRO identificacion ", req.query.identificacion);      
 
  driver
    .executeLambda(async (txn) => {
      return txn.execute(
        "SELECT * FROM _ql_committed_Accionista WHERE data.id = ?",query.id
      );
    })
    .then((result) => {
      const resultList = result.getResultList();
      //Pretty print the result list
      //console.log("The result List is ", JSON.stringify(resultList, null, 2));      
      res.send(JSON.stringify(resultList, null, 2));

    })
    .then((result) => {
      driver.close();
    });

  
  //const response = await getLicence("xxx");

  // Add your code here
  /*
  const people =[
    {name : 'Jorge Yamashiro', age : 45},
    {name : 'Jenny Garcia', age : 40},

  ]
  //res.json({success: 'get call succeed!', url: req.url});
  res.json({success: 'get call succeed!', people});
*/

});



app.get('/crearRegistro-prod', function(req, res) {

  const driver = new qldb.QldbDriver(LEDGER, myConfig);

  const query = req.query;
  // or
  // const query = req.apiGateway.event.queryStringParameters
  /*
  res.json({
    event: query.id, // to view all event data
    query: query,
    hash: LEDGER,
  });
*/
  //console.log("PARAMETRO identificacion ", req.query.identificacion);      
 
  driver
    .executeLambda(async (txn) => {
      return txn.execute(
        "SELECT * FROM _ql_committed_Accionista WHERE data.id = ?",query.id
      );
    })
    .then((result) => {
      const resultList = result.getResultList();
      //Pretty print the result list
      //console.log("The result List is ", JSON.stringify(resultList, null, 2));      
      res.send(JSON.stringify(resultList, null, 2));
      //res.status("200");
    })
    .then((result) => {
      driver.close();
    });

  
  //const response = await getLicence("xxx");

  // Add your code here
  /*
  const people =[
    {name : 'Jorge Yamashiro', age : 45},
    {name : 'Jenny Garcia', age : 40},

  ]
  //res.json({success: 'get call succeed!', url: req.url});
  res.json({success: 'get call succeed!', people});
*/

});



app.get('/registro/*', function(req, res) {

  const driver = new qldb.QldbDriver(LEDGER, myConfig);
  //const identificacion = req.params.identificacion;
  //const accionista = req.body;
  //const identificacion = '590037933';
  const query = req.body;
  // or
  // const query = req.apiGateway.event.queryStringParameters  

  driver
    .executeLambda(async (txn) => {
      return txn.execute(
        //"SELECT * FROM history(Accionista)",
        "SELECT * FROM history(Accionista) WHERE data.id = ?",
        query.identificacion,
      );
    })
    .then((result) => {
      const resultList = result.getResultList();
      //Pretty print the result list
      //console.log("The result List is ", JSON.stringify(resultList, null, 2));
      res.send(JSON.stringify(resultList, null, 2));
      //res.send(query);
    })
    .then((result) => {
      driver.close();
    });

  /*
  // Add your code here
  const people =[
    {name : 'Jorge Yamashiro', age : 45},
    {name : 'Jenny Garcia', age : 40},
    {name : 'Danna Yamashiro', age : 8},
    {name : 'Emma Yamashiro', age : 4},
  ]  

  const proceso = process.env.ENV;
  //res.json({success: 'get call succeed!', url: req.url});
  res.json({success: 'get call succeed!', people, proceso});
*/  
});

/*
app.get("/registro/identificacion", (req, res) => {
  //const driver = new qldb.QldbDriver("my-store-ledger", myConfig);
  const driver = new qldb.QldbDriver(LEDGER, myConfig);
  const identificacion = req.params.identificacion;
  driver
    .executeLambda(async (txn) => {
      return txn.execute(
        "SELECT * FROM history(Accionista) WHERE data.id = ?",
        identificacion
      );
    })
    .then((result) => {
      const resultList = result.getResultList();
      //Pretty print the result list
      console.log("The result List is ", JSON.stringify(resultList, null, 2));
      res.send(JSON.stringify(resultList, null, 2));
    })
    .then((result) => {
      driver.close();
    });
});
*/

/****************************
* Example post method *
****************************/

app.post('/registro', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/registro/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/
/*
app.put('/registro', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});
*/

app.put('/registro', function(req, res) {
  const driver = new qldb.QldbDriver(LEDGER, myConfig);
  const accionista = req.body;
  driver
    .executeLambda((txn) => {
      return txn.execute(
        "UPDATE Accionista SET nombre = ? , cantidadAcciones = ?, estado = ?  WHERE id = ?",
        accionista.nombre,
        accionista.cantidadAcciones,
        accionista.estado,
        accionista.id,
      );
    })
    .then((result) => {
      //res.send(JSON.stringify("{result: 'Person updated Successfully!'}"));
      const resultList = result.getResultList();
      //Pretty print the result list
      //console.log("The result List is ", JSON.stringify(resultList, null, 2));      
      res.send(JSON.stringify(resultList, null, 2));

    })
    .then((result) => {
      driver.close();
    });
});

app.put('/registro/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/registro', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/registro/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});



// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
