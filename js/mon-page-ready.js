var continueRefresh = true;
var agent=null;
var messageNumber = 1;
var clearMessageNumber = 1;
var result = null;
var currentTab = null;
var workerData= {};

/**
 * Adds the editify jQuery property.
 * This is used for changing parameters on the report
 * @param  {string} command What the RPC command will be for this edit
 * @return {void}
 */
$.fn.editify = function(command) {
  return this.each(function() {
    $t = $(this);
    tr = $(this).parent().parent();
		gpu = tr.data('gpu');
		worker = tr.data('worker');
		$t.data('pk', worker+"|"+gpu);
		$t.data('name', command);
		$t.data('url', 'rpc_core.php');
		$t.click(function () { pauseRefresh(); })
		$t.editable({'savenochange': true, success: function (a,b) { result=JSON.parse(a); rpcMessage(JSON.parse(a)); } });
  });
};

/**
 * On Page Load process
 * This should be the only page load function for my JS
 * @return {void}
 */
$(function() {
	addLoadingAnimation("latest");	
	
	//loadMessages();
	
	loadDBMessages();
	
	refreshTime = localStorage.getItem('refreshInterval');
	if (refreshTime==null) refreshTime = 5000;
	if (refreshTime < 500) refreshTime = 5000;
	
	$("#refreshTime").data('value', refreshTime);
	$("#refreshTime").editable({'mode':'inline', 'savenochange': true,  'validate': function (e) { refreshTime = e; localStorage.setItem('refreshInterval', e) }});

	$('#refreshSwitch').on('switch-change', refreshToggle);
	$('#rowSwitch').on('switch-change', function () {
		allRows = $(this).bootstrapSwitch('status');
		createTable();
	}).find('.switch-left').removeClass('switch-left').addClass('switch-right');

	$(".switch").on('switch-change', function () {
		switch_val = $(this).bootstrapSwitch('status');
		localStorage.setItem('switch-'+$(this).attr('id'), switch_val);
	});

	$(".switch").each(function () {
		switch_id = 'switch-'+$(this).attr('id');
		switch_val = localStorage.getItem(switch_id);
		if (switch_val != null) $(this).bootstrapSwitch('setState', (switch_val==="true"));
	});

	$.getJSON('rpc_core.php?update=true', function (e){ createTable(e); });

});

