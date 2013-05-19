<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

if (isset($_REQUEST['drivers'])) {
foreach(PDO::getAvailableDrivers() as $driver)
    {
    echo $driver.'<br />';
    }
}


try { 
  $db = new PDO('sqlite:db/messages.sqlite3');
} catch(PDOException $e) {
    echo $e->getMessage();
}

try{
$db->exec('CREATE TABLE IF NOT EXISTS messages (
    message_id INTEGER PRIMARY KEY, 
    address text,
    title TEXT, 
    message TEXT, 
    time INTEGER)');
} catch(PDOException $e) {
  echo $e->getMessage();
}  
if (isset($_REQUEST['load'])) {
  $nm = $_REQUEST['load'];
  $cmd = 'select * from messages where message_id >'.$nm.' order by time';
  try {
    $ar = []; 
    foreach($db->query($cmd, PDO::FETCH_ASSOC) as $row) {  
      array_push($ar, $row);
    }
    echo json_encode($ar);
  } catch(PDOException $e) {
    echo $e->getMessage();
  }
}

if (isset($_REQUEST['message'])) {
  $title = $_REQUEST['title'];
  $message = $_REQUEST['message'];
  $addr = $_SERVER['REMOTE_ADDR'];
  echo 'saving '.$title.': '.$message.'<br/>';
  
  $cmd = 'insert into messages (address, title, message, time) values ("'.$addr.'", "'.$title.'", "'.$message.'", '.time().')';
  echo $cmd;
  try {
    
    $db->exec($cmd);
    
  } catch(PDOException $e) {
    echo $e->getMessage();
  }
}

?>