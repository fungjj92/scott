#!/usr/bin/env python2
import os, json

def restore_application(logfile):
    for line in open(logfile):
        # Remove the date and the newline character
        user, space, edit = line[40:].partition(' ')
        del(space)
        data = json.loads(edit)
        print edit

def restore(logdir):
    for logfile in os.listdir(logdir):
        if logfile[-4:] != '.log':
            continue
        restore_application(os.path.join(logdir, logfile))

if __name__ == '__main__':
    import sys
    logdir = sys.argv[1]
    if not os.path.isdir(logdir):
        print 'USAGE: %s [directory with log files] [scott web api root]' % sys.argv[0]
        exit(1)
    restore(logdir)
