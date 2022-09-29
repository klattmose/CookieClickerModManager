// This script brought to you by Chrome being stupid and screwing up page_action popups
if(chrome){
	chrome.runtime.onInstalled.addListener(() => {
		chrome.action.disable(); 
	});
	
	chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.message === "activate_icon"){
			chrome.action.enable(sender.tab.id);
		}
	});
}
