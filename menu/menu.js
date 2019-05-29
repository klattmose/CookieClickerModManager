if(CCMM === undefined) var CCMM = {};


//***********************************
//    Base menu functionality
//    Mostly copied from GreaseMonkey
//***********************************
function l(what){return document.getElementById(what);}

function onLoad(){
	document.body.id = 'main-menu';
}

function onContextMenu(event){
	event.preventDefault();
	event.stopPropagation();
}

function onClick(event){
	if(event.which != 1){
		event.preventDefault();
		event.stopPropagation();
	}else{
		CCMM.activate(event.target);
	}
}

function onMouseOver(event){
	let el = event.target;
	while (el && el.tagName != 'MENUITEM') el = el.parentNode;
	if(el && el.hasAttribute('tabindex')) el.focus();
}

function onMouseOut(){
	document.activeElement.blur();
}

function onKeyDown(event){
	if(event.target.tagName == 'TEXTAREA') return;

	if(event.code == 'Enter'){
		return CCMM.activate(event.target);
	}else if(event.key == 'ArrowDown'){
		event.preventDefault();
		switchFocus(1);
	}else if(event.key == 'ArrowUp'){
		event.preventDefault();
		switchFocus(-1);
	}
}

function onTransitionEnd(){
	// After a CSS transition has moved a section out of the visible area,
	// force it to be hidden, so that it cannot gain focus.
	var sections = document.getElementsByTagName('section')
	for(var i = 0; i < sections.length; i++){
		var section = sections[i];
		section.style.visibility = (section.className == document.body.id ? 'visible' : 'hidden');
	}
}

function onTransitionStart(){
	// While CSS transitioning, keep all sections visible.
	var sections = document.getElementsByTagName('section')
	for(var i = 0; i < sections.length; i++){
		var section = sections[i];
		section.style.visibility = 'visible';
	}
}

function navigateToMainMenu(){
	navigateAway();
	document.body.id = 'main-menu';

	if(CCMM.MainFocusedItem){
		CCMM.MainFocusedItem.focus();
		CCMM.MainFocusedItem = null;
	}
}

function switchFocus(move){
	var section = document.querySelector('section.' + document.body.id);
	var focusable = Array.from(section.querySelectorAll('[tabindex="0"]'));
	var index = focusable.indexOf(document.activeElement);
	if(index == -1 && move == -1) index = 0;
	var len = focusable.length;
	index = (index + move + len) % len;
	focusable[index].focus();
}

function navigateAway(){
	
}


window.addEventListener('DOMContentLoaded', onLoad, false);
window.addEventListener('contextmenu', onContextMenu, false);
window.addEventListener('click', onClick, false);
window.addEventListener('mouseover', onMouseOver, false);
window.addEventListener('mouseout', onMouseOut, false);
window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('transitionend', onTransitionEnd, false);
window.addEventListener('transitionstart', onTransitionStart, false);
window.addEventListener('unload', navigateToMainMenu, false);


