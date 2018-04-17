#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Config.ConfigureWin import *
from Simulation import *
from Utils.RandomString import *

def main():

    for device in ConfigureWin.config["devices"]:
        print("device: " + device)
        simulation = Simulation(device)
        simulation.start()

# ak=bjBb+EUd5rwfo9fBaZUMlwG8psde+abMx35m/euTUfE=
if __name__ == '__main__':
    main()
