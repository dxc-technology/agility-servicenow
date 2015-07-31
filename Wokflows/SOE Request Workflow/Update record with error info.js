/*
 * Update provisioning_status and provisioning_error_message variables
 */
try{
	current.variables.provisioning_error_message = "Automated process that checks on the provisioning status in Agility reached a reasonable threshold and was aborted.  This request has been cancelled.";
	current.variables.provisioning_status = 'failed';
	current.update();
	
	gs.log(current.number + ": Get Provisioning Status reached a threshold and the request is being cancelled.", "gf auto");
} catch (ex) {
	workflow.scratchpad.error_source = 'Update record with failure info';
	workflow.scratchpad.error_message = 'Get Provisioning Status reached threshold but I failed to set provisioning_status to "failed": ' + ex.message;
	gs.log(current.number + ": Update record with failure info: Error: " + ex.message, "gf auto");
	
	activity.state = 'faulted';
}