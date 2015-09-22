// Called when web page first loads and when
// the OAuth flow returns to the page
//
// This function parses the access token in the URI if available
// It also adds a link to the foursquare connect button
$(document).ready(function() {
	var accessToken = parseAccessToken()
	var hasAuth = accessToken && accessToken.length > 0;
	updateUIWithAuthState(hasAuth)

	$("#connectbutton").click(function() {
		doAuthRedirect();
	})
});

// This helper function parses the URI and grabs
// the access_token parameter and returns it
function parseAccessToken() {
	uri = window.location.href;
	search = '#access_token=';
	start = uri.indexOf(search);
	var accessToken = false
	if (start > 0) {
		start = start + search.length
		accessToken = uri.slice(start);
	}

	return accessToken
}
