#!/usr/bin/env python2
import os

from lxml.html import parse
from dumptruck import DumpTruck

import finalip_lib as l

def read_finalip(path):
    html = parse(path)
    trs = html.xpath('//table[@style="border-collapse: collapse; width: 100%;"]/descendant::tr')
    return map(l.parse_row, trs[2:])

# Schema
dt = DumpTruck(dbname = '/tmp/finalip.db')
dt.create_table({u'DA Number': u'NAE-2009-01067'}, 'finalip', if_not_exists = True)
dt.create_index(['Da Number'], 'finalip', unique = True, if_not_exists = True)

# Populate
for dirname, subdirnames, filenames in os.walk(os.path.join(os.environ['READER_ROOT'], '..', 'finalips')):
    if subdirnames != []:
        continue
    for filename in filenames:
        year, month = map(int, dirname.split('/')[-2:])
        data = read_finalip(os.path.join(dirname, filename))
        for row in data:
            row['Year'] = year
            row['Month'] = month
            row['Page'] = filename
        dt.upsert(data, 'finalip')