//file save function from https://github.com/eligrey/FileSaver.js
var saveAs=saveAs||function(view){"use strict";if(typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var doc=view.document,get_URL=function(){return view.URL||view.webkitURL||view},save_link=doc.createElementNS("http://www.w3.org/1999/xhtml","a"),can_use_save_link="download"in save_link,click=function(node){var event=new MouseEvent("click");node.dispatchEvent(event)},is_safari=/Version\/[\d\.]+.*Safari/.test(navigator.userAgent),webkit_req_fs=view.webkitRequestFileSystem,req_fs=view.requestFileSystem||webkit_req_fs||view.mozRequestFileSystem,throw_outside=function(ex){(view.setImmediate||view.setTimeout)(function(){throw ex},0)},force_saveable_type="application/octet-stream",fs_min_size=0,arbitrary_revoke_timeout=500,revoke=function(file){var revoker=function(){if(typeof file==="string"){get_URL().revokeObjectURL(file)}else{file.remove()}};if(view.chrome){revoker()}else{setTimeout(revoker,arbitrary_revoke_timeout)}},dispatch=function(filesaver,event_types,event){event_types=[].concat(event_types);var i=event_types.length;while(i--){var listener=filesaver["on"+event_types[i]];if(typeof listener==="function"){try{listener.call(filesaver,event||filesaver)}catch(ex){throw_outside(ex)}}}},auto_bom=function(blob){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)){return new Blob(["\ufeff",blob],{type:blob.type})}return blob},FileSaver=function(blob,name,no_auto_bom){if(!no_auto_bom){blob=auto_bom(blob)}var filesaver=this,type=blob.type,blob_changed=false,object_url,target_view,dispatch_all=function(){dispatch(filesaver,"writestart progress write writeend".split(" "))},fs_error=function(){if(target_view&&is_safari&&typeof FileReader!=="undefined"){var reader=new FileReader;reader.onloadend=function(){var base64Data=reader.result;target_view.location.href="data:attachment/file"+base64Data.slice(base64Data.search(/[,;]/));filesaver.readyState=filesaver.DONE;dispatch_all()};reader.readAsDataURL(blob);filesaver.readyState=filesaver.INIT;return}if(blob_changed||!object_url){object_url=get_URL().createObjectURL(blob)}if(target_view){target_view.location.href=object_url}else{var new_tab=view.open(object_url,"_blank");if(new_tab==undefined&&is_safari){view.location.href=object_url}}filesaver.readyState=filesaver.DONE;dispatch_all();revoke(object_url)},abortable=function(func){return function(){if(filesaver.readyState!==filesaver.DONE){return func.apply(this,arguments)}}},create_if_not_found={create:true,exclusive:false},slice;filesaver.readyState=filesaver.INIT;if(!name){name="download"}if(can_use_save_link){object_url=get_URL().createObjectURL(blob);setTimeout(function(){save_link.href=object_url;save_link.download=name;click(save_link);dispatch_all();revoke(object_url);filesaver.readyState=filesaver.DONE});return}if(view.chrome&&type&&type!==force_saveable_type){slice=blob.slice||blob.webkitSlice;blob=slice.call(blob,0,blob.size,force_saveable_type);blob_changed=true}if(webkit_req_fs&&name!=="download"){name+=".download"}if(type===force_saveable_type||webkit_req_fs){target_view=view}if(!req_fs){fs_error();return}fs_min_size+=blob.size;req_fs(view.TEMPORARY,fs_min_size,abortable(function(fs){fs.root.getDirectory("saved",create_if_not_found,abortable(function(dir){var save=function(){dir.getFile(name,create_if_not_found,abortable(function(file){file.createWriter(abortable(function(writer){writer.onwriteend=function(event){target_view.location.href=file.toURL();filesaver.readyState=filesaver.DONE;dispatch(filesaver,"writeend",event);revoke(file)};writer.onerror=function(){var error=writer.error;if(error.code!==error.ABORT_ERR){fs_error()}};"writestart progress write abort".split(" ").forEach(function(event){writer["on"+event]=filesaver["on"+event]});writer.write(blob);filesaver.abort=function(){writer.abort();filesaver.readyState=filesaver.DONE};filesaver.readyState=filesaver.WRITING}),fs_error)}),fs_error)};dir.getFile(name,{create:false},abortable(function(file){file.remove();save()}),abortable(function(ex){if(ex.code===ex.NOT_FOUND_ERR){save()}else{fs_error()}}))}),fs_error)}),fs_error)},FS_proto=FileSaver.prototype,saveAs=function(blob,name,no_auto_bom){return new FileSaver(blob,name,no_auto_bom)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(blob,name,no_auto_bom){if(!no_auto_bom){blob=auto_bom(blob)}return navigator.msSaveOrOpenBlob(blob,name||"download")}}FS_proto.abort=function(){var filesaver=this;filesaver.readyState=filesaver.DONE;dispatch(filesaver,"abort")};FS_proto.readyState=FS_proto.INIT=0;FS_proto.WRITING=1;FS_proto.DONE=2;FS_proto.error=FS_proto.onwritestart=FS_proto.onprogress=FS_proto.onwrite=FS_proto.onabort=FS_proto.onerror=FS_proto.onwriteend=null;return saveAs}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!=null){define([],function(){return saveAs})}


