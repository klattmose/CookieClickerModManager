// Copied and modifed from GreaseMonkey

'use strict';

let gTplData = {
  'enabled': true,
};

let gMainFocusedItem = null;	// TODO: this needs to be a stack.
let gPendingTicker = null;
let gScriptTemplates = {};


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
		activate(event.target);
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
		return activate(event.target);
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
	for(var section in document.getElementsByTagName('section')){
		section.style.visibility = (section.className == document.body.id
				? 'visible' : 'hidden');
	}
}

function onTransitionStart(){
	// While CSS transitioning, keep all sections visible.
	for (var section in document.getElementsByTagName('section')){
		section.style.visibility = 'visible';
	}
}

function navigateToMainMenu(){
	navigateAway();
	document.body.id = 'main-menu';

	if(gMainFocusedItem){
		gMainFocusedItem.focus();
		gMainFocusedItem = null;
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
function activate(el){
	if(el.tagName == 'A'){
		setTimeout(window.close, 0);
		return;
	}

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
		case 'open-options':
			gMainFocusedItem = document.activeElement;
			document.body.id = 'options';
			return;
		case 'toggle-global-enabled':
			toggleGlobalEnabled();
			return;
	}

	let url = el.getAttribute('data-url');
	if(url){
		chrome.tabs.create({'active': true, 'url': url});
		window.close();
		return;
	}

	if(el.classList.contains('user-script')){
		let uuid = el.getAttribute('data-uuid');
		//navigateToScript(uuid);
		return;
	}

	console.info('activate unhandled:', el);
}

function toggleGlobalEnabled(){
	CCMM.config.enabled = !CCMM.config.enabled;
	if(CCMM.config.enabled){
		l('globalEnabledIcon').classList.add('fa-check');
	}else{
		l('globalEnabledIcon').classList.remove('fa-check');
	}
	CCMM.saveData();
}



//***********************************
//    Load the configuration
//    and initialize the menu
//***********************************
function configLoaded(){
	if(CCMM.config.enabled){
		l('globalEnabledIcon').classList.add('fa-check');
	}else{
		l('globalEnabledIcon').classList.remove('fa-check');
	}
	
	
}

CCMM.loadData(configLoaded);