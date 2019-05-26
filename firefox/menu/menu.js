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
			CCMM.MainFocusedItem = document.activeElement;
			document.body.id = 'options';
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
	var str = '';
	for(var i = 0; i < CCMM.config.mods.length; i++){
		var mod = CCMM.config.mods[i];
		str += '<div class="mod-listing">';
		str += '<menuitem tabindex="0" id="ModEnabledButton' + i + '"><i id="ModEnabledIcon' + i + '" class="icon fa ' + (mod.enabled ? 'fa-check' : 'fa-times') + '"></i></menuitem>';
		str += '<menuitem id="ModName' + i + '"><span class="text">' + mod.name + '</span></menuitem>';
		str += '<menuitem tabindex="0" id="ModEditButton' + i + '" class="floatRight"><span class="text">Edit</span></menuitem>';
		if(!mod.isLoaded) str += '<menuitem tabindex="0" id="ModLoadButton' + i + '" class="floatRight"><span class="text">Load</span></menuitem>';
		str += '</div>';
	}
	l('modListDiv').innerHTML = str;
}

CCMM.loadData(CCMM.configLoaded);