//***********************************
//    Menu button callbacks
//***********************************
CCMM.activate = function(el){
	while(el && el.tagName != 'MENUITEM') el = el.parentNode;
	if(!el) return;
	
	switch(el.className){
		case 'go-back':
			if(document.body.id == 'user-script-options'){
				//navigateToScript(gTplData.activeScript.uuid);
			}else{
				navigateToMainMenu();
			}
			return;
	}
	
	switch(el.id){
		case 'optionsButton':
			CCMM.showOptions();
			return;
		case 'newModButton':
			CCMM.EditMod(CCMM.config.mods.length);
			return;
		case 'toggleGlobalEnabledButton':
			CCMM.toggleGlobalEnabled();
			return;
		case 'editModSaveChanges':
			CCMM.editModSaveChanges();
			return;
		case 'editModCancel':
			navigateToMainMenu();
			return;
		case 'editModDelete':
			CCMM.editModDelete();
			return;
		case 'optionEportConfig':
			CCMM.ExportToFile();
			return;
		case 'optionImportConfig':
			CCMM.ImportConfig();
			return;
		case 'optionDefaultConfig':
			CCMM.RestoreDefaultConfig();
			return;
	}
	
	if(el.id.indexOf('ModEnabledButton') > -1){
		CCMM.toggleModEnabled(el.id);
	}
	if(el.id.indexOf('ModEditButton') > -1){
		CCMM.EditMod(el.id);
	}
	if(el.id.indexOf('ModLoadButton') > -1){
		CCMM.LoadMod(el.id);
	}
	else{
		console.info('activate unhandled:', el);
	}
}

CCMM.showOptions = function(){
	CCMM.MainFocusedItem = document.activeElement;
	document.body.id = 'options';
	l('optionsConfigText').value = JSON.stringify(CCMM.config, null, 2);
	l('optionsImportError').style = 'display:none;';
}

CCMM.toggleGlobalEnabled = function(){
	CCMM.config.enabled = !CCMM.config.enabled;
	CCMM.showGlobalEnabled();
	CCMM.saveData();
}

CCMM.toggleModEnabled = function(id){
	var i = Number(id.replace('ModEnabledButton', ''));
	var mod = CCMM.config.mods[i];
	mod.enabled = mod.enabled ? 0 : 1;
	CCMM.refreshModlist();
	CCMM.saveData();
}

CCMM.EditMod = function(id){
	CCMM.MainFocusedItem = document.activeElement;
	document.body.id = 'editMod';
	
	if(id == CCMM.config.mods.length){ // Adding a new mod
		CCMM.tempModId = id;
		CCMM.tempMod = {name : '', url : '', enabled : 1, waitForScriptLoad : 0, extraDelay : 0, isLoaded : 0};
		l('editModHeaderText').innerHTML = 'Add Mod';
	}
	else{ // Editing already existing mod
		CCMM.tempModId = Number(id.replace('ModEditButton', ''));
		CCMM.tempMod = JSON.parse(JSON.stringify(CCMM.config.mods[CCMM.tempModId]));
		l('editModHeaderText').innerHTML = 'Edit Mod';
	}
	
	l('editModURL').value = CCMM.tempMod.url;
	l('editModName').value = CCMM.tempMod.name;
}

CCMM.editModChangeUrl = function(){
	CCMM.tempMod.url = l('editModURL').value;
	CCMM.tempMod.name = CCMM.GuessModId(CCMM.tempMod.url);
	l('editModName').value = CCMM.tempMod.name;
}

CCMM.editModChangeName = function(){
	CCMM.tempMod.name = l('editModName').value;
}

CCMM.editModSaveChanges = function(){
	CCMM.config.mods[CCMM.tempModId] = CCMM.tempMod;
	navigateToMainMenu();
	CCMM.refreshModlist();
	CCMM.saveData();
}

CCMM.editModDelete = function(){
	if(CCMM.tempModId < CCMM.config.mods.length && CCMM.tempModId >= 0){
		CCMM.config.mods.splice(CCMM.tempModId, 1);
		CCMM.refreshModlist();
		CCMM.saveData();
	}
	navigateToMainMenu();
}

CCMM.LoadMod = function(id){
	var i = Number(id.replace('ModLoadButton', ''));
	var mod = CCMM.config.mods[i];
	
	browser.tabs.executeScript({
		code : `Game.LoadMod('` + mod.url + `');`
	});
	
	mod.isLoaded = 1;
	CCMM.refreshModlist();
}

CCMM.ExportToFile = function(){
	var filename = 'Cookie Clicker Mod Manager config.txt';
	var text = JSON.stringify(CCMM.config, null, 2);
	var blob = new Blob([text], {type : 'text/plain;charset=utf-8'});
	saveAs(blob, filename);
}

