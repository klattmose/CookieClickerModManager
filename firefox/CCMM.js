var CCMM = {};
CCMM.name = 'Cookie Clicker Mod Manager';
CCMM.version = '0.01';
CCMM.GameVersion = '2.019';

var Game = window.wrappedJSObject.Game;
XPCNativeWrapper(window.wrappedJSObject.Game);

CCMM.init = function(){
	Game.Win('Third-party');
	Game.LoadMod('https://klattmose.github.io/CookieClicker/KlattmoseUtilities.js');
}

CCMM.delay = function(){
	if(Game && Game.ready){
		CCMM.init();
	}
	else{
		requestAnimationFrame(CCMM.delay);
	}
}

requestAnimationFrame(CCMM.delay);