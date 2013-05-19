var updateData = null;
var allRows = false;
var lastUpdate = null;
var connectionLogAr = [];

function connectionEvent(msg) {
	tm = moment().format('MM/DD/YYYY, h:mm:ss.SSS A');
	while (connectionLogAr.length > 10) connectionLogAr.shift();
	
	connectionLogAr.push(tm + ": <strong>" + msg+ "</strong>");

	
	$("#connectionLog").html('');
	for (a in connectionLogAr) {
		$("#connectionLog").append('<li>'+connectionLogAr[a]+"</li>");
	}
}

/**
 * Adds function handlers after the report is generated
 * @return {void}
 */
function updateHandlers() {
	$("[data-column='Memory Clock']").editify('gpumem');
	$("[data-column='Intensity']").editify('gpuintensity');
	$("[data-column='GPU Clock']").editify('gpuengine');
	$("[data-column='Worker']").click(function () {
		tr = $(this).parent().parent();
		worker = tr.data('worker');
		gpu = tr.data('gpu');
		url = "rpc_core.php?name=pools&worker="+worker;
		currentWorker = worker;
		openModal(url);
	});
}

/**
 * Makes sure the toggle is on before running refresh
 * @return {void}
 */
function checkRefreshState() {
		if (!$("#refreshSwitch").bootstrapSwitch('status')) {
		clearInterval(refreshInterval);
		continueRefresh = false;
	}
	if (lastUpdate==null) lastUpdate = new Date();
	lastUpdate = new Date();
}

/**
 * Updates the table after checking refresh should be on
 * @return {void}
 */
function refreshWorkerInfo() {
	checkRefreshState();
	if (!continueRefresh) return;
	if (updateWorkerTable != null) updateWorkerTable();
	loadDBMessages();
}


/**
 * The actual function that refreshes the table
 * Wrapped in a throttle object to prevent too many requests
 * @return {void}
 */
function _updateWorkerTable() {
	connectionEvent('Updating worker report');
	$.getJSON('rpc_core.php?update=true', function (e){
		createTable(e);
		connectionEvent('Worker report update complete');
	});
}

/**
 * Recalculates totals when the scan update method is used
 * @return {void}
 */
function recalcTotals() {

	$("[data-total-col]").each(function () {
		ht =$(this).data('total-col');
		ci =$("th:contains('"+ht+"')").index()+1;
		rtotal = 0;
		$("td:nth-child("+ci+")").each(function() {
			rtotal += parseFloat($(this).text());
		});
		$(this).html(sprintf("%.2f", rtotal));
	});
}
/**
 * Generates the fanspeed column
 * @param  {object} dt Row data
 * @return {string}
 */
function fanspeed(dt) {
	if (dt['Fan Speed'] < 20) return sprintf('<td>%d%%</td>', dt['Fan Percent']);
	return sprintf('<td>%d (%d%%)</td>' , dt['Fan Speed'], dt['Fan Percent']);
}
/**
 * Checks if a GPU is running 
 * @param  {object} dt Row data
 * @return {boolean}
 */
function statusCore(dt) {
	if (dt['Status']==='Dead' || dt['Status']==='Sick') return false;
	return true;
}
/**
 * Generates the status column
 * @param  {object} dt Row data
 * @return {string}
 */
function status(dt) {
	if (statusCore(dt)) {
		color="transparent";
		icon="icon-ok";
	} else {
		color="red";
		icon ="icon-warning-sign";

	}
	return sprintf("<div class='mid status-box %s'><span class='%s'></span></div>", color, icon);
}
/**
 * Generates the worker name column
 * @param  {object} dt Row data
 * @param  {string} worker Current worker name
 * @return {string}
 */
function workerDisplay(dt, worker) {
	return sprintf("<td><a href='javascript:;' data-column='Worker'>%s GPU %s</a></td>" , worker, dt['GPU']);
}
/**
 * Generates a status column
 * @param  {object} dt Row data
 * @param  {string} worker Current worker name
 * @return {string}
 */
function scanCol(dt, worker) {
	return sprintf("<td class='worker-status' data-worker-status='%s' id='scan-%s_%s'>%s</td>", worker, worker, dt['GPU'], status(dt));
}

/**
 * Creates a row (tr) in the worker table
 * @param  {object} cgpu Current row object
 * @param  {array} headers Header array
 * @param  {string} worker Worker name
 * @param  {integer} gpu GPU number
 * @param  {integer} rowNum Row number
 * @param  {array} linkCols Which columns have links
 * @return {string}
 */
