if(CCMM === undefined) var CCMM = {};

CCMM.launch = function(){
	CCMM.init = function(){
		Game.Win('Third-party');
		CCMM.onMod = 0;
		if(CCMM.config.enabled && CCMM.onMod < CCMM.config.mods.length) requestAnimationFrame(CCMM.LoadMod);
	}
	
	CCMM.LoadMod = function(){
		var mod = CCMM.config.mods[CCMM.onMod++];
		var nextFunc = CCMM.onMod < CCMM.config.mods.length ? CCMM.LoadMod : CCMM.finalize;
		
		if(mod.enabled){
			var id = CCMM.GuessModId(mod.url);
			
			var delayFunc = mod.extraDelay ? function(){setTimeout(nextFunc, mod.extraDelay);} : function(){requestAnimationFrame(nextFunc)};
			
			var script = document.createElement('script');
			script.id = 'modscript_' + id;
			script.setAttribute('src', mod.url + (CCMM.config.cache ? '' : '?v='+Date.now()));
			
			if(!CCMM.config.async){
				script.onload  = delayFunc;
				script.onerror = delayFunc;			// Load the next one regardless of the failure of this one
				document.head.appendChild(script);
			}else{
				document.head.appendChild(script);
				delayFunc();
			}
			console.log('Loaded the mod ' + mod.url + ', ' + id + '.');
			mod.isLoaded = 1;
			
		}else{ // Skip this one
			requestAnimationFrame(nextFunc);
			mod.isLoaded = 0;
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

CCMM.ScriptInjection = function(){
	var scriptText = `
		var CCMM = {};
		CCMM.launch = ` + CCMM.launch.toString() + `
		CCMM.GuessModId = ` + CCMM.GuessModId.toString() + `
		CCMM.config = ` + JSON.stringify(CCMM.config) + `
		CCMM.launch();
	`;
	
	var scriptDiv = document.createElement('script');
	scriptDiv.textContent = scriptText;
	scriptDiv.id = 'modscript_CCMM';
	document.head.appendChild(scriptDiv);
	
}

CCMM.ModInjection = function(url){
	var id = CCMM.GuessModId(url);
	var script = document.createElement('script');
	script.id = 'modscript_' + id;
	script.setAttribute('src', url);
	document.head.appendChild(script);
}

CCMM.loadData(CCMM.ScriptInjection);

// This script brought to you by Chrome being stupid and screwing up page_action popups
if(CCMM.language == 'chrome') browser.runtime.sendMessage({"message": "activate_icon"});