var tabId = 0;
try {
var tabId = document.URL.match(/tab=([0-9]+)/)[1].toString();
} catch (err) {
}

function spofUpdate() {
	chrome.extension.sendRequest({msg: 'getSPOF', tab: tabId}, function(response) {
		var html = '';
		if (response['isActive']) {
			html += '<h1>Resource blocking is currently Active <button class="disable">Disable</button>';
		} else {
			html += '<h1>Resource blocking is currently Disabled <button class="enable">Enable</button>';
		}
		html += '<button class="reset">Reset</button></h1>'
		if (response['spof'] != undefined) {
			html += '<hr><h1>Possible Frontend SPOF from:</h1><ul class="hosts">';
			for (var i = 0; i < response['spof'].scripts.length; i++) {
				var host = response['spof'].scripts[i].host;
				if (response['spof'].scripts[i].whitelist) {
					html += '<li class="whitelist"><span class="host">' + host + '</span> - whitelisted <button host="' + host + '" class="remove">Remove</button>';
				} else {
					html += '<li><span class="host">' + host + '</span> - <button host="' + host + '" class="add">Whitelist</button>';
				}
				html += '<ul class="scripts">';
				for (var j = 0; j < response['spof'].scripts[i].scripts.length; j++) {
					var position = response['spof'].scripts[i].scripts[j].position.toFixed(0);
					var group = Math.floor(position / 10);
					var script = response['spof'].scripts[i].scripts[j].script.replace(/>/g, '&gt;').replace(/</g, '&lt;');
					html += '<li class="pos' + group + '"> (<b>' + position + '</b>%) - ' + script + '</li>';
				}
				html += '</ul></li>'
			}
			html += '</ul>';
		}
		document.getElementById('content').innerHTML = html;

		// attach the event handlers
		var buttons = document.querySelectorAll("button.enable");
		for (var i = 0, length = buttons.length; i < length; i++) {
				buttons[i].addEventListener('click', spofEnable);
		}
		buttons = document.querySelectorAll("button.disable");
		for (var i = 0, length = buttons.length; i < length; i++) {
				buttons[i].addEventListener('click', spofDisable);
		}
		buttons = document.querySelectorAll("button.reset");
		for (var i = 0, length = buttons.length; i < length; i++) {
				buttons[i].addEventListener('click', spofReset);
		}
		var buttons = document.querySelectorAll("button.remove");
		for (var i = 0, length = buttons.length; i < length; i++) {
				buttons[i].addEventListener('click', spofRemoveWhitelist);
		}
		var buttons = document.querySelectorAll("button.add");
		for (var i = 0, length = buttons.length; i < length; i++) {
				buttons[i].addEventListener('click', spofAddWhitelist);
		}
	});
}

function spofDisable() {
	chrome.extension.sendRequest({'msg': 'disable'}, function(response) {});
	spofUpdate();
}

function spofEnable() {
	chrome.extension.sendRequest({'msg': 'enable'}, function(response) {});
	spofUpdate();
}

function spofReset() {
	chrome.extension.sendRequest({'msg': 'reset'}, function(response) {});
	spofUpdate();
}

function spofRemoveWhitelist(e) {
	chrome.extension.sendRequest({'msg': 'wl_remove', 'host': e.target.getAttribute('host')}, function(response) {});
	spofUpdate();
}

function spofAddWhitelist(e) {
	chrome.extension.sendRequest({'msg': 'wl_add', 'host': e.target.getAttribute('host')}, function(response) {});
	spofUpdate();
}

spofUpdate();