cgweb
=====
Donations accepted: 15aGBhdRxPT6dv3wU5boALH6MC4kEyxQLg

This is stub for a web-based cgminer monitoring and administration project.  

I still have to clean up the initial commit before it gets pushed up which should happen this weekend (5/20/13)


Software (The versions I use are noted but not necessarily required)
* OSes tested: Ubuntu and Rasbian
* Written in PHP (5) and Python (2.7)
* Apache (2.2)
* Interfaces with CGMiner (2.11 or 3) using RPC (using Python's socket)
* Intensity, GPU clock and Memory clocks can be changed asynchronously (uses Bootstrap with X-Editable)
* Pools can be added, deleted, enabled and disabled asynchronously
* Worker detail updated at regular intervals (the default is 5 seconds)
* Pool and local logging with PostgreSQL (this probably wouldn't get pushed up right away)
* One simple speed per GPU graph using Highcharts
