/*
 * This callback endpoint is used to recieve task completion notification for both: dedicated and shared infrastructure requests
 *
 * request_number 	:ServiceNow request number (i.e.: current.number) that initiated the long running process in Agility or vCO
 * result			 :Status code of the task, where 0 = OK; non-0 = error code
 * error_message	  :Additional info about the error, if result != 0
 * data			   :Placeholder for additional information.  If it's coming from Agility, this could be JSON string containing IP 
 * 					addresses and hostnames of the VMs that were provisioned.  vCO currently doe not provide any additional information.
 *
 */

gs.log(request.request_number + ' : Provisioning Task Completed : Callback Received', 'gf auto');
gs.log(request.request_number + ' : Provisioning Task Completed : Result Code : ' + request.result, 'gf auto');
if (request.result != 0){
	gs.log(request.request_number + ' : Provisioning Task Completed : Error Message : ' + request.error_message, 'gf auto');
} else {
	gs.log(request.request_number + ' : Provisioning Task Completed : Payload : ' + request.data, 'gf auto');
}

//used for dedicated and shared application reqeusts
updateRequest();

function updateRequest(){
	var gr = new GlideRecord("sc_req_item");
	gr.addQuery("number", request.request_number);
	gr.query();
	if (gr.next()){
		if(request.result == '0'){
			
			/* Handle callback from WAS request
			
			WAS request is complex as we have two async requests to Agility:
			one to provision WAS Deployment Manager (DMGR)
			and another to provision Cell Nodes.
			
			So, we are getting two callbacks back.
			As part of our handshake when invoking WAS Deployment Manager and WAS Nodes
			blueprints, we mark them with WAS_DMGR and WAS_Nodes.
			
			Here we determine which one of the tasks has completed.
 			*/
			if(request.data.indexOf('WAS_DMGR') !=-1){
				gr.variables.dmgr_callback = request.data;
			}else if(request.data.indexOf('WAS_NODES')!= -1){
				gr.variables.nodes_callback = request.data;
			}else{
				// otherwise, this is a SOE request calling us back
				gr.variables.provisioning_soe_callback = request.data;
			}
			
			gr.variables.provisioning_status = 'completed';
			
		}else if(request.result =='1'){
			gr.variables.provisioning_error_message = request.error_message;
			gr.variables.provisioning_status = 'failed';
		}
		gr.update();
	}
}

response.callback_response = 'received';