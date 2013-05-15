import socket
import json

def rpc(**args):
	# vals = default values
	vals = {"parameter":"", "host":"192.168.1.201", "port":4028, "command":"summary", "verbose":False, "raw_return":False}
	vals.update(args)
	HOST, PORT = vals['host'], vals['port']
	
	data = '{"command": "%s", "parameter":"%s"}' % (vals['command'], vals['parameter'])
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	try:
		
		sock.connect((HOST, PORT))
		sock.sendall(data)
		
		received = sock.recv(16384)

	finally:
		sock.close()
	if vals["verbose"]:
		print "IP:       %s" % (HOST)
		print "Sent:     {}".format(data)
		print "Received: {}".format(received)
	if vals['raw_return']: return received[:-1]
	j = json.loads(received[:-1])
	rv = []
	for k in j.keys():
		if k!='STATUS' and k!='id':
			rv.append(j[k])
	if len(rv)==0 and "STATUS" in j:
		rv.append(j['STATUS'])	
	return rv[0]

def workerinfo(host, verbose = False):
	rvs = []
	cnt =rpc(command="gpucount", host=host)[0]['Count']
	for a in range(cnt):
		g = rpc(command="gpu", parameter=a, host=host, verbose=verbose)
		rvs.append(g[0])
	return rvs

def colName(a):
	return a.strip().replace(' ', '_').lower()
