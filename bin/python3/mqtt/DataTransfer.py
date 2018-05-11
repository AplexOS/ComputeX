#!/usr/bin/env python
# -*- coding: utf-8 -*-

import paho.mqtt.client as mqtt
import json
import threading
import random
import time

# 初始化配置
class DataTransfer(threading.Thread):

    def __init__(self, city, name):

        threading.Thread.__init__(self)
        self.__mutex = threading.Lock()
        self.__city = city
        self.__name = name
        self.connected = False;

    def on_connect(self, client, userdata, flags, rc):
        print(self.__name + ': connected with result code ' + str(rc))
        print("computex/" + self.__city + "/iot/" + self.__name + "/ledBackend")
        client.subscribe("computex/" + self.__city + "/iot/" + self.__name + "/ledBackend")
        print("computex/" + self.__city + "/iot/" + self.__name + "/numBackend")
        client.subscribe("computex/" + self.__city + "/iot/" + self.__name + "/numBackend")
        self.connected = True;

    def on_message(self, client, userdata, msg):
        print(msg.topic + ' ' + str(msg.payload))
        print(json.loads(msg.payload.decode('utf8')))

    def on_disconnect(self, client, userdata, rc):
        print("{} device disconnect".format(self.__city, self.__name))
        self.connected = False;
        while True :
            time.sleep(5);
            try :
                self.__mqttc.reconnect()
            except :
                print("{} device connect error".format(self.__city, self.__name))
            else:
                break;

    def connect(self):
        self.__mutex.acquire()

        self.__mqttc = mqtt.Client(client_id="DeviceId-" + '%06x' % random.randrange(16**12))
        self.__mqttc.username_pw_set("baidumap/iotmap", "bjBb+EUd5rwfo9fBaZUMlwG8psde+abMx35m/euTUfE=")
        self.__mqttc.on_connect = self.on_connect
        self.__mqttc.on_message = self.on_message
        self.__mqttc.on_disconnect = self.on_disconnect

        while True:
            try:
                self.__mqttc.connect('baidumap.mqtt.iot.gz.baidubce.com', port=1883)
            except:
                print("{} device connect error".format(self.__city, self.__name))
                time.sleep(5);
            else:
                break;

        self.__mutex.release()

    def send(self, json_data):
        json_data["timestamp"] = int(time.time())
        msg = json.dumps(json_data)

        try:
            self.__mutex.acquire()
            if self.connected :
                self.__mqttc.publish("computex/" + self.__city + "/iot/" + json_data["gateway_id"] + "/DataTransfer", payload=msg, retain=True)
            self.__mutex.release()
        except :
            # self.connect()
            pass


    def run(self):
        self.connect()
        print("connect to iot hub.")
        self.__mqttc.loop_forever()

if __name__ == '__main__':

    msg = {
        'pin': 17,
        'value': 10,
        'gateway_id': "5100"
    }

    print(msg)
    dataTransfer = DataTransfer(msg["gateway_id"])
    dataTransfer.send(msg)
    dataTransfer.start()
