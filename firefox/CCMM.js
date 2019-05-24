var CCMM = {};
CCMM.name = 'Cookie Clicker Mod Manager';
CCMM.version = '0.01';
CCMM.GameVersion = '2.019';

var Game = window.wrappedJSObject.Game;
XPCNativeWrapper(window.wrappedJSObject.Game);

CCMM.launch = function(){
	CCMM.init = function(){
		Game.Win('Third-party');
		CCMM.onMod = 0;
		if(CCMM.onMod < CCMM.activeProfile.mods.length) requestAnimationFrame(CCMM.LoadMod);
	}
	
	CCMM.LoadMod = function(){
		var mod = CCMM.activeProfile.mods[CCMM.onMod++];
		var url = CCMM.config.mods[mod.name];
		var id = url.split('/'); id = id[id.length - 1].split('.')[0];
		
		var nextFunc = CCMM.onMod < CCMM.activeProfile.mods.length ? CCMM.LoadMod : CCMM.finalize;
		var delayFunc = mod.extraDelay ? function(){setTimeout(nextFunc, mod.extraDelay);} : function(){requestAnimationFrame(nextFunc)};
		
		var script = document.createElement('script');
		script.id = 'modscript_' + id;
		script.setAttribute('src', url);
		
		if(mod.waitForScriptLoad){
			script.onload = delayFunc;
			document.head.appendChild(script);
		}else{
			document.head.appendChild(script);
			delayFunc();
		}
	}
	
	CCMM.finalize = function(){
		console.log('CCMM is finished!');
	}
	
	CCMM.delay = function(){
		if(Game && Game.ready){
			CCMM.init();
		}else{
			requestAnimationFrame(CCMM.delay);
		}
	}
	
	requestAnimationFrame(CCMM.delay);
}

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
		activeProfile : 'default'
	}
}

CCMM.loadData = function(){
	function onError(error){
		console.log(`Error: ${error}`);
	}
	
	function onGot(item){
		console.log('storage', item);
		if(item.config) {
			CCMM.config = item.config;
		}else{
			CCMM.config = CCMM.defaultConfig();
			browser.storage.local.set({
				config: CCMM.config
			});
		}
		
		CCMM.activeProfile = CCMM.config.profiles[CCMM.config.activeProfile];
		CCMM.launch();
	}
	
	var getting = browser.storage.local.get();
	getting.then(onGot, onError);
}

CCMM.loadData();