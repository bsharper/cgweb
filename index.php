<!DOCTYPE html>
<html lang="en">
<head>
<title>CG Monitor</title>
<meta name="viewport" content="initial-scale=0.5">
<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800,300' rel='stylesheet' type='text/css'>

<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
<link href="css/bootstrap-editable.css" rel="stylesheet" media="screen">
<link href="css/bootstrapSwitch.css" rel="stylesheet" media="screen">
<link href='css/main.css' rel='stylesheet' type='text/css'>
</head>
<body>
	
	<div class="navbar navbar-fixed-top">
	<div class="navbar-inner">
	<div class="container">
		<div class="topRight">
			<span id="refreshInterval">Refresh (ms)  <span id="refreshTime"></span></span>
			<div class='switch' id="refreshSwitch" data-on="success" data-on-label='On' data-off-label='Off'>
				<input type='checkbox'>
			</div>
			<span>Rows</span>
			<div class='switch' id="rowSwitch" data-on-label='All' data-off-label='Best'>
				<input type='checkbox'>
			</div>
			<div id="connectionStatus"></div>
		</div>
	</div>
	</div>
	</div>
	<div class="container-fluid">
		<div id="main-content">
		<div class='lead'>Worker Information</div>
		<div id="latest" class="notice"></div>
		<hr/>
		<div class='lead'>Event Messages</div>
		<div id="messages" class="well"><button class='btn' id="clearMessages" onclick='clearMessages()' >Clear</button><button class='btn' id="loadAllMessages" onclick='loadAllMessages()' >Load all</button>
			<ul id="pastMessages"></ul>
		</div>
		<div class='lead'>Connection Messages</div>
		<div id="connectionWell" class="well">
			<ul id="connectionLog"></ul>
		</div>
		</div>
	</div>



<div id="poolModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-header">

		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<button class='btn right' onclick='refreshModal()'>Refresh</button>
		<h3 id="poolModalHeader"></h3>
	</div>
	<div class="modal-body"></div>
	<div class="modal-footer">
		<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
	</div>
</div>
<div id="poolManager" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-header">

		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h3 id="poolManager">Pool Management</h3>
		<label for=""
	</div>
	<div class="modal-body"></div>
	<div class="modal-footer">
		<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
	</div>
</div>
<script>coreOptions=<?php echo file_get_contents('server-config.json'); ?>;</script>

<script src="js/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/bootstrap-editable.min.js"></script>
<script src="js/bootstrapSwitch.js"></script>

<script src="js/sprintf.min.js"></script>
<script src="js/moment.js"></script>

<script src="js/noty/jquery.noty.js"></script>
<script src="js/noty/layouts/bottomCenter.js"></script>
<script src="js/noty/layouts/topCenter.js"></script>
<script src="js/noty/layouts/top.js"></script>
<script src="js/noty/themes/default.js"></script>

<script src="js/mon-main.js"></script>
<script src="js/mon-worker-report.js"></script>
<script src="js/mon-messages.js"></script>
<script src="js/mon-pools.js"></script>
<script src="js/mon-page-ready.js"></script>

</body>
</html>
