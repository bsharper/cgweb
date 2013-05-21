<?php

global $workers;

$string = file_get_contents("server-config.json");
$config=json_decode($string,true);
$workers = $config['worker_ips'];

function readsockline($socket) {
	$line = '';
	while (true) {
 	$byte = socket_read($socket, 1);
	if ($byte === false || $byte === '')
		break;
	if ($byte === "\0")
		break;
	$line .= $byte;
 	}
	return $line;
}
function api_convert_escape($str)
{
 $res = '';
 $len = strlen($str);
 for ($i = 0; $i < $len; $i++)
 {
	$ch = substr($str, $i, 1);
	if ($ch != '\\' || $i == ($len-1))
		$res .= $ch;
	else
	{
		$i++;
		$ch = substr($str, $i, 1);
		switch ($ch)
		{
		case '|':
			$res .= "\1";
			break;
		case '\\':
			$res .= "\2";
			break;
		case '=':
			$res .= "\3";
			break;
		case ',':
			$res .= "\4";
			break;
		default:
			$res .= $ch;
		}
	}
 }
 return $res;
}

function revert($str) {
	return str_replace(array("\1", "\2", "\3", "\4"), array("|", "\\", "=", ","), $str);
}
function rpc($addr, $port, $command, $parameter, $json=true) {
	$socksndtimeoutsec = 1;
	$sockrcvtimeoutsec = 1;

	$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
	if ($socket === false || $socket === null) {
		return "{'error': 'could not create socket'}";
	}

	socket_set_option($socket, SOL_SOCKET, SO_SNDTIMEO, array('sec' => $socksndtimeoutsec, 'usec' => 0));
	socket_set_option($socket, SOL_SOCKET, SO_RCVTIMEO, array('sec' => $sockrcvtimeoutsec, 'usec' => 0));
	

	$res = socket_connect($socket, $addr, $port);
	if ($res == false) {
		return "{'error': 'socket could not connect'}";
	}
	
	$cmd = '{"command": "'.$command.'", "parameter":"'.$parameter.'"}';
	
	socket_write($socket, $cmd, strlen($cmd));

	$line = readsockline($socket);
	socket_close($socket);
	if ($json) return json_decode($line, $assoc=true);
	return $line;
}

function workerInfo($ip) {	
	$rvs = [];
	$j = rpc($ip, 4028, 'gpucount', '');
	if (!array_key_exists("GPUS", $j)) return "error";
	$cnt = $j["GPUS"][0]["Count"];
	for ($i=0; $i<$cnt; $i++) {
		$lj = rpc($ip, 4028, 'gpu', $i);
		if (!array_key_exists("GPU", $lj)) return "error";
		array_push($rvs, $lj['GPU'][0]);
	}
	return $rvs;
	

}
if (isset($_REQUEST['update'])) {
	global $workers;
	$rvs = [];
	foreach ($workers as $worker => $ip) {
		$rvs[$worker] = workerInfo($ip);

	}
	echo json_encode($rvs);
}

if (isset($_REQUEST['save'])) {
	$save = $_REQUEST['save'];	
	file_put_contents("server-config.json", $save);
}
if (isset($_REQUEST['ip'])) {
	$ip = $_REQUEST['ip'];	
	$rv = rpc($ip, 4028, "summary", "");
	echo json_encode($rv);
}

if (isset($_REQUEST['name'])) {
	global $workers;
	
	//$f = fopen('rlog.txt', 'a');
	//$txt = json_encode($_REQUEST);
	//fwrite($f, $txt."\n");
	//fclose($f);

	$nm = $_REQUEST['name'];
	$val = $_REQUEST['value'];
	$pk =  $_REQUEST['pk'];
	if (strlen($pk) > 0 && strstr($pk, '|')) {
		$els = explode('|', $pk);
		$gpu = $els[1];
		$worker = $els[0];
		$param = $gpu.",".$val;
	} else {
		$worker = $_REQUEST['worker'];
		$param = $_REQUEST['param'];
	}
	$rv = rpc($workers[$worker], 4028, $nm, $param);
	echo json_encode($rv);
}
?>
