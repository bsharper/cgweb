import json
import hashlib

class MonitorConfig:
	
	def __init__(self):
		self.loadConfig()

	def loadConfig(self):
		txt = open('server.config').read()
		h = hashlib.new('sha256')
		h.update(txt)
		conf = json.loads(txt)
		conf['hash'] = h.hexdigest()
		self.conf = conf

	def writeConfig(self):
		lconf = self.conf.copy()
		del lconf['hash']
		open('server.config', 'w').write(json.dumps(lconf))
	
	def getWorkerIPs(self):
		return self.conf['worker_ips']

config = MonitorConfig()
