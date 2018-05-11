#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Config.ConfigureWin import *
from Simulation import *
from Utils.RandomString import *

def main():

    city = "Shenzhen"
    device = "5100"

    simulation = Simulation(city, device)
    simulation.start()

# ak=bjBb+EUd5rwfo9fBaZUMlwG8psde+abMx35m/euTUfE=
if __name__ == '__main__':
    main()
