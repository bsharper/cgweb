keepScanning=false;
ips =[];
aliveIps= {};
function scanWorkers() {
	if (keepScanning) {
		$("#scanButton").removeClass('btn-danger').addClass('btn-success').html('Scan');
		keepScanning = false;
		return;
	}
	keepScanning = true;
	$("#scanResultList").html('');
	$("#scanButton").removeClass('btn-success').addClass('btn-danger').html('Stop');
	bip = $("#baseIP").val();
	sip = $("#startRange").val();
	eip = $("#endRange").val();
	if (bip[bip.length-1]==".") bip = bip.substr(0,bip.length-1);
	ips = [];
	for (var i=sip; i<=eip; i++) {
		ips.push(bip+"."+i);
	}
	ips.reverse();
	scanWorker(ips);
}

function scanWorker(ips) {
	if (!keepScanning || ips.length==0) {
		$("#scanResults").html("Results: idle");
		$("#scanButton").removeClass('btn-danger').addClass('btn-success').html('Scan');
		updateManageWorkers();
		return;
	}
	
	ip = ips.pop();
	$("#scanResults").html(sprintf("Results: scanning %s", ip));
	$.getJSON('rpc_core.php?ip='+ip, function (e) {
		console.log(e);
		try {
			msgtype = (e['STATUS'][0]['STATUS']!="E") ? "information" : "error";
			msg = e['STATUS'][0]['Msg'];
			desc = e['STATUS'][0]['Description'];
			
			$("#scanResultList").append(sprintf('<li>%s: connection ok! %s</li>', ip, desc));
			aliveIps[ip] = desc; 
		} catch (e) {
			$("#scanResultList").append(sprintf('<li>%s: no connection</li>', ip));
		}
		scanWorker(ips);
	});
}

function updateManageWorkers() {
	i=0;
	for (a in aliveIps) i++;
	if (i==0) {
		for (a in coreOptions['worker_ips']) {
			aliveIps[coreOptions['worker_ips'][a]] = a;
		}
	}
	i=0;

	$("#workerList").html('');
	for (a in aliveIps) {
		s = sprintf('<li><label for="worker%d">%s</label><input placeholder="%s" type="text" id="worker%d" value="%s" /></li>',i,a, aliveIps[a], i, aliveIps[a]);
		$("#workerList").append(s);

	}	
}

function saveWorkers() {
	wips = {};
	for (a in aliveIps) {
		wips[aliveIps[a]] = a;
	}
	coreOptions.worker_ips = wips;
	$.getJSON("rpc_core.php?save="+JSON.stringify(coreOptions));
}