// Called when web page first loads and when
// the OAuth flow returns to the page
//
// This function parses the access token in the URI if available
// It also adds a link to the foursquare connect button
$(document).ready(function() {
    var accessToken = parseAccessToken();
    var hasAuth = accessToken && accessToken.length > 0;
    updateUIWithAuthState(hasAuth);

    $("#connectbutton").click(function() {
        doAuthRedirect();
    });
});

// This helper function looks through the URL and
// returns the value of the access_token  parameter
// if it exists, false otherwise
function parseAccessToken() {
    var query = window.location.hash.substring(1);
    var vars = query.split("&");

    var ii;
    for (ii = 0; ii < vars.length; ++ii) {
       var pair = vars[ii].split("=");
       if (pair[0] == "access_token") { return pair[1]; }
    }

    return(false);
}