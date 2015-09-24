// This config stores the important strings needed to
// connect to the foursquare API and OAuth service
//
// Storing these here is insecure for a public app
// See part II. of this tutorial for an example of how
// to do a server-side OAuth flow and avoid this problem
var config = {
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    redirectUri: 'http://localhost:8888/Examples/foursquare.html',
    authUrl: 'https://foursquare.com/',
    version: '20150901'
};