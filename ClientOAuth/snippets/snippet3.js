// Called when web page first loads and when
// the OAuth flow returns to the page
//
// This function adds a link to the foursquare connect button
$(document).ready(function() {
    var accessToken = false;
    var hasAuth = accessToken && accessToken.length > 0;
    updateUIWithAuthState(hasAuth);

    $("#connectbutton").click(function() {
        doAuthRedirect();
    });
});

// An on-click funcion for the connect to foursquare button,
// This will redirect the user to a foursquare login
function doAuthRedirect() {
    var url = config.authUrl + 'oauth2/authenticate?response_type=token&client_id=' + config.clientId +
            '&redirect_uri=' + config.redirectUri;
    window.location.href = url;
}