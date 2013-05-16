cgweb (Anyone have a better name?)
=====
Donations accepted: 15aGBhdRxPT6dv3wU5boALH6MC4kEyxQLg

This is a web-based cgminer administration utility.  Currently you can only change the GPU clock, Memory clock and Intensity through the interface, though adding pool management should go quickly.

To use this, copy all of the files into /var/www (or your active server directory).  Configure server.config to point to your workers, and point your browser at the web server.

NOTE: This WILL NOT WORK if you do not have cgminer's API access enabled.  You should add something like this to the cgminer command line to get it to work:
	--api-listen --api-network --api-allow 192.168.1.100
where 192.168.1.100 is the name of the computer that will be hosting the files.  

Please keep in mind that if your LAN isn't secure, anyone can adjust your cgminer settings.

All of the PHP socket code is taken from the cgminer miner.php api example (https://github.com/ckolivas/cgminer)

All of the files in JS, IMG and CSS are from other JS libraries with the exception of main.js and main.css.

Software (The versions I use are noted but not necessarily required)
* OSes tested: Ubuntu and Rasbian
* Written in PHP (5) (no longer relies on Python)
* Apache (2.2)
* Interfaces with CGMiner (2.11 or 3) using RPC
* Intensity, GPU clock and Memory clocks can be changed asynchronously (uses Bootstrap with X-Editable)
* Pools can be added, deleted, enabled and disabled asynchronously
* Worker detail updated at regular intervals (the default is 5 seconds)
* Pool and local logging with PostgreSQL (this probably wouldn't get pushed up right away)
* One simple speed per GPU graph using Highcharts
