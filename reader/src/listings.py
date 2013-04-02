#!/usr/bin/env python2
'This is for new old data format.'

import datetime
import lxml.html
import re
from unidecode import unidecode
import json


_WEB_COLUMNS = [
    'permitApplicationNumber',
    'permitApplicationUrl',

    '_description',
    'expirationDate',

    'publicNoticeUrl',
    'drawingsUrl',
]

_parishes = '(Acadia|allen|ascension|assumption|avoyelles|beauregard|bienville|bossier|caddo|calcasieu|caldwell|cameron|catahoula|claiborne|concordia|de soto|east baton rouge|east carroll|east feliciana|evangeline|franklin|grant|iberia|iberville|jackson|jefferson|jefferson davis|lafayette|lafourche|lasalle|lincoln|livingston|madison|morehouse|natchitoches|orleans|ouachita|plaquemines|pointe coupee|rapides|red river|richland|sabine|saint bernard|saint charles|saint helena|saint james|saint john the baptist|saint landry|saint martin|saint mary|saint tammany|tangipahoa|tensas|terrebonne|union|vermilion|vernon|washington|webster|west baton rouge|west carroll|west feliciana|winn)'
_DESCRIPTION = re.compile(r'([0-9/]): (.*) in ' + _parishes + ' Parish - ([^-]*)', flags = re.IGNORECASE)

def listing_parse(rawtext):
    html = lxml.html.fromstring(rawtext)
    da_list = html.xpath('//div[@class="da_list"]')[0]

    table = []
    for rowList in zip(
        da_list.xpath('a[@href]/b/text()'),
        da_list.xpath('a[b]/@href'),

        da_list.xpath('span[@class="da_black"]/text()'),
        da_list.xpath('span[@class="da_black"]/em/text()'),

        da_list.xpath('descendant::div[@class="da_relatedlist_item"]/descendant::a[text()="Public Notice"]/@href'),
        da_list.xpath('descendant::div[@class="da_relatedlist_item"]/descendant::a[text()="Drawings"]/@href'),

    ):
        row = dict(zip(_WEB_COLUMNS, rowList))
        m = re.match(_DESCRIPTION, row['_description']

        row['publicNoticeDate'] = datetime.datetime.strptime(m.group(1), '%m/%d/%Y')
        row['projectDescription'] = m.group(2)
        row['location'] = m.group(3)
        row['applicant'] = m.group(4)

        del(row['_description'])
        table.append(row)
    return table

def main():
    import os
    import sys
    import requests
    usage = 'USAGE: %s [filename] [web|terminal]' % sys.argv[0]
    if len(sys.argv) != 3:
        print usage
        exit(1)

    web = sys.argv[2] == 'web'
    terminal = sys.argv[2] == 'terminal'
    if not (web or terminal):
        print usage
        exit(1)

    listings_file = sys.argv[1]
    if not os.path.isfile(listings_file):
        print(usage)
        exit(1)

    f = open(listings_file)
    data = listing_parse(f.read().decode('latin1'))
    f.close()
    for doc in data:

        # These fields are required
        doc['type'] = 'impact'
        doc['flagged'] = 0
        for k, v in doc.items():
            if v == None:
                doc[k] = ''

        if web:
            url = 'http://localhost:' + os.environ['PORT'] + '/applications/' + doc['permitApplicationNumber']
            response = requests.post(url, doc, auth = ('bot', os.environ['SCRAPER_PASSWORD']))
            print url, response.status_code
            # Print the error only if I care.
            if response.status_code != 204:
                if not 'already a permit application with number' in json.loads(response.text).get('message', ''):
                    print doc
                    print response.text

        elif terminal:
            if doc['permitApplicationNumber'] and doc['publicNoticeUrl'] and doc['drawingsUrl']:
                print doc['permitApplicationNumber'] + '\t' + doc['publicNoticeUrl'] + '\t' + doc['drawingsUrl']

if __name__== "__main__":
    main()
