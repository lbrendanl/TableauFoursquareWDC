// Init function for connector, called during every phase but
// only called when running inside the simulator or tableau
myConnector.init = function() {
    // If we are in the auth phase we only want to show the UI needed for auth
    if (tableau.phase == tableau.phaseEnum.authPhase) {
        $("#getvenuesbutton").css('display', 'none');
    }
    
    var accessToken = parseAccessToken();
    var hasAuth = (accessToken && accessToken.length > 0) || tableau.password.length > 0;
    updateUIWithAuthState(hasAuth);

    $("#getvenuesbutton").click(function() {
        tableau.connectionName = "Foursqure Venues Data";

        // This tells tableau that during a refresh, you may need to
        // reprompt a user for their OAuth credentials
        tableau.alwaysShowAuthUI = true;
        tableau.submit();
    });

    tableau.initCallback();

    // If we are not in the data gathering phase, we want to store the token
    // This allows us to access the token in the data gathering phase
    if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
        if (hasAuth) {
            tableau.password = accessToken;
            
            if (tableau.phase == tableau.phaseEnum.authPhase) {
                // Auto-submit here if we are in the auth phase
                tableau.submit()
            }
            
            return;
        }
    }
};
