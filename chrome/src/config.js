if(CCMM === undefined) var CCMM = {};

CCMM.defaultConfig = function(){
	return {
	  "async": false,
	  "cache": false,
	  "enabled": true,
	  "mods": []
	}
}

CCMM.loadData = function(callback){
	function onError(error){
		console.log(`Error: ${error}`);
	}
	
	function onGot(item){
		console.log('storage', item);
		if(item.config){
			CCMM.config = item.config;
		}else{
			CCMM.config = CCMM.defaultConfig();
		}
		
		callback();
	}
	
	if(CCMM.language == 'chrome') browser.storage.local.get('config', onGot); 
	else browser.storage.local.get('config').then(onGot, onError);
}

CCMM.saveData = function(){
	browser.storage.local.set({
		config: CCMM.config
	});
}

CCMM.GuessModId = function(url){
	var id = url.split('/'); 
	id = id[id.length - 1].split('.')[0];
	return id;
}


// Multi-browser support
if(window.msBrowser){
	window.browser = window.msBrowser;
	CCMM.language = 'edge';
}
else if(window.browser){
	window.browser = window.browser;
	CCMM.language = 'firefox';
}
else if(window.chrome){
	window.browser = window.chrome;
	CCMM.language = 'chrome';
}