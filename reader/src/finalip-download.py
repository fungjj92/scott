#!/usr/bin/env python2

r = requests.get('http://geo.usace.army.mil/egis/f?p=340:2:1433809126328401::NO:RP::')
html = fromstring(r.text)
