
/**
 * [addPool description]
 */
function addPool() {
	$("#addPoolButton").addClass('disabled');

	fields = ["url", "username", "password"];
	vals="";
	for (f in fields) {
		vals += $("#np_"+fields[f]).val()+","
	}
	vals = vals.substr(0,vals.length-1);
	url = sprintf("rpc_core.php?name=addpool&worker=%s&param=%s", currentWorker, vals);
	$.getJSON(url, function (e) { rpcMessage(e, openModal())});
}
/**
 * Removes a pool from a worker
 * @param  {integer} n The pool number (cgminer's index)
 * @return {void}
 */
function removePool(n) {
	if (confirm('Remove pool?')) {
		$("#removePoolButton").addClass('disabled');
		url = sprintf("rpc_core.php?name=removepool&worker=%s&param=%s", currentWorker, n);
		$.getJSON(url, function (e) { rpcMessage(e, openModal())});
	}
}
/**
 * Activates a pool
 * @param  {integer} n The pool number (cgminer's index)
 * @return {void}
 */
function activatePool(n) {
	$("#activatePoolButton").addClass('disabled');
	url = sprintf("rpc_core.php?name=switchpool&worker=%s&param=%s", currentWorker, n);
	$.getJSON(url, function (e) { rpcMessage(e, openModal())});		
}

/**
 * Creates the HTML for the per worker pool modal
 * @param  {object} j The object that was loaded from rpc_core.php
 * @return {void}
 */
function createPoolModal(j) {
	var keys = ["URL", "User", "Has Stratum", "Accepted", "Status"];
	var tab = '<ul class="nav nav-tabs" id="poolTab">';
	for (a in j) {
		if (a==0) act = " class='active'";
		else act="";
		tab += sprintf("<li%s><a href='#pool%s' data-toggle='tab'>Pool %s</a></li>", act, a, a);
		tab += sprintf("<li><a href='#poolFull%s' data-toggle='tab'>Pool %s (details)</a></li>", a, a);
	}
	tab += "<li><a href='#addPool' data-toggle='tab'><span class='icon-plus'></span>Add Pool</a></li>";
	tab += "</ul>";
	
	txt = "<div class='tab-content'>";
	for (a in j) {
		if (a==0) act = "active";
		else act="";
		txt += sprintf("<div class='tab-pane %s' id='pool%s'><table class='poolTable'>", act, a);
		for (k in keys) txt += sprintf("<tr><td><strong>%s</strong></td><td>%s</td></tr>", keys[k], j[a][keys[k]]);
		if (j[a]['Priority']>0) txt += sprintf("<tr><td colspan='2'><button class='btn btn-success' style='float:right' id='activatePoolButton' onclick='activatePool(%s)'>Activate Pool</button></td></tr>", a);
		txt += "</table></div>";
		txt += sprintf("<div class='tab-pane' id='poolFull%s'><table class='poolTable'>", a);
		for (k in j[a]) txt += sprintf("<tr><td><strong>%s</strong></td><td>%s</td></tr>", k, j[a][k]);
		txt += sprintf("<tr><td colspan='2'><button class='btn btn-danger' style='float:right' id='removePoolButton' onclick='removePool(%s)'>Remove Pool</button></td></tr>", a);
		txt += "</table></div>";
	}
	txt += "<div class='tab-pane' id='addPool'><table class='poolTable'>";
	np = ["URL", "Username", "Password"];
	for (n in np) {
		txt += sprintf("<tr><td><strong>%s</strong></td><td><input type='text' id='np_%s' /></td></tr>", np[n],np[n].toLowerCase());
	}
	txt += "<tr><td colspan='2'><button class='btn btn-success' style='float:right' id='addPoolButton' onclick='addPool()'>Add Pool</button></td></tr>";
	txt += "</table></div>";
	return tab + txt + "</div>";
}
