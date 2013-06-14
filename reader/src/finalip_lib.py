#!/usr/bin/env python2

from lxml.html import fromstring
import requests

def parse_row(tr):
    row = {unicode(td.xpath('@headers')[0]): unicode(td.text_content()) for td in tr.xpath('td[@headers!="Map"]')}
    row[u'Map'] = unicode(tr.xpath('descendant::td[@headers="Map"]/a/@href')[0])
    return row

def apex_submit(html, p_t02, p_t03, p_t04, X01):
    data = {
        'p_t02': '2',   # all districts
        'p_t03': p_t03, # year
        'p_t04': p_t04, # month
        'X01': X01,     # page
    }
    data.update({unicode(i.xpath('@name')[0]): unicode(i.xpath('@value')[0]) for i in html.xpath('//input[@type="hidden"]')})
    return requests.post(data)

def p_t03s(html):
    'List years'
    return map(unicode, html.xpath('//select[@name="p_t03"]/option/@value'))

def p_t03s(html):
    'List months'
    return map(unicode, html.xpath('//select[@name="p_t04"]/option/@value'))

def X01s(html):
    'Return a list of page parameters'
    return map(unicode, html.xpath('//select[@name="X01"]/option/@value'))
