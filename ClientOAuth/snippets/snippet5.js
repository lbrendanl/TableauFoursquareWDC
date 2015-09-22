// Create tableau connector, should be called first
var myConnector = tableau.makeConnector();

// Init function for connector, called during every phase but
// only called when running inside the simulator or tableau
myConnector.init = function() {
	$("#getvenuesbutton").click(function() {
		tableau.connectionName = "Foursqure Venues Data";
		tableau.submit();
	})

	tableau.initCallback();
}

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

// Register the tableau connector, call this last
tableau.registerConnector(myConnector);
