
/**
 * Parses the return value of a RPC call
 * Logs the message and displays notifications
 * @param  {object}   j JSON response from cgminer
 * @param  {Function} callback Optional call back to run after this function is done
 * @return {void}
 */
function rpcMessage(j, callback) {
	unpauseRefresh();
	msgtype="error";
	try {
		msgtype = (j['STATUS'][0]['STATUS']!="E") ? "information" : "error";
		msg = j['STATUS'][0]['Msg'];
		desc = j['STATUS'][0]['Description'];
	} catch(e) {
		desc = "";
		msgtype = "error";
		msg = "Unknown error";
	}

	var n = noty({'text':msg, 'type':msgtype, 'layout':'topCenter'});
	
	remoteLog(msgtype, desc, msg);
	if (msgtype=="error") updateWorkerTable();
	else setTimeout(function () { n.close() }, 5000);
	if (callback!=null) callback();
}
/**
 * Logs the message on server
 * @param  {string} Message type (title)
 * @param  {string} Which worker the message was sent to (who)
 * @param  {string} The message
 * @return {void}
 */
function remoteLog(title, who, message) {
	$.ajax({
		url:sprintf('logger.php?title=%s&message=<u>%s</u> %s', title, who, message),
		complete: loadDBMessages
	});	
}
/**
 * Save messages in localStorage (not currently used)
 * @return {void}
 */
function saveMessagesLocal() {
	try{
		s = $("#pastMessages").prop('outerHTML');
		localStorage.setItem('pastMessages', s);
	} catch (e) {
		console.log(e);
	}
}
/**
 * Loads messages from the server
 * @return {void}
 */
function loadDBMessages() {
	messageNumber = localStorage.getItem('messageNumber');
	if (messageNumber==null) messageNumber = 0;
	$.ajax('logger.php?load='+messageNumber, { 
		success: function (e) { 
			j = JSON.parse(e);
			$("#pastMessages").html('');
			for (a in j) {
				row = j[a];
				icon = "";
				if (row['title']=="information") icon = "<span class='icon-info-sign'></span>";
				else if (row['title']=="error") icon= "<span class='icon-warning-sign'></span>";
				clearMessageNumber = Math.max(clearMessageNumber, row['message_id']);
				li = sprintf("<li>%s: <strong>%s %s</strong> <span class='italics'>(%s)</span> </li>",moment.unix(row['time']).format('MM/DD/YYYY, h:mm:ss A'), row['message'],icon,  row['address']);
				$("#pastMessages").append(li);
			}
		}
	});
}
/**
 * Reloads messages from the server 
 * @return {void}
 */
function loadAllMessages() {
	localStorage.setItem('messageNumber', -1);
	loadDBMessages();
}
/**
 * Loads message stored in localstorage
 * @return {void}
 */
function loadMessages() {
	try{
		s = localStorage.getItem('pastMessages');
		if (s=="undefined" || s==null || s=="null") return;
		$("#pastMessages").prop('outerHTML', s);
	} catch (e) {
		$("#pastMessages").html(e);
	}
}
/**
 * Sets the messageNumber to the currently display max message number.
 * This number is used to determine which messages are returned
 * @return {void}
 */
function clearMessages() {
	messageNumber = clearMessageNumber;
	localStorage.setItem('messageNumber', messageNumber);
	loadDBMessages();
}
