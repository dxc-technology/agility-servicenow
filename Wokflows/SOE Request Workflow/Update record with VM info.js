/*
 * Update hostnames variable based on what's received in the callback or read from Agility directly
 */

try {
	var payload = current.variables.provisioning_soe_callback;
	
	if (payload) {
		current.variables.soe_hostnames = getHostnames(payload);
		current.update();
		gs.log(current.number + ": Updated request record with hostnames : " + current.variables.soe_hostnames, "gf auto");
	} else {
		throw "Payload from callback was not received or it was not available via direct call to Agility";
	}
} catch (ex) {
	
	workflow.scratchpad.error_message = ex.message;
	workflow.scratchpad.error_source = "Update record with VM info";
	
	gs.log(current.number + ": Update record with VM info: Error : " + ex.message, "gf auto");
	activity.state = 'faulted';
}

// Extract "hostname (IP address)"" from the payload.  Concat values into a comma separated list.
function getHostnames(callbackPayload) {
	
	var parser = new JSONParser();
	var hostnames = '';
	
	
	var payload = parser.parse(callbackPayload);
	
	if (payload && payload.hosts) {
		var hosts = payload.hosts;
		
		for (var i = 0; i < hosts.length; i++) {
			hostnames = hostnames + ((hostnames === '') ? '' : ', ') + hosts[i].name + ' (' + hosts[i].ip + ')';
		}
		
	}
	
	return hostnames;
}