// Check provisioning status by directly calling Agility's task APIs
var restMessageTopologyGetName = 'GF Auto - Agility Topology Get - Prod';
var restMessageTemplateGetName = 'GF Auto - Agility Template Get - Prod';
var restMessageInstanceGetName = 'GF Auto - Agility Instance Get - Prod';

var topologyRefXML = activity.output;
var source = "gf auto";

try {
	
	var payload = getProvisionedHosts(topologyRefXML);
	var status = getProvisioningStatus(payload);
	activity.result = status;
	
	if (status == 'failed') {
		var snJSON = JSON;
		var payloadStr = new snJSON().encode(payload);
		current.variables.provisioning_error_message = "One of the instances requested encountered errors during provisioning process: " + payloadStr;
		current.variables.provisioning_status = status;
		current.update();
	} else {
		
		if (status == 'completed') {
			var snJSON = JSON;
			var payloadStr = new snJSON().encode(payload);
			current.variables.provisioning_soe_callback = payloadStr;
			current.variables.provisioning_status = status;
			current.update();
		}
	}
	
} catch (ex) {
	
	workflow.scratchpad.error_source = 'Check Provisioning Status';
	workflow.scratchpad.error_message = 'Failed to get provisioning status from Agility: ' + ex.message;
	gs.log(current.number + ": Get Provisioning Status: Error: " + ex.message, source);
	
	activity.result = 'error';
}

// Get current request's provisioning_status field
function getProvisioningStatus(payload) {
	
	var status = 'running';
	
	for (var i = 0; i < payload.hosts.length; i++) {
		
		var instance_status = payload.hosts[i].status.toLowerCase();

		gs.log(current.number + ": Get Provisioning Status: payload.hosts[i].status: " + instance_status, source);
			
		if (instance_status.indexOf('running') > -1){
			status = 'completed';
		} else if (instance_status.indexOf('unknown') > -1) {
			status = 'failed';
		} else if (instance_status.indexOf('destroyed') > -1) {
			status = 'failed';
		} else if (instance_status.indexOf('failed') > -1) {
			status = 'failed';
		} else if (instance_status.indexOf('degraded') > -1) {
			status = 'failed';
		} else {
			status = 'running';
		}
	}
	
	gs.log(current.number + ": Get Provisioning Status: getProvisioningStatus: " + status, source);
	
	return status;
}

// Retrieve provisioning status if any.
function getProvisionedHosts(topologyRefXML) {
	
	var topologyID = getTopologyID(topologyRefXML);
	var templateIDs = getTemplateIDs(topologyID);
	var result = {
		"hosts": []
	};
	
	for (var i = 0; i < templateIDs.length; i++) {
		var instance = getInstanceJSON(getInstanceXML(templateIDs[i]));
		if (instance) {
			result.hosts.push(instance);
		}
	}
	
	var snJSON = JSON;
	gs.log(current.number + ": Get Provisioning Status: getProvisionedHosts: " + new snJSON().encode(result), source);
	
	return result;
}

// Convert Instance XML into JSON
function getInstanceJSON(instanceXML) {
	
	if (instanceXML && instanceXML != '') {
		var instanceXMLDoc = new XMLDocument(instanceXML, true);
		
		var instance = {
			"name": instanceXMLDoc.getNodeText("//ns1:hostname"),
			"ip": instanceXMLDoc.getNodeText("//ns1:publicAddress"),
			"status": instanceXMLDoc.getNodeText("//ns1:state")
		};
		
		var snJSON = JSON;
		gs.log(current.number + ": Get Provisioning Status: getInstanceJSON: " + new snJSON().encode(instance), source);
		
		return instance;
	}
	return null;
}

// Retrieve topology id from the reference record we should have gotten from the Search call
function getTopologyID(xml) {
	
	var topologyRefXMLDoc = new XMLDocument(xml, true); // Output from Topology Search API REST call is a refernce to topology.
	var topologyID = topologyRefXMLDoc.getNodeText("/ns1:Assetlist/ns1:Asset/ns1:id"); // Get the topology id
	
	if (!topologyID) {
		throw "Could not find topology for this request.";
	}
	
	gs.log(current.number + ": Get Provisioning Status: getTopologyID: " + topologyID, source);
	
	return topologyID;
}

// Retrive all Template IDs used within a specified topology (topologyID)
function getTemplateIDs(topologyID) {
	
	var topologyXMLDoc = new XMLDocument(getTopologyXML(topologyID), true); // Output from getTopologyXML is a full-blown topology document.
	var nodeList = topologyXMLDoc.getNodes("//ns1:anyOrder[ns1:rel='down']/ns1:id");
	
	var templateIDs = [];
	
	for (var i = 0; i < nodeList.getLength(); i++) {
		var templateID = nodeList.item(i).textContent;
		templateIDs.push(templateID);
	}
	
	gs.log(current.number + ": Get Provisioning Status: getTemplateIDs: " + templateIDs, source);
	
	return templateIDs;
}

// Retrieve a full Topology record based on topology ID from Agility
function getTopologyXML(topologyID) {
	
	var params = [{
		'name': 'topology_id',
		'value': topologyID
	}];
	return executeRESTCall(restMessageTopologyGetName, 'get', params);
	
}

// Retrieve Instance XML based on Template ID from Agility
function getInstanceXML(templateID) {
	
	var templateXMLDoc = new XMLDocument(getTemplateXML(templateID), true); // Output from getTemplateXML is a full-blown template document.
	
	var nodeList = templateXMLDoc.getNodes("/ns1:Template/ns1:instances[ns1:rel='down']/ns1:id");
	if (nodeList && nodeList.getLength() > 0) {
		
		var instanceID = nodeList.item(0).textContent; //get the first instance id
		
		var params = [{
			'name': 'instance_id',
			'value': instanceID
		}];
		
		return executeRESTCall(restMessageInstanceGetName, 'get', params);
	}
	
	return '';
}

// Retrieve Template record based on template ID from Agility
function getTemplateXML(templateID) {
	
	var params = [{
		'name': 'template_id',
		'value': templateID
	}];
	
	return executeRESTCall(restMessageTemplateGetName, 'get', params);
	
}

function executeRESTCall(serviceNowMessageName, fn, params) {
	
	var r = new RESTMessage(serviceNowMessageName, fn);
	
	for (var i = 0; i < params.length; i++) {
		r.setStringParameter(params[i].name, params[i].value);
	}
	
	var response = r.execute();
	
	//Because we're making REST call through a MID Server, we need to wait for the response...
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
		
		gs.log(current.number + ': executeRESTCall (' + serviceNowMessageName + '): HTTP Status: ' + httpStatus + '; Response: ' + responseBody, source);
		
		if (200 != parseInt(Number(httpStatus))) {
			throw 'REST call (' + serviceNowMessageName + ') failed: HTTP Status: ' + httpStatus + '; Response: ' + responseBody;
		} else {
			return responseBody;
		}
		
	} else {
		throw 'REST call (' + serviceNowMessageName + ') failed due to service timeout.';
	}
}