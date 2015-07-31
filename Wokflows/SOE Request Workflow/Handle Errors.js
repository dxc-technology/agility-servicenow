if (current.variables.provisioning_error_message || current.variables.provisioning_error_message == '') {

	if (workflow.scratchpad.error_message && workflow.scratchpad.error_message != '') {
		var errStr = workflow.scratchpad.error_message;
		if (workflow.scratchpad.error_source && workflow.scratchpad.error_source != '') {
			errStr = "Provisionining workflow failed in the '" + workflow.scratchpad.error_source + "' activity. " +  errStr ; 
		}
		current.variables.provisioning_error_message = errStr;
	}

}

current.variables.provisioning_status = 'failed';
current.update();

//  Notify by email? Log an error?
gs.log(current.number + ": Error in the workflow", "gf auto");
