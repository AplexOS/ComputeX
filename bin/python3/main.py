#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Config.ConfigureWin import *
from Simulation import *
from Utils.RandomString import *

def main():

    for device in ConfigureWin.config["devices"]:
        for city in ConfigureWin.config["citys"]:
            print(city + " device: " + device)
            simulation = Simulation(city, device)
            simulation.start()

# ak=bjBb+EUd5rwfo9fBaZUMlwG8psde+abMx35m/euTUfE=
if __name__ == '__main__':
    main()