CCMM.ImportConfig = function(){
	var text = l('optionsConfigText').value;
	
	try{
		CCMM.config = JSON.parse(text);
		CCMM.detectLoadedMods();
		CCMM.saveData();
		l('optionsImportError').style = 'display:none;';
	}catch(err){
		l('optionsImportError').textContent = err.message;
		l('optionsImportError').style = 'display:block;';
	}
}

CCMM.RestoreDefaultConfig = function(){
	CCMM.config = CCMM.defaultConfig();
	CCMM.detectLoadedMods();
	CCMM.saveData();
}


//***********************************
//    Load the configuration
//    and create the menu
//***********************************
CCMM.configLoaded = function(){
	CCMM.showGlobalEnabled();
	CCMM.detectLoadedMods();
	
	// Apparently doing this in html doesn't work
	l('editModURL').oninput = CCMM.editModChangeUrl;
	l('editModName').oninput = CCMM.editModChangeName;
}

CCMM.showGlobalEnabled = function(){
	if(CCMM.config.enabled){
		l('globalEnabledIcon').classList.add('fa-check');
		l('globalEnabledIcon').classList.remove('fa-times');
		l('globalEnabledText').innerHTML = 'Cookie Clicker Mod Manager (enabled)';
	}else{
		l('globalEnabledIcon').classList.remove('fa-check');
		l('globalEnabledIcon').classList.add('fa-times');
		l('globalEnabledText').innerHTML = 'Cookie Clicker Mod Manager (disabled)';
	}
}

CCMM.detectLoadedMods = function(){
	function onError(error){
		console.log(`Error: ${error}`);
		CCMM.refreshModlist();
	}
	
	function onCompletion(result){
		if(result[0] === undefined) CCMM.LoadedMods = {};
		else CCMM.LoadedMods = result[0];
		
		for(var i = 0; i < CCMM.config.mods.length; i++){
			var mod = CCMM.config.mods[i];
			if(CCMM.LoadedMods[CCMM.GuessModId(mod.url)]) mod.isLoaded = 1;
			else mod.isLoaded = 0;
		}
		
		CCMM.refreshModlist();
		navigateToMainMenu();
	}
	
	browser.tabs.executeScript({
		code:  `var scripts = document.getElementsByTagName('script');
				var ret = {};
				for(var i = 0; i < scripts.length; i++){
					var script = scripts[i];
					if(script.id.indexOf('modscript_') >- 1) ret[script.id.replace('modscript_', '')] = 1;
				}
				ret;`
	}).then(onCompletion, onError);
}

CCMM.refreshModlist = function(){
	var modListDiv = l('modListDiv');
	modListDiv.innerHTML = '';
	
	var str = '';
	for(var i = 0; i < CCMM.config.mods.length; i++){
		var mod = CCMM.config.mods[i];
		
		var div = document.createElement('div'); 
			div.classList.add('mod-listing');
		var enabledButton = document.createElement('menuitem'); 
			enabledButton.setAttribute('tabindex', '0'); 
			enabledButton.id = 'ModEnabledButton' + i; 
			div.appendChild(enabledButton);
		var enabledIcon = document.createElement('i'); 
			enabledIcon.classList.add('icon'); 
			enabledIcon.classList.add('fa'); 
			enabledIcon.classList.add(mod.enabled ? 'fa-check' : 'fa-times'); 
			enabledButton.appendChild(enabledIcon);
		var nameItem = document.createElement('menuitem'); 
			div.appendChild(nameItem);
		var nameText = document.createElement('span'); 
			nameText.classList.add('text'); 
			nameText.textContent = mod.name; 
			nameItem.appendChild(nameText);
		var editButton = document.createElement('menuitem'); 
			editButton.setAttribute('tabindex', '0'); 
			editButton.id = 'ModEditButton' + i; 
			editButton.classList.add('floatRight');
			editButton.innerHTML = '<span class="text">Edit</span>'; 
			div.appendChild(editButton);
		if(!mod.isLoaded){
			var loadButton = document.createElement('menuitem'); 
				loadButton.setAttribute('tabindex', '0'); 
				loadButton.id = 'ModLoadButton' + i; 
				loadButton.classList.add('floatRight');
				loadButton.innerHTML = '<span class="text">Load</span>'; 
				div.appendChild(loadButton);
		}
		
		modListDiv.appendChild(div);
	}
}


CCMM.loadData(CCMM.configLoaded);