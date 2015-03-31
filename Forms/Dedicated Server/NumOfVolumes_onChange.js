function onChange(control, oldValue, newValue, isLoading) {

	var count = parseInt(newValue, 10);

	if (isNaN(count)) {
		count = 0;
	}

	if (count > 5) {
		count = 5;
	}

	for (var i = 1; i <= 5; i++) {
		var idx = i.toString();
		var display = (i <= count);

		g_form.setMandatory('size_config_' + idx, display);
		g_form.setMandatory('volume_config_' + idx, display);

		g_form.setDisplay('vol_lbl_' + idx, display);
		g_form.setDisplay('size_config_' + idx, display);
		g_form.setDisplay('volume_config_' + idx, display);
	}

}