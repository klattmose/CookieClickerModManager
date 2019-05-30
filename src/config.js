if(CCMM === undefined) var CCMM = {};

CCMM.defaultConfig = function(){
	return {
		mods : [
			{
				name : 'CCSE',
				url : 'https://klattmose.github.io/CookieClicker/CCSE.js',
				enabled : 1,
				waitForScriptLoad : 1,
				extraDelay : 0
			}
		],
		enabled : true
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
	
	if(chrome) chrome.storage.local.get('config', onGot); else browser.storage.local.get('config').then(onGot, onError);
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

window.browser = (function () {
	return window.msBrowser ||
		window.browser ||
		window.chrome;
})();