// Update the following two variables to point this REST call somewhere else
var restMessagePrototypeName = 'GF Auto - Agility Blueprint APIs - Prod';
var midServerName = 'Integration POC WITM001A';

var source = "gf auto";
gs.log(current.number + ": Update Blueprint", source);

// We are using a custom REST class here allowing us to pass a dynamically generated XML payload
try{
	var blueprint_id = workflow.scratchpad.cloned_blueprint_id.toString();
	var xml = workflow.scratchpad.updated_blueprint_xml.toString();	
	var r = new RESTMessageScripted('put', '', restMessagePrototypeName);
	r.addHeader('Content-Type', 'application/xml')
	r.setMIDServer(midServerName);
	r.setStringParameter('blueprint_id', blueprint_id);
	r.setContent(xml);
	
	var response = r.execute();

	//Because we're making the REST call through a MID Server, we need to wait for the response...
	var k = 1;
	while ( response == null ) {
	   gs.print( "waiting ... " + k + " seconds");
	   response = r.getResponse( 1000 );
	   k++;
	 
	   if ( k > 30 ) {
	      gs.print( 'service timeout' );
	      break;
	   }
	}

	if(response) {
		var responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
		var httpStatus = response.getStatusCode();

		gs.log(current.number + ": Update Blueprint : HTTP Status : " + httpStatus + ': Response : ' + responseBody, source);
		workflow.scratchpad.httpStatus = httpStatus;

		activity.state == 'success';

		if(2 != parseInt(Number(httpStatus) / 100)) {
			activity.state == 'faulted';
		}
	} else {
		throw "Update Blueprint failed due to service timeout"
	}
} catch(ex) {
	activity.state == 'faulted';
	workflow.scratchpad.ErrorMessage = ex.message;
	gs.log(current.number + ": Updated blueprint : Error : " + ex.message, source);
}