(function() {
  'use strict';

  // This config stores the important strings needed to
  // connect to the foursquare API and OAuth service
  //
  // Storing these here is insecure for a public app
  // See part II. of this tutorial for an example of how
  // to do a server-side OAuth flow and avoid this problem
  var config = {
      clientId: 'YOUR_CLIENT_ID',
      redirectUri: 'http://localhost:3333/redirect',
      authUrl: 'https://foursquare.com/',
      version: '20150901'
  };

  // Called when web page first loads and when
  // the OAuth flow returns to the page
  //
  // This function parses the access token in the URI if available
  // It also adds a link to the foursquare connect button
  $(document).ready(function() {
      var accessToken = Cookies.get("accessToken");
      var hasAuth = accessToken && accessToken.length > 0;
      updateUIWithAuthState(hasAuth);

      $("#connectbutton").click(function() {
          doAuthRedirect();
      });
  });

  // An on-click funcion for the connect to foursquare button,
  // This will redirect the user to a foursquare login
  function doAuthRedirect() {
      var url = config.authUrl + 'oauth2/authenticate?response_type=code&client_id=' + config.clientId +
              '&redirect_uri=' + config.redirectUri;
      window.location.href = url;
  }

  //------------- OAuth Helpers -------------//
  // This helper function returns the URI for the venueLikes endpoint
  // It appends the passed in accessToek to the call to personalize the call for the user
  function getVenueLikesURI(accessToken) {
      return "https://api.foursquare.com/v2/users/self/venuelikes?oauth_token=" +
              accessToken + "&v=" + config.version;
  }

  // This function togglels the label shown depending
  // on whether or not the user has been authenticated
  function updateUIWithAuthState(hasAuth) {
      if (hasAuth) {
          $(".notsignedin").css('display', 'none');
          $(".signedin").css('display', 'block');
      } else {
          $(".notsignedin").css('display', 'block');
          $(".signedin").css('display', 'none');
      }
  }

  //------------- Tableau WDC code -------------//
  // Create tableau connector, should be called first
  var myConnector = tableau.makeConnector();

  // Init function for connector, called during every phase but
  // only called when running inside the simulator or tableau
  myConnector.init = function() {
      // If we are in the auth phase we only want to show the UI needed for auth
      if (tableau.phase == tableau.phaseEnum.authPhase) {
        $("#getvenuesbutton").css('display', 'none');
      }
      
      var accessToken = Cookies.get("accessToken");
      console.log("Access token is '" + accessToken + "'");
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

  // Declare the data to Tableau that we are returning from Foursquare
  myConnector.getColumnHeaders = function() {
      var fieldNames = [
          "Name",
          "Latitude",
          "Longitude",
          "Checkin Count"
      ];

      var fieldTypes = [
          "string",
          "float",
          "float",
          "int"
      ];

      tableau.headersCallback(fieldNames, fieldTypes);
  };

  // This function acutally make the foursquare API call and
  // parses the results and passes them back to Tableau
  myConnector.getTableData = function(lastRecordToken) {
      var dataToReturn = [];
      var hasMoreData = false;

      var accessToken = tableau.password;
      var connectionUri = getVenueLikesURI(accessToken);

      var xhr = $.ajax({
          url: connectionUri,
          dataType: 'json',
          success: function (data) {
              if (data.response) {
                  var venues = data.response.venues.items;

                  var ii;
                  for (ii = 0; ii < venues.length; ++ii) {
                      var venue = {'Name': venues[ii].name,
                                   'Latitude': venues[ii].location.lat,
                                   'Longitude': venues[ii].location.lng,
                                   'Checkin Count': venues[ii].stats.checkinsCount};
                      dataToReturn.push(venue);
                  }

                  tableau.dataCallback(dataToReturn, lastRecordToken, hasMoreData);
              }
              else {
                  tableau.abortWithError("No results found");
              }
          },
          error: function (xhr, ajaxOptions, thrownError) {
              // If the connection fails, log the error and return an empty set.
              tableau.log("Connection error: " + xhr.responseText + "\n" + thrownError);
              tableau.abortWithError("Error while trying to connecto to Foursquare.");
          }
      });
  };

  // Register the tableau connector, call this last
  tableau.registerConnector(myConnector);
})();
