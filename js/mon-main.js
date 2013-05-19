
var refreshState = null;
var refreshInterval = null;
var refreshTime = 5000;
var currentWorker = "";


/**
 * Adds a pretty loading animation
 * @param {string} id
 */
function addLoadingAnimation(id) {
	$("#"+id).html("<div class='loader' style='height:100px;'><span></span><span></span><span></span></div>");
}

/**
 * Adds a spinner animation
 * @param {string} id
 */
function addSpinner(id) {
	s='<div class="spinner"><div class="bar1"></div><div class="bar2"></div>    <div class="bar3"></div>    <div class="bar4"></div>    <div class="bar5"></div>    <div class="bar6"></div>    <div class="bar7"></div>    <div class="bar8"></div>    <div class="bar9"></div>    <div class="bar10"></div>    <div class="bar11"></div>    <div class="bar12"></div>  </div>';
	$(id).html(s);
}

/**
 * Sets the correct state when the refresh is toggled
 * @param  {boolean} val
 * @return {boolean}
 */
function refreshToggle(val) {
	if (val==undefined) {
		if (continueRefresh) refreshOff();
		else refreshOn();
	} else {
		if (val) refreshOn();
		else refreshOff();
	}
	return false;
}

/**
 * Turns report refresh off
 * @param  {[type]} nostore
 * @return {[type]}
 */
function refreshOff(nostore){
	continueRefresh = false;
	updateWorkerTable = function () {};
	clearInterval(refreshInterval);
}

/**
 * Turns report refresh on
 * @param  {[type]} nostore
 * @return {[type]}
 */
function refreshOn(nostore) {
	updateWorkerTable = throttle(_updateWorkerTable, refreshTime-20);
	clearInterval(refreshInterval);
	refreshInterval = setInterval(function () { refreshWorkerInfo() }, refreshTime);
	continueRefresh = true;	
}

/**
 * Pauses report refreshing (like when a clock value is being entered)
 * @return {[type]}
 */
function pauseRefresh() {
	refreshState = continueRefresh;
	continueRefresh = false;
}
/**
 * Unpause
 * @return {void}
 */
function unpauseRefresh() {
	continueRefresh = refreshState;
}



function activateTab() {
	$("[data-toggle='tab'][href='"+currentTab+"']").tab('show')
}

function refreshModal() {
	currentTab = $("#poolTab li[class='active'] a").attr('href');
	openModal(null, activateTab);
}


function openModal(url, callback) {
	if (url==null) url = "rpc_core.php?name=pools&worker="+currentWorker;
	$.getJSON(url, function (e) {
		$("#poolModalHeader").html(currentWorker);
		ht = createPoolModal(e['POOLS']);
		$("#poolModal .modal-body").html(ht);
		$("#poolModal").modal();
		if (callback!=null) callback();
	});
}
ntn=null;
var workerData= {};

// from underscore.js
function throttle(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

