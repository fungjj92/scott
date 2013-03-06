#!/usr/bin/env python2
import json


def is_edit(record):
    'Takes the parsed json log line, returns boolean'
    return record['req']['method'] == 'PUT' and record.get('err') == None

if __name__ == '__main__':
    import sys
    filename = sys.argv[1]
    f = open(filename)
    for line in f:
        record = json.loads(line)
        if is_edit(record):
            print record['req']['url']
            print record
