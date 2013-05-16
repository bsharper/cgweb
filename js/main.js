function makeTable(data) {
	options = {
		'tableClass':'results',
		'workerHeaders': ["Worker", "GPU Clock" ,"Memory Clock" ,"GPU Voltage" , "Temperature", "Fan Speed" ,"Intensity" ,"Powertune", "MHS av","MHS 5s"],
		'totalColumns': ["MHS av", "MHS 5s"],
		'linkColumns': ["Worker", "GPU Clock", "Memory Clock", "Intensity"]
	};
	hdrs = options['workerHeaders'];
	linkCols = options['linkColumns'];
	totalCols = options['totalColumns'];
	tbl = sprintf("<table class='%s'>", options['tableClass']);
	tbl+= sprintf("<tr><th>%s</th></tr>", hdrs.join("</th><th>"));
	totals = {};
	for (i in totalCols) totals[totalCols[i]] = 0;
	for (worker in data) {
		for (gpu in data[worker]) {
			cgpu = data[worker][gpu];
			tbl += sprintf("<tr data-worker='%s' data-gpu='%d'><td><a href='javascript:;' data-column='Worker'>%s GPU %d", worker, cgpu['GPU'], worker, cgpu['GPU']);
			for (hi in hdrs) {
				hdr = hdrs[hi];
				if (hi==0) continue;
				if (cgpu.hasOwnProperty(hdr)) {
					if ($.inArray(hdr, linkCols) >-1) middle = sprintf("<a href='javascript:;' data-column='%s'>%s</a>", hdr, cgpu[hdr]);
					else middle = cgpu[hdr];
					tbl += sprintf("<td>%s</td>", middle);
					if (totals.hasOwnProperty(hdr)) totals[hdr] += parseFloat(cgpu[hdr]);
				}
			}
			tbl += "</tr>";
		}
	}
	tbl += "<tr><td><span class='totals'>Totals</span></td>";
	cs = 0;
	for (hi in hdrs) {
		
		hdr = hdrs[hi];
		if (hi==0) continue;
		if (totals.hasOwnProperty(hdr)) {
			if (cs > 0) tbl += sprintf("<td class='cstd' colspan='%d'></td>", cs);
			cs = 0;
			tbl += sprintf("<td>%.2f</td>", totals[hdr]);
		} else cs++;
		
	}
	if (cs > 0) tbl += sprintf("<td class='cstd' colspan='%d'></td>", cs);
	tbl += "</tr></table>";
	$("#latest").html(tbl);
	updateHandlers();
	if (firstRun) refreshToggle();
	firstRun = false;
}
function updateWorkerTable() {
	$.getJSON('rpc_core.php?update=true', function (e){
		makeTable(e);
	});
}

function addLoadingAnimation(id) {
	$("#"+id).html("<div class='loader' style='height:100px;'><span></span><span></span><span></span></div>");
}

refreshInterval = null;
$("#autorefresh").click(function () {
	refreshToggle();
});
function refreshToggle() {
	if (continueRefresh) refreshOff();
	else refreshOn();
	return false;
}
function refreshOff(){
	clearInterval(refreshInterval);
	continueRefresh = false;
	$("#autorefresh").removeClass('btn-success');
}
function refreshOn() {
	refreshInterval = setInterval(function () {refreshStatus() }, 5000);
	continueRefresh = true;
	$("#autorefresh").addClass('btn-success');
}

result = null;

function updateHandlers() {
	$("[data-column='Memory Clock']").each(function () { 
		tr = $(this).parent().parent();
		gpu = tr.data('gpu');
		worker = tr.data('worker');
		$(this).data('pk', worker+"|"+gpu)
		$(this).data('name', 'gpumem');

		$(this).data('url', 'rpc_core.php');
		$(this).editable({success: function (a,b) { result=JSON.parse(a); alert(JSON.parse(a)['STATUS'][0]['Msg']); } });
	});
	$("[data-column='GPU Clock']").each(function () { 
		tr = $(this).parent().parent();
		gpu = tr.data('gpu');
		worker = tr.data('worker');
		$(this).data('pk', worker+"|"+gpu)
		$(this).data('name', 'gpuengine');

		$(this).data('url', 'rpc_core.php');
		$(this).editable({success: function (a,b) { result=JSON.parse(a); alert(JSON.parse(a)['STATUS'][0]['Msg']); } });
	});
	$("[data-column='Intensity']").each(function () { 
		tr = $(this).parent().parent();
		gpu = tr.data('gpu');
		worker = tr.data('worker');
		$(this).data('pk', worker+"|"+gpu)

		$(this).data('name', 'gpuintensity');

		$(this).data('url', 'rpc_core.php');
		$(this).editable({success: function (a,b) { result=JSON.parse(a); alert(JSON.parse(a)['STATUS'][0]['Msg']); } });
	});

}
