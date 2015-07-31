// Update the following two variables to point this REST call somewhere else
var source = "gf auto";
gs.log(current.number + ": Update Blueprint", source);

var restMessagePrototypeName = 'GF Auto - Agility Blueprint APIs - Prod';
var midServerName = gs.getProperty('pnc.gfe.rest_message_scripted.mid_server_name');

gs.log(current.number + ": Update Blueprint: midServerName: " + midServerName, source);

// We are using a custom REST class here allowing us to pass a dynamically generated XML payload
try {

	var blueprint_id = workflow.scratchpad.cloned_blueprint_id.toString();
	var xml = workflow.scratchpad.updated_blueprint_xml.toString();
	var r = new RESTMessageScripted('put', '', restMessagePrototypeName);
	r.addHeader('Content-Type', 'application/xml');
	r.setMIDServer(midServerName);
	r.setStringParameter('blueprint_id', blueprint_id);
	r.setContent(xml);
	var response = r.execute();

	//Because we're making the REST call through a MID Server, we need to wait for the response...
	var k = 1;
	while (response == null) {
		gs.print("waiting ... " + k + " seconds");
		response = r.getResponse(1000);
		k++;

		if (k > 120) {
			gs.print('service timeout');
			break;
		}
	}

	if (response) {
		var responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
		var httpStatus = response.getStatusCode();

		if (parseInt(Number(httpStatus)) != 200) {
			activity.state = 'faulted';

			workflow.scratchpad.error_source = 'Update Blueprint REST';
			workflow.scratchpad.error_message = 'Could not update Agility blueprint due to REST API call error: (' + httpStatus + ') ' + responseBody;

		}
		gs.log(current.number + ": Update Blueprint : HTTP Status : " + httpStatus + ': Response : ' + responseBody, source);

	} else {
		activity.state = 'faulted';
		gs.log(current.number + ": Update Blueprint : Error : Update Blueprint failed due to service timeout.", source);

		workflow.scratchpad.error_source = 'Update Blueprint REST';
		workflow.scratchpad.error_message = 'Could not update Agility blueprint due to service call timeout.';

	}
} catch (ex) {
	activity.state = 'faulted';
	gs.log(current.number + ": Update Blueprint : Error : " + ex.message, source);

	workflow.scratchpad.error_source = 'Update Blueprint REST';
	workflow.scratchpad.error_message = 'Could not update Agility blueprint: ' + ex.message;
}