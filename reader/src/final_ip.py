#!/usr/bin/env python2

from lxml.html import fromstring
import requests

def parse_row(tr):
    row = {unicode(td.xpath('@headers')[0]): unicode(td.text_content()) for td in tr.xpath('td[@headers!="Map"]')}
    row[u'Map'] = unicode(tr.xpath('descendant::td[@headers="Map"]/a/@href')[0])
    return row

r = requests.get('http://geo.usace.army.mil/egis/f?p=340:2:1433809126328401::NO:RP::')
html = fromstring(r.text)
trs = html.xpath('//table[@style="border-collapse: collapse; width: 100%;"]/descendant::tr')

data = map(parse_row, trs[2:])
