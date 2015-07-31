gs.log(current.number + ": Set Up", "gf auto");

workflow.scratchpad.container_id = getContainerID();
workflow.scratchpad.blueprint_id = getBlueprintID();
workflow.scratchpad.callback_url = getCallBackURL();
workflow.scratchpad.request_id = current.number;

gs.log(current.number + ": Set Up : workflow.scratchpad.container_id = " + workflow.scratchpad.container_id, "gf auto");
gs.log(current.number + ": Set Up : workflow.scratchpad.blueprint_id = " + workflow.scratchpad.blueprint_id, "gf auto");
gs.log(current.number + ": Set Up : workflow.scratchpad.callback_url = " + workflow.scratchpad.callback_url, "gf auto");
gs.log(current.number + ": Set Up : workflow.scratchpad.request_id = " + workflow.scratchpad.request_id, "gf auto");

/*
 * Look up Agility Container ID
 */
function getContainerID() {
	var gr = new GlideRecord("u_catalog_var_lookup");
	var result = '';
	var sys_id = gs.getProperty('pnc.gfe.catalog_item.dedicated_infrastructure.variable_lookups.sys_id'); // Get the sys_id
	gr.addQuery("u_catalog_item", sys_id); //Dedicated Infrastrucutre Request
	gr.addQuery("u_field_name", "container_id");
	gr.query();
	if (gr.next()) {
		result = gr.u_value;
	}
	return result;
}

/*
 * Build ServiceNow callback URL
 */
function getCallBackURL(){
	return gs.getProperty('glide.servlet.uri') +"webservices/ProvisioningTaskComplete.do?SOAP";
}

/*
 * Look up Agility Blueprint ID to use based on currently selected OS
 */
function getBlueprintID() {

	var gr = new GlideRecord("u_catalog_var_lookup");
	var result = '';
	var sys_id = gs.getProperty('pnc.gfe.catalog_item.dedicated_infrastructure.variable_lookups.sys_id'); // Get the sys_id
	gr.addQuery("u_catalog_item", sys_id);
	gr.addQuery("u_label", current.variables.soe_operating_system);
	gr.addQuery("u_field_name", "blueprint_id");
	gr.addQuery("u_dependent_value", "SOE");
	gr.query();
	if (gr.next()) {
		result = gr.u_value;
	}
	return result;
}