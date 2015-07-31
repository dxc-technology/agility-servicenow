// Update XML we received from Clone REST call with values supplied by users via Catalog Item request form
gs.log(current.number + ": Update Blueprint XML", "gf auto");

try {
	var isLinux = (current.variables.soe_operating_system.toString().indexOf("Linux") != -1);
	gs.log(current.number + ": Update Blueprint XML : isLinux = " + isLinux, "gf auto");

	var xmldoc = new XMLDocument(workflow.scratchpad.cloned_blueprint_xml, true); // Output from the clone API REST call is the cloned blueprint xml
	workflow.scratchpad.cloned_blueprint_id = xmldoc.getNodeText("/ns1:Blueprint/ns1:id"); // Get the new blueprint id
	gs.log(current.number + ": Update Blueprint XML : workflow.scratchpad.cloned_blueprint_id = " + workflow.scratchpad.cloned_blueprint_id, "gf auto");

	workflow.scratchpad.updated_blueprint_xml = updateBlueprintXML(xmldoc);
	gs.log(current.number + ": Update Blueprint XML : XML = " + workflow.scratchpad.updated_blueprint_xml, "gf auto");

} catch (ex) {
	activity.state = 'faulted';
	workflow.scratchpad.error_source = 'Update Blueprint XML';
	workflow.scratchpad.error_message = 'Failed to update cloned blueprint XML: ' + ex.message;
	gs.log(current.number + ": Update Blueprint XML : Error : " + ex.message, "gf auto");
}

//Update Blueprint XML we received from the clone call with values from the request form.
function updateBlueprintXML(xmldoc) {

	setBlueprintNameNode(xmldoc);

	getAssetPropertyNode(xmldoc, "mnemonic_code").setTextContent(current.variables.soe_mnemonic);
	if (isLinux) {
		getAssetPropertyNode(xmldoc, "server_function").setTextContent(current.variables.soe_server_function);
	} else {
		getAssetPropertyNode(xmldoc, "server_function").setTextContent(current.variables.soe_server_function);
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

// Retrieve blueprint's name element from the blueprint XML
// Throws an exception if element not found
function setBlueprintNameNode(xmldoc) {
	var node = xmldoc.getNode("/ns1:Blueprint/ns1:name");
	if (!node) {
		throw "Could not find Blueprint name in the blueprint XML.";
	}
	var name = node.textContent + " (SN request: " + current.number + ")";
	node.setTextContent(name);
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
	var configOptionsStr = new SNJSON().encode(config_options);

	gs.log(current.number + ": Update Blueprint XML : config_options : " + configOptionsStr, "gf auto");

	return configOptionsStr;
}

// Build JSON object representing an array of selected packages to be installed on the VM
function getPackagesConfig() {
	var packages = [];
	var pkg = {
		name: current.variables.soe_cap.toString()
	};
	packages.push(pkg);
	return packages;
}

// Build JSON object that captures filesystem configuration info required by Agility
function getLinuxFileSystemConfig(countof) {
	var fsvars = getFileSystemVariablesAsArrays();
	var volumes = [{
		"partitions": []
	}];
	for (var i = 0; i < countof; i++) {
		var partition = {
			logical_volume_name: stripForwardSlash(fsvars.lx_fs_mount_points[i].toString()),
			size: fsvars.lx_fs_sizes[i].toString(),
			mapper_dir: fsvars.lx_fs_mount_points[i].toString(),
			volume_group_name: 'datadg',
			ext: 'ext4',
			user: fsvars.lx_fs_users[i].toString(),
			group: fsvars.lx_fs_groups[i].toString()
		};
		volumes[0].partitions.push(partition);
	}
	return volumes;
}

// Remove all the /'s' from a path
function stripForwardSlash(str) {
	if (str) {
		return str.replace(/\//g, '');
	} else {
		return str;
	}
}

// Build JSON object that captures windows filesystem configuration info required by Agility
function getWindowsFileSystemConfig(countof) {
	var fsvars = getFileSystemVariablesAsArrays();
	var volumes = [];
	for (var i = 0; i < countof; i++) {
		var volume = {
			volume_name: fsvars.win_fs_volumes[i].toString(),
			size: fsvars.win_fs_sizes[i].toString(),
			ext: 'ntfs'
		};
		volumes.push(volume);
	}
	return volumes;
}


// Take current variables and pack them into arrays for easy of access
// var tmp = current.variables['name'] does not seem to work in loops...  not sure why
function getFileSystemVariablesAsArrays() {
	return {
		lx_fs_mount_points: [current.variables.lx_fs_mount_point_1, current.variables.lx_fs_mount_point_2, current.variables.lx_fs_mount_point_3, current.variables.lx_fs_mount_point_4, current.variables.lx_fs_mount_point_5],
		lx_fs_sizes: [current.variables.lx_fs_size_1, current.variables.lx_fs_size_2, current.variables.lx_fs_size_3, current.variables.lx_fs_size_4, current.variables.lx_fs_size_5],
		lx_fs_users: [current.variables.lx_fs_user_1, current.variables.lx_fs_user_2, current.variables.lx_fs_user_3, current.variables.lx_fs_user_4, current.variables.lx_fs_user_5],
		lx_fs_groups: [current.variables.lx_fs_group_1, current.variables.lx_fs_group_2, current.variables.lx_fs_group_3, current.variables.lx_fs_group_4, current.variables.lx_fs_group_5],
		win_fs_volume: [current.variables.win_fs_volume_letter_1, current.variables.win_fs_volume_letter_2, current.variables.win_fs_volume_letter_3, current.variables.win_fs_volume_letter_4, current.variables.win_fs_volume_letter_5],
		win_fs_sizes: [current.variables.win_fs_size_1, current.variables.win_fs_size_2, current.variables.win_fs_size_3, current.variables.win_fs_size_4, current.variables.win_fs_size_5]
	};
}