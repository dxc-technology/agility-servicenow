gs.log(current.number + ": Update Blueprint XML", "gf auto");

var isLinux = (current.variables.soe_operating_system.toString().indexOf("Linux") != -1);
var xmldoc = new XMLDocument(workflow.scratchpad.cloned_blueprint_xml, true); // Output from the clone API REST call is the cloned blueprint xml
workflow.scratchpad.cloned_blueprint_id = xmldoc.getNodeText("/ns1:Blueprint/ns1:id"); // Get the new blueprint id
workflow.scratchpad.updated_blueprint_xml  = updateBlueprintXML(xmldoc);

gs.log(current.number + ": Update Blueprint XML : isLinux = " + isLinux, "gf auto");
gs.log(current.number + ": Update Blueprint XML : workflow.scratchpad.cloned_blueprint_id = " + workflow.scratchpad.cloned_blueprint_id, "gf auto");
gs.log(current.number + ": Update Blueprint XML : workflow.scratchpad.cloned_blueprint_xml = " + workflow.scratchpad.cloned_blueprint_xml, "gf auto");
gs.log(current.number + ": Update Blueprint XML : workflow.scratchpad.updated_blueprint_xml = " + workflow.scratchpad.updated_blueprint_xml, "gf auto");

//Update Blueprint XML we received from the clone call with values from the request form.
function updateBlueprintXML(xmldoc) {
	getAssetPropertyNode(xmldoc, "mnemonic_code").setTextContent(current.variables.soe_mnemonic);
	if (isLinux) {
		getAssetPropertyNode(xmldoc, "server_function").setTextContent(current.variables.soe_server_function_linux);
	} else {
		getAssetPropertyNode(xmldoc, "server_function").setTextContent(current.variables.soe_server_function_win);
	}
	getAssetPropertyNode(xmldoc, "environment").setTextContent(current.variables.soe_environment);
	getAssetPropertyNode(xmldoc, "model").setTextContent(current.variables.soe_sizing);
	getAssetPropertyNode(xmldoc, "specifics").setTextContent(current.variables.soe_specific_code);
	getAssetPropertyNode(xmldoc, "Greenfield Location").setTextContent(current.variables.soe_cloud_location);
	getAssetPropertyNode(xmldoc, "Cluster Type").setTextContent(current.variables.soe_cluster_type);
	getAssetPropertyNode(xmldoc, "Network Type").setTextContent(current.variables.soe_network_type);

	getAssetPropertyNode(xmldoc, "config_options").setTextContent(getConfigOptions());
	return xmldoc.toString();

}

// Retrieve asset property element from the blueprint XML that matches 'assetName'
// Throws an exception if element not found
function getAssetPropertyNode(xmldoc, assetname) {
	var node = xmldoc.getNode("//ns1:assetProperties[ns1:name='" + assetname + "']/*[name() = 'ns1:stringValue' or name() = 'ns1:intValue']");
	if (!node) {
		throw "Asset property '" + assetname + "' was not found in Agility blueprint.";
	}
	return node;
}

/* Build JSON string for config_options, which is an asset property of the Agility Blueprint.
 * config_options carries info about callback reference, file system configuration, multiple CAP
 * and options packages to be installed on the provisioned VMs, etc.
 */
function getConfigOptions() {
	var config_options = {
		"service_now": {
			task_id: workflow.scratchpad.request_id.toString(),
			callback_url: workflow.scratchpad.callback_url
		}
	};
	
	config_options.volumes = (isLinux ? getLinuxFileSystemConfig(current.variables.lx_fs_count) : getWindowsFileSystemConfig(current.variables.win_fs_volume_count));
	config_options.packages = getPackagesConfig();

	var SNJSON = JSON;
	return new SNJSON().encode(config_options);
}

function getPackagesConfig() {
	var packages =[];
	var pkg = {name:(isLinux ? current.variables.soe_cap_linux : current.variables.soe_cap_win)}; 
	packages.push(pkg);
	return packages;
}

// Build JSON object that captures filesystem configuration info required by Agility
function getLinuxFileSystemConfig(countof) {
	var volumes = [{
		"partitions": []
	}];
	for (var i = 0; i < countof; i++) {
		var partition = {
			logical_volume_name: current.variables["lx_fs_mount_point_" + i].replace(/\//g, ''),
			size: current.variables["lx_fs_size_" + i],
			mapper_dir: current.variables["lx_fs_mount_point_" + i],
			volume_group_name: "datadg",
			ext: "ext4",
			user: current.variables["lx_fs_user_" + i],
			group: current.variables["lx_fs_group_" + i]
		};
		volumes[0].partitions.push(partition);
	}
	return volumes;
}

// Build JSON object that captures windows filesystem configuration info required by Agility
function getWindowsFileSystemConfig(countof) {
	var volumes = [];
	for (var i = 0; i < countof; i++) {
		var volume = {
			volume_name: current.variables["win_fs_volume_letter_" + i],
			size: current.variables["win_fs_size_" + i],
			ext: "ntfs"
		};
		volumes.push(volume);
	}
	return volumes;
}