if (current.variables.provisioning_status == 'failed') {
	activity.result = 'yes';
} else {
	activity.result = 'no';
}

gs.log(current.number + ": Checking whether provisioning failed... : " + current.variables.provisioning_status, "gs auto");