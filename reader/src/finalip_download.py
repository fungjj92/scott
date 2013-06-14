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

def save_first_page(meta_session, p_t03, p_t04):
    'Make the request, save the html of the response, and pass the meta-session along.'
    html = meta_session[2]
    response = l.apex_submit(meta_session, l.p_t03s(html)[0], l.p_t04s(html)[0])

    # Save
    filedir = os.path.join(DIR, p_t03, p_t04)
    filename = datetime.datetime.now().isoformat()
    try:
        os.makedirs(filedir)
    except OSError:
        pass
    h = open(os.path.join(filedir, filename), 'w')
    h.write(response.text)
    h.close()

    # Pass state
    meta_session = session, response, fromstring(response.text)
    return meta_session

session = requests.session()
response = session.get('http://geo.usace.army.mil/egis/f?p=340:2:1433809126328401::NO:RP::')
html = fromstring(response.text)
meta_session = (session, response, html)
for p_t03 in l.p_t03s(html):
    for p_t04 in l.p_t04s(html):
        print('Downloading %s %s, current page' % (p_t03, p_t04))
        meta_session = save_first_page(meta_session, p_t03, p_t04)
        sleep(1)
