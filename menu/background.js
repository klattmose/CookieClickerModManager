// This script brought to you by Chrome being stupid and screwing up page_action popups
if(chrome){
	chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.message === "activate_icon"){
			chrome.pageAction.show(sender.tab.id);
		}
	});
}
