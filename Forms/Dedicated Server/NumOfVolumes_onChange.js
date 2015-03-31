function onChange(control, oldValue, newValue, isLoading) {
	hideAll();
	
	if(newValue == '1'){
		g_form.setMandatory('size_config_1', true);
		g_form.setMandatory('volume_config_1', true);
		
		g_form.setDisplay('vol_lbl_1', true);
		g_form.setDisplay('size_config_1', true);
		g_form.setDisplay('volume_config_1', true);
		
	}else if(newValue == '2'){
		g_form.setMandatory('size_config_1', true);
		g_form.setMandatory('volume_config_1', true);
		
		g_form.setDisplay('vol_lbl_1', true);
		g_form.setDisplay('size_config_1', true);
		g_form.setDisplay('volume_config_1', true);
		
		g_form.setMandatory('size_config_2', true);
		g_form.setMandatory('volume_config_2', true);
		
		g_form.setDisplay('vol_lbl_2', true);
		g_form.setDisplay('size_config_2', true);
		g_form.setDisplay('volume_config_2', true);
	}else if(newValue == '3'){
		g_form.setMandatory('size_config_1', true);
		g_form.setMandatory('volume_config_1', true);
		
		g_form.setDisplay('vol_lbl_1', true);
		g_form.setDisplay('size_config_1', true);
		g_form.setDisplay('volume_config_1', true);
		
		g_form.setMandatory('size_config_2', true);
		g_form.setMandatory('volume_config_2', true);
		
		g_form.setDisplay('vol_lbl_2', true);
		g_form.setDisplay('size_config_2', true);
		g_form.setDisplay('volume_config_2', true);
		
		g_form.setMandatory('size_config_3', true);
		g_form.setMandatory('volume_config_3', true);
		
		g_form.setDisplay('vol_lbl_3', true);
		g_form.setDisplay('size_config_3', true);
		g_form.setDisplay('volume_config_3', true);
	}else if(newValue == '4'){
		g_form.setMandatory('size_config_1', true);
		g_form.setMandatory('volume_config_1', true);
		
		g_form.setDisplay('vol_lbl_1', true);
		g_form.setDisplay('size_config_1', true);
		g_form.setDisplay('volume_config_1', true);
		
		g_form.setMandatory('size_config_2', true);
		g_form.setMandatory('volume_config_2', true);
		
		g_form.setDisplay('vol_lbl_2', true);
		g_form.setDisplay('size_config_2', true);
		g_form.setDisplay('volume_config_2', true);
		
		g_form.setMandatory('size_config_3', true);
		g_form.setMandatory('volume_config_3', true);
		
		g_form.setDisplay('vol_lbl_3', true);
		g_form.setDisplay('size_config_3', true);
		g_form.setDisplay('volume_config_3', true);
		
		g_form.setMandatory('size_config_4', true);
		g_form.setMandatory('volume_config_4', true);
		
		g_form.setDisplay('vol_lbl_4', true);
		g_form.setDisplay('size_config_4', true);
		g_form.setDisplay('volume_config_4', true);
	}else if(newValue == '5'){
		g_form.setMandatory('size_config_1', true);
		g_form.setMandatory('volume_config_1', true);
		
		g_form.setDisplay('vol_lbl_1', true);
		g_form.setDisplay('size_config_1', true);
		g_form.setDisplay('volume_config_1', true);
		
		g_form.setMandatory('size_config_2', true);
		g_form.setMandatory('volume_config_2', true);
		
		g_form.setDisplay('vol_lbl_2', true);
		g_form.setDisplay('size_config_2', true);
		g_form.setDisplay('volume_config_2', true);
		
		g_form.setMandatory('size_config_3', true);
		g_form.setMandatory('volume_config_3', true);
		
		g_form.setDisplay('vol_lbl_3', true);
		g_form.setDisplay('size_config_3', true);
		g_form.setDisplay('volume_config_3', true);
		
		g_form.setMandatory('size_config_4', true);
		g_form.setMandatory('volume_config_4', true);
		
		g_form.setDisplay('vol_lbl_4', true);
		g_form.setDisplay('size_config_4', true);
		g_form.setDisplay('volume_config_4', true);
		
		g_form.setMandatory('size_config_5', true);
		g_form.setMandatory('volume_config_5', true);
		
		g_form.setDisplay('vol_lbl_5', true);
		g_form.setDisplay('size_config_5', true);
		g_form.setDisplay('volume_config_5', true);
	}
}

function hideAll(){
	g_form.setMandatory('size_config_1', false);
	g_form.setMandatory('volume_config_1', false);
	g_form.setMandatory('size_config_2', false);
	g_form.setMandatory('volume_config_2', false);
	g_form.setMandatory('size_config_3', false);
	g_form.setMandatory('volume_config_3', false);
	g_form.setMandatory('size_config_4', false);
	g_form.setMandatory('volume_config_4', false);
	g_form.setMandatory('size_config_5', false);
	g_form.setMandatory('volume_config_5', false);
	
	g_form.setDisplay('vol_lbl_1', false);
	g_form.setDisplay('size_config_1', false);
	g_form.setDisplay('volume_config_1', false);
	g_form.setDisplay('vol_lbl_2', false);
	g_form.setDisplay('size_config_2', false);
	g_form.setDisplay('volume_config_2', false);
	g_form.setDisplay('vol_lbl_3', false);
	g_form.setDisplay('size_config_3', false);
	g_form.setDisplay('volume_config_3', false);
	g_form.setDisplay('vol_lbl_4', false);
	g_form.setDisplay('size_config_4', false);
	g_form.setDisplay('volume_config_4', false);
	g_form.setDisplay('vol_lbl_5', false);
	g_form.setDisplay('size_config_5', false);
	g_form.setDisplay('volume_config_5', false);
}