function createRow(cgpu, headers, worker, gpu, rowNum, linkCols) {
	tr = "";
	if (linkCols==null) linkCols = coreOptions['tableOptions']['linkColumns'];
	nm = sprintf("%s %s", worker, cgpu['GPU']);
	if (!statusCore(cgpu)) {
		n = noty({'type':'error', 'text':sprintf("%s is Dead!", nm), 'layout':'topCenter'});
	}
	rClass = "";
	if (rowNum%2!=0) rClass = " otherRow";

	tr += sprintf("<tr data-worker='%s' data-rownum='%s' class='%s' data-gpu='%s'>", worker, rowNum, rClass, cgpu['GPU']);
	for (hi in headers) {
		hdr = headers[hi];
		if (cgpu.hasOwnProperty(hdr) || typeof hdr == "object") {
			to = "<td>";
			tc = "</td>";
			if (typeof hdr == "object") {
					txt = window[hdr[1]](cgpu, worker); 
					hdr = hdr[0];
					to = "";
					tc = "";
				} else txt = cgpu[hdr];
				if ($.inArray(hdr, linkCols) >-1) middle = sprintf("<a href='javascript:;' data-column='%s'>%s</a>", hdr, txt);
				else middle = txt;
			
				tr += sprintf("%s%s%s", to, middle,tc);
				if (totals.hasOwnProperty(hdr)) totals[hdr] += parseFloat(cgpu[hdr]);
		}
	}
	tr += "</tr>";
	return tr;
}

var currentHeaders = null;
function createTable(data) {
	
	if (data==null) data = updateData;
	updateData = data;
	options = coreOptions['tableOptions'];
	var hdrs = options['workerHeaders'];
	linkCols = options['linkColumns'];
	totalCols = options['totalColumns'];
	tbl = sprintf("<table class='%s'>", options['tableClass']);
	if (allRows) {
		for (r in data) {
			na =Object.keys(updateData[r][0]).sort();
			hdrs = [["Worker", "workerDisplay"]];
			$.each(na, function (i, item) { hdrs.push(item)});
			break;
		}
	}
	tbl+= sprintf("<tr><th>%s</th></tr>", $.map(hdrs, function (n,i) { return (typeof n === "object") ? n[0] : n;}).join("</th><th>"));
	totals = {};
	rowNum = 0;
	currentHeaders = hdrs;
	for (i in totalCols) totals[totalCols[i]] = 0;
	for (worker in data) {
		try {
			for (gpu in data[worker]) {
					rowNum += 1;
					cgpu = data[worker][gpu];
					tbl += createRow(cgpu, hdrs, worker, gpu, rowNum, linkCols);
			} 
		}catch(e) {console.log(e)}
	}
	tbl += "<tr><td><span class='totals'>Totals</span></td>";
	cs = 0;
	for (hi in hdrs) {
		
		hdr = hdrs[hi];
		if (hi==0) continue;
		if (totals.hasOwnProperty(hdr)) {
			if (cs > 0) tbl += sprintf("<td class='cstd' colspan='%d'></td>", cs);
			cs = 0;
			tbl += sprintf("<td data-total-col='%s'>%.2f</td>", hdr,totals[hdr]);
		} else cs++;
		
	}
	if (cs > 0) tbl += sprintf("<td class='cstd' colspan='%d'></td>", cs);
	tbl += "</tr></table>";
	$("#latest").html(tbl);
	updateHandlers();

}


/**
 * Update a specific GPU's information
 * @param  {string} worker
 * @param  {integer} gpu
 * @return {void}
 */
function updateGPU(worker, gpu) {
	url = sprintf("rpc_core.php?name=gpu&worker=%s&param=%s", worker, gpu);
	$.getJSON(url, function (e) {
		if (!continueRefresh) return;
		wk = e['STATUS'][0]['Description'];
		workerData[wk]['gpu'+gpu] = e['GPU'][0];

		ltr =$('[data-gpu="'+gpu+'"][data-worker="'+worker+'"]');
		rowNum = ltr.data('rownum');
		nrow = createRow(e['GPU'][0], currentHeaders, wk, gpu, rowNum);
		
		ltr.html($(nrow).html());
		recalcTotals();
		updateHandlers();
	});
}
/**
 * Starts the scan-type update
 * @return {void}
 */
function startScanUpdate() {
	checkRefreshState();
	if (!continueRefresh) return;
	scanUpdate();
}

/**
 * Scans the workers, by row, for updated information
 * @param  {string} wk
 * @param  {integer} tm
 * @return {[type]}
 */
function scanUpdate(wk, tm) {
	if (wk==null) {
		wks = coreOptions['worker_ips'];
		cnt = 0;
		for (a in wks) cnt++;
		pertime = refreshTime/cnt;
		i=0;
		for (wk in wks) {
				scanUpdate(wk,i*pertime);
				i++;
		}
		return;
	}

	setTimeout(function () {
		if (!continueRefresh) return;
		sc = sprintf("[data-worker-status='%s'] .status-box",wk);
		//addSpinner(sc);
		$(sc).animate('background-color', 'yellow');
		addSpinner(sc);

		url = "rpc_core.php?name=gpucount&worker="+ wk;
		$.getJSON(url, function (e) {
			wk = e['STATUS'][0]['Description'];
			gpucount = e["GPUS"][0]["Count"];
			workerData[wk] = {'gpucount':gpucount};
			for (i=0; i<gpucount; i++) updateGPU(wk, i);
		});
	}, tm);
}

