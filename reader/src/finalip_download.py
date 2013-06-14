#!/usr/bin/env python2
import os, datetime
from time import sleep

import finalip_lib as l
import requests
from lxml.html import fromstring

DIR = os.path.join(os.environ['READER_ROOT'], '..', 'finalips')
try:
    os.mkdir(DIR)
except OSError:
    pass

MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

def save(meta_session, p_t03, p_t04, next_url = None):
    'Make the request, save the html of the response, and pass the meta-session along.'
    session = meta_session[0]
    if next_url == None:
        # First page
        response = l.apex_submit(meta_session, p_t03, p_t04)
    else:
        # Next page
        response = session.get(next_url)

    # Check whether there's anything on the page
    if 'Search Criteria Returned No Results.' in response.text.encode('utf-8'):
        return

    # Parse the HTML.
    html = fromstring(response.text.encode('utf-8'))

    # Save
    filedir = os.path.join(DIR, p_t03, p_t04)
    filename = html.xpath('//select[@name="X01"]/option[@selected]/text()')[0]

    try:
        os.makedirs(filedir)
    except OSError:
        pass
    h = open(os.path.join(filedir, filename), 'w')
    h.write(response.text.encode('utf-8'))
    h.close()

    print('Downloaded %s %s, page %s' % (MONTHS[int(p_t04) - 1], p_t03, filename))

    # Pass state
    meta_session = session, response, html
    return meta_session

def _month_done(p_t03, p_t04):
    monthdir = os.path.join(DIR, p_t03, p_t04)
    if not os.path.isdir(monthdir):
        return False

    filenames = os.listdir(monthdir)
    if len(filenames) > 0:
        total_rows = filenames[0].split(' ')[-1]
        for filename in filenames:
            if '%s of %s' % (total_rows, total_rows) in filename:
                return True
    return False

def _get_first_meta_session():
    session = requests.session()
    response = session.get('http://geo.usace.army.mil/egis/f?p=340:2:1433809126328401::NO:RP::')
    html = fromstring(response.text.encode('utf-8'))
    return (session, response, html)
meta_session = _get_first_meta_session()

for p_t03 in l.p_t03s(meta_session[2]):
    for p_t04 in l.p_t04s(meta_session[2]):
        # Skip this month if it is already done
        params = (MONTHS[int(p_t04) - 1], p_t03)
        print params
        if _month_done(p_t03, p_t04):
            print('Skipping %s %s' % params)
            continue
        else:
            print('Working on %s %s' % params)

        _meta_session = save(meta_session, p_t03, p_t04)
        if _meta_session == None:
            print('No results for %s %s' % params)
            continue
        else:
            meta_session = _meta_session

        while True:
            sleep(1)
            html = meta_session[2]
            nexts = html.xpath('//a[text()="Next >"]/@href')
            if len(nexts) == 0:
                print('End of %s %s' % params)
                break
            else:
                meta_session = save(meta_session, p_t03, p_t04, u'http://geo.usace.army.mil/egis/' + nexts[0])
