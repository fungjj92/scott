#!/usr/bin/env python2

from lxml.html import fromstring
import requests

def parse_row(tr):
    row = {unicode(td.xpath('@headers')[0]): unicode(td.text_content()) for td in tr.xpath('td[@headers!="Map"]')}
    row[u'Map'] = unicode(tr.xpath('descendant::td[@headers="Map"]/a/@href')[0])
    return row


def apex_submit(html):
    inpage = {unicode(i.xpath('@name')[0]): unicode(i.xpath('@value')[0]) for i in html.xpath('//input[@type="hidden"]')}

    base = {
        'p_flow_id': '340',
        'p_flow_step_id': '2',
        'p_instance': '577571118632801',
        'p_page_submission_id': '1102794844796601',
        'p_request': 'P0_MONTH',
        'p_arg_names': '194046530101199977',
        'p_t01': 'Final Individual Permits',
        'p_arg_names': '193991155316048509',
        'p_t02': '2',
        'p_arg_names': '193990950373048508',
        'p_t03': '2013',
        'p_arg_names': '193990743885048503',
        'p_t04': '3',
        'X01': 'current',
        'p_md5_checksum': '',
        'p_page_checksum': '808D9B75F25EB3C44B5240A1EE6C923A',
    }

r = requests.get('http://geo.usace.army.mil/egis/f?p=340:2:1433809126328401::NO:RP::')
html = fromstring(r.text)
trs = html.xpath('//table[@style="border-collapse: collapse; width: 100%;"]/descendant::tr')

data = map(parse_row, trs[2:])
