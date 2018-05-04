import threading
import time
import random
from mqtt.DataTransfer import *

class Simulation (threading.Thread):

    def __init__(self, name):
        threading.Thread.__init__(self)
        self.name = name
        self.dataTransfer = DataTransfer(name)
        self.dataTransfer.start()

    def run(self):
        while True:
            data = {}
            data["gateway_id"] = self.name
            data["device_id"] = 1
            data["funcode"] = random.randint(1, 4)

            if (data["funcode"] == 1):
                data["value"] = random.randint(1, 2 ** 6)
            elif (data["funcode"] == 2):
                data["value"] = random.randint(1, 4)
            elif (data["funcode"] == 3):
                data["value"] = random.randint(0, 9)
            elif (data["funcode"] == 4):
                data["value"] = random.randint(0, 100)

            self.dataTransfer.send(data)
            print("device {} send data: ".format(self.name))
            print(data)

            time.sleep(5)

if __name__ == '__main__':
    pass
