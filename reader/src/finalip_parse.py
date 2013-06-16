#!/usr/bin/env python2
import os

from lxml.html import parse, tostring
from dumptruck import DumpTruck

import finalip_lib as l

def read_finalip(path):
    html = parse(path)
    trs = html.xpath('//table[@style="border-collapse: collapse; width: 100%;"]/descendant::tr')
    def do_row(tr):
        try:
            return l.parse_row(tr)
        except:
            print tostring(tr)
            raise
    return map(do_row, trs[2:])

# Schema
dt = DumpTruck(dbname = '/tmp/finalip.db')
dt.create_table({u'DA Number': u'NAE-2009-01067'}, 'finalip', if_not_exists = True)
dt.create_index(['Da Number'], 'finalip', unique = True, if_not_exists = True)

# Skip finished stuff
pages = set([(row['Year'], row['Month'], row['Page']) for row in dt.execute('SELECT Year, Month, Page FROM finalip')])

# Populate
for dirname, subdirnames, filenames in os.walk(os.path.join(os.environ['READER_ROOT'], '..', 'finalips')):
    if subdirnames != []:
        continue
    for filename in filenames:
        year, month = map(int, dirname.split('/')[-2:])
        page = (year, month, filename)
        if page in pages:
            continue

        path = os.path.join(dirname, filename)
        try:
            data = read_finalip(path)
        except:
            print path
            raise
        for row in data:
            row['Year'], row['Month'], row['Page'] = page
        dt.upsert(data, 'finalip')
