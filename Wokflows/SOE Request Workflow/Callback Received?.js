if (current.variables.provisioning_status == 'completed' || current.variables.provisioning_status == 'failed') {
	activity.result = 'yes';
} else {
	activity.result = 'no';
}

gs.log(current.number + ": Waiting for callback timed out.  Provisioning status: " + current.variables.provisioning_status, "gf auto");