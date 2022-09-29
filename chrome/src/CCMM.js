if(CCMM === undefined) var CCMM = {};

CCMM.ScriptInjection = function(){
	var s = document.createElement('script');
	
	s.src = chrome.runtime.getURL('src/mainModLoader.js?') + new URLSearchParams({config: JSON.stringify(CCMM.config)});
	s.onload = function() {
		this.remove();
	};
	
	(document.head || document.documentElement).appendChild(s);
}

CCMM.ModInjection = function(url){
	var s = document.createElement('script');
	
	s.src = chrome.runtime.getURL('src/adhocModLoader.js?') + new URLSearchParams({mod: url});
	s.onload = function() {
		this.remove();
	};
	
	(document.head || document.documentElement).appendChild(s);
}

CCMM.loadData(CCMM.ScriptInjection);

// This script brought to you by Chrome being stupid and screwing up page_action popups
if(CCMM.language == 'chrome') browser.runtime.sendMessage({"message": "activate_icon"});