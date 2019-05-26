if(CCMM === undefined) var CCMM = {};

CCMM.defaultConfig = function(){
	return {
		profiles : {
			default : {
				mods : [
					{
						name : 'CCSE',
						waitForScriptLoad : true,
						extraDelay : 0
					},
				],
				saves : {
					Game : '',
					CCSE : ''
				}
			}
		},
		mods : {
			CCSE : 'https://klattmose.github.io/CookieClicker/CCSE.js',
		},
		activeProfile : 'default',
		enabled : true
	}
}

CCMM.loadData = function(callback){
	function onError(error){
		console.log(`Error: ${error}`);
	}
	
	function onGot(item){
		console.log('storage', item);
		if(item.config) {
			CCMM.config = item.config;
		}else{
			CCMM.config = CCMM.defaultConfig();
		}
		
		CCMM.activeProfile = CCMM.config.profiles[CCMM.config.activeProfile];
		callback();
	}
	
	var getting = browser.storage.local.get();
	getting.then(onGot, onError);
}

CCMM.saveData = function(){
	browser.storage.local.set({
		config: CCMM.config
	});
}