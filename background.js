var nodeData = {

	ajaxCall: function ajaxCall(){
		console.log('Running post for Node');
		$.ajax({
			method: "POST",
			url: "http://139.59.190.164:3000",
		}).done(function(data, textStatus, request) {
			console.log("Finished");
		});
	},

	init: function init() {
		chrome.storage.onChanged.addListener(function(changes, namespace) {
			console.log('Changed');
			chrome.storage.local.get('value', function(obj) {
				console.log(obj.value[0]);
				nodeData.ajaxCall();
			});
		});
	}
}

$(document).ready(function(){
	console.log('running doc');
	nodeData.init();
})