myConnector.init = function() {
	var accessToken = parseAccessToken()
	console.log("Access token is '" + accessToken + "'");
	var hasAuth = (accessToken && accessToken.length > 0) || tableau.password.length > 0;
	updateUIWithAuthState(hasAuth)

	$("#getvenuesbutton").click(function() {
		tableau.connectionName = "Foursqure Venues Data";
		tableau.submit();
	})

	// If we are not in the data gathering phase, we want to store the token
	// This allows us to access the token in the data gathering phase
	if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
		if (hasAuth) {
			tableau.initCallback();
			tableau.password = accessToken;

			return;
		}
	}

	tableau.initCallback();
}
