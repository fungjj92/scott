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
    if next_url == None:
        # First page
        response = l.apex_submit(meta_session, p_t03, p_t04)
    else:
        # Next page
        response = session.get(next_url)

    # Check whether there's anything on the page
    if 'Search Criteria Returned No Results.' in response.text:
        return

    # Parse the HTML.
    html = fromstring(response.text)

    # Save
    filedir = os.path.join(DIR, p_t03, p_t04)
    filename = html.xpath('//select[@name="X01"]/option[@selected]/text()')[0]

    # Stop if it has already been downloaded
    if os.path.exists(os.path.join(filedir, filename)):
        return

    try:
        os.makedirs(filedir)
    except OSError:
        pass
    h = open(os.path.join(filedir, filename), 'w')
    h.write(response.text)
    h.close()

    print('Downloading %s %s, page %s' % (MONTHS[int(p_t04) - 1], p_t03, filename))

    # Pass state
    meta_session = session, response, html
    return meta_session

session = requests.session()
response = session.get('http://geo.usace.army.mil/egis/f?p=340:2:1433809126328401::NO:RP::')
html = fromstring(response.text)
meta_session = (session, response, html)
for p_t03 in l.p_t03s(html):
    for p_t04 in l.p_t04s(html):
        _meta_session = save(meta_session, p_t03, p_t04)
        if _meta_session == None:
            break
        else:
            meta_session = meta_session

        while True:
            sleep(1)
            html = meta_session[2]
            nexts = html.xpath('//a[text()="Next >"]/@href')
            if len(nexts) == 0:
                break
            else:
                meta_session = save(meta_session, p_t03, p_t04, u'http://geo.usace.army.mil/egis/' + nexts[0])
