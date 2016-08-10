var nodeData = {
	
	vData: {
		
	},

	ajaxCall: function ajaxCall(values){
		console.log('Running post for Node');
		$.ajax({
			method: "POST",
			dataType: 'json',
			data: values,
			url: "http://139.59.190.164:3000",
		}).done(function(data, textStatus, request) {
			console.log("Finished");
		});
	},

	init: function init() {
		chrome.storage.onChanged.addListener(function(changes, namespace) {
			var data;
			console.log('Changed');
			chrome.storage.local.get('value', function(obj) {
				data = obj.value[0];
				for (var i = 0; i < data.length; i++) {
					strI = i.toString()
					nodeData.vData["property" + strI] = data[i];
					console.log(nodeData.vData);
				}
				nodeData.ajaxCall(nodeData.vData);
			});
		});
	}
}

$(document).ready(function(){
	console.log('running doc');
	nodeData.init();
})