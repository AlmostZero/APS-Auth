
var express = require( 'express' );           // For web server
var axios = require( 'axios' );               // A Promised base http client
var bodyParser = require( 'body-parser' );    // Receive JSON format

// APS oAuth package
const
    {
        SdkManagerBuilder
    } = require( '@aps_sdk/autodesk-sdkmanager' );
const
    {
        AuthenticationClient,
        Scopes,
        ResponseType
    } = require( '@aps_sdk/authentication' );
const
    {
        DataManagementClient
    } = require( '@aps_sdk/data-management' );

const sdkManager = SdkManagerBuilder.create().build();
const authenticationClient = new AuthenticationClient( sdkManager );
const dataManagementClient = new DataManagementClient( sdkManager );
const config = require( './config' );

// Set up Express web server
var app = express();
app.use( bodyParser.json() );
app.use( express.static( __dirname + '/www' ) );

// This is for web server to start listening to port 5000
app.set( 'port', 5000 );
var server = app.listen( app.get( 'port' ), function () {
    console.log( 'Server listening on port ' + server.address().port );
} );

//-------------------------------------------------------------------
// Configuration for your Forge account
// Initialize the 3-legged OAuth2 client, and
// set specific scopes
//-------------------------------------------------------------------
var FORGE_CLIENT_ID = process.env.FORGE_CLIENT_ID;          // Get from env or replace with your ID
var FORGE_CLIENT_SECRET = process.env.FORGE_CLIENT_SECRET;  // Get from env or replace with your secret
var FORGE_CALLBACK_URL = 'http://localhost:5000/callback';
var scopes = 'data:read data:write';
const querystring = require( 'querystring' );

// Route /auth
// Redirect to Autodesk sign in page for end user to login
app.get( '/auth', function ( req, res ) {
    // var redirect_uri = 'https://developer.api.autodesk.com/authentication/v1/authorize?'
    // + 'response_type=code'
    // + '&client_id=' + FORGE_CLIENT_ID
    // + '&redirect_uri=' + encodeURIComponent(FORGE_CALLBACK_URL)
    // + '&scope=' + encodeURIComponent(scopes);

    const url = authenticationClient.authorize(
        config.credentials.client_id,
        ResponseType.Code,
        config.callbackURL,
        [
            Scopes.DataRead,
            Scopes.DataCreate,
            Scopes.ViewablesRead
        ],
    );
    res.redirect( url );
} );

// Route /callback
// Get Authorization code from Autodesk signin
app.get( '/callback', async function ( req, res ) {

    const code = req.query.code;
    console.log( code );
    res.redirect( '/' );

} );

// app.get( '/callback', function ( req, res ) {

//     const code = req.query.code;

//     axios( {
//         method: 'POST',
//         url: 'https://developer.api.autodesk.com/authentication/v2/token',
//         headers: {
//             'content-type': 'application/x-www-form-urlencoded',
//             'Authorization': 'Basic b1djQXk0UVRqb2Q1akJRdFBmMzdYY2NRR0VzQWxjdkJUTmtKMVk5MklZdkkwZzZtOjBGWVNKNEpGNUExazFqQVluR1dNWmx1WDYwdGJiSW9GTU1INTFRUVcyWjhzb2p3dUtnUVVsR1RhcjZGS25tVlc=',
//         },
//         data: querystring.stringify( {
//             grant_type: 'grant_type=authorization_code',
//             code: code,
//             redirect_uri: config.callbackURL
//         } )
//     } )
//         .then( function ( response ) {
//             // Success
//             access_token = response.data.access_token;
//             //console.log( response );
//             res.send( '<p>Authentication success! Here is your token:</p>' + access_token );
//         } )
//         .catch( function ( error ) {
//             // Failed
//             //console.log( error );
//             res.send( 'Failed to authenticate' );
//         } );
// } );
