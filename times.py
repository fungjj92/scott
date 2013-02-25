#!/usr/bin/env python2
import json

print 'time'
for line in open('scott.log'):
    print json.loads(line)['time'].split('T')[-1].split(':')[0]
