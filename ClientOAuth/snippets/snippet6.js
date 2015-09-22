// This helper function returns the URI for the venueLikes endpoint
// It appends the passed in accessToken to the call to personalize the call for the user
getVenueLikesURI = function(accessToken) {
	return "https://api.foursquare.com/v2/users/self/venuelikes?oauth_token="
				+ accessToken + "&v=" + config.version;
}

// This function acutally make the foursquare API call and 
// parses the results and passes them back to Tableau
myConnector.getTableData = function(lastRecordToken) {
	var dataToReturn = [];
	var hasMoreData = false;

	var accessToken = parseAccessToken();
	var hasAuth = accessToken && accessToken.length > 0;
	var connectionUri = getVenueLikesURI(accessToken);

	var xhr = $.ajax({
		url: connectionUri,
		dataType: 'json',
		success: function (data) {
				if (data.response) {
						var venues = data.response.venues;

						// Our auth test call has a slightly different schema
						if (hasAuth) {
							venues = data.response.venues.items;
						}

						var ii;
						for (ii = 0; ii < venues.length; ++ii) {
								var venue = {'Name': venues[ii].name,
														 'Latitude': venues[ii].location.lat,
														 'Longitude': venues[ii].location.lng,
													 	 'Checkin Count': venues[ii].stats.checkinsCount};
								dataToReturn.push(venue);
						}
						tableau.dataCallback(dataToReturn, lastRecordToken, false);
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
