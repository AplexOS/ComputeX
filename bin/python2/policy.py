#!/usr/bin/env python

from ShellCmd import ShellCmd
import json

# 5c5b5ea289ed4c6db75c131e7eaf5715	
# ca49ed4d426541e79f7da83fde4b9e28

citys        = ["Beijing", "Shanghai", "Shenzhen", "Taipei"]
devices      = ["5100", "5102", "5130", "5140"]
type_topics  = ["DataTransfer", "ledBackend", "numBackend", "backend"]

bd_endpoint    = "baidumap"
# p3rZNBfnS8eiNHrG4CQ4mBhGnI8Sx3swcyKeLD4bsi8=
# bd_policy      = "computex"
bd_policy      = "baidumap"
bd_permissions = [
 	{
 		"topic": "computex/+/iot/+/DataTransfer", 
 		"operations": ["PUBLISH","SUBSCRIBE"]
 	}, 
 	{
 		"topic": "computex/+/iot/+/backend", 
 		"operations": ["PUBLISH","SUBSCRIBE"]
 	}
]

count = 0
for city in citys :
	for device in devices :
		for type_topic in type_topics :
			topic = {
				"topic": "computex/" + city + "/iot/" + device + "/" + type_topic, 
				"operations": ["PUBLISH","SUBSCRIBE"]
			} 
			bd_permissions.append(topic);
			
			count += 1


execute_string = "bce.py iot create-policy -e " + bd_endpoint + " -c " + bd_policy + " --permissions \"" + json.dumps(bd_permissions).replace("\"", "\\\"") + "\""

rets = ShellCmd.execute(execute_string);
print(rets);
print("count = " + str(count + 2));
