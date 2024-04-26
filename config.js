'use strict';

require( 'dotenv' ).config();

const APSBaseUrl = 'https://developer.api.autodesk.com'

module.exports = {
    credentials: {
        client_id: process.env.APS_CLIENT_ID || '',
        client_secret: process.env.APS_CLIENT_SECRET || '',
        token_3legged: ''
    },

    callbackURL: process.env.APS_CALLBACK_URL || '',

    // Required scopes for your application on server-side
    scopeInternal: [ 'data:read' ],
    // Required scope of the token sent to the client
    scopePublic: [ 'viewables:read' ],


};