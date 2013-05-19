CGMiner Web Monitor
=====
Donations accepted: 15aGBhdRxPT6dv3wU5boALH6MC4kEyxQLg

This is a web-based cgminer administration utility.  Currently you can change the GPU clock, Memory clock and Intensity, as well as add, remove and enable pools.

To use this, copy all of the files into /var/www (or your active server directory).  Configure server-config.json (an example of what this looks like has been provided) to point to your workers, and point your browser at the web server.

NOTE: This WILL NOT WORK if you do not have cgminer's API access enabled.  You should add something like this to the cgminer command line to get it to work:
	--api-listen --api-network --api-allow 192.168.1.100
where 192.168.1.100 is the name of the computer that will be hosting the files.  

Please keep in mind that if your LAN isn't secure, anyone can adjust your cgminer settings.

All of the PHP socket code is taken from the cgminer miner.php api example (https://github.com/ckolivas/cgminer)

All of the files in JS, IMG and CSS are from other JS libraries with the exception of anything with the mon- (montior) prefix.

Tested on (The versions I use are noted but not necessarily required)
* Ubuntu and Rasbian
* Written in PHP (5) 
* Apache (2.2)
* Interfaces with CGMiner (2.11 or 3) using RPC
* Intensity, GPU clock and Memory clocks can be changed asynchronously (uses Bootstrap with X-Editable)
* Pools can be added, deleted, enabled and disabled asynchronously
* Worker detail updated at regular intervals (the default is 5 seconds)