#!/usr/bin/env python2

def restore_application(logfile):
    for line in open(logfile):
        # Remove the date and the newline character
        user, space, edit = line[40:-1].partition(' ')
        rm(space)
        data = json.loads(edit)
        print data

def restore(logdir):
    for logfile in os.listdir(logdir):
        if logfile[-4:] != '.log':
            continue
        restore_application(os.path.join(logdir, logfile))

if __name__ == '__main__':
    logdir = sys.argv[1]
    if not os.path.isdir(logdir):
        print 'USAGE: %s [directory with log files]' % sys.argv[0]
        exit(1)
    restore(logdir)
