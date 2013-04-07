#!/usr/bin/env python2
'This is for new old data format.'

import datetime
import lxml.html
import re
from unidecode import unidecode
import json

# This is was helpful for creating the following map.
# sqlite3 -csv -noheader /tmp/wetlands.db "SELECT substr(permitApplicationNumber, -5, 5), projectManagerName, projectManagerEmail, projectManagerPhone FROM application WHERE permitApplicationNumber GLOB '*-*-*-[A-Z]*';"|sed s/^[0-9]*-//|sed s/^[0-9]*-//|sort|uniq
PROJECT_MANAGERS = {
    'CJ':  ('Christine Thibodeaux', 'christine.thibodeaux@usace.army.mil', '504-862-2278'),
    'CL':  ('Amy Oestringer', 'amy.l.oestringer@usace.army.mil', '504-862-1577'),
    'CM':  ('Neil Gauthier', 'neil.t.gauthier@usace.army.mil', '504-862-1301'),
    'CO':  ('Jamie Crowe', 'Jamie.M.Crowe@usace.army.mil', '504-862-2675'),
    'CQ':  ('Kenneth Blanke', 'Kenneth.G.Blanke@usace.army.mil', '504-862-1217'),
    'CS':  ('Miranda Martin', 'Miranda.A.Martin@usace.army.mil', '504-862-1113'),
    'CU':  ('Doris Terrell', 'Doris.Terrell@usace.army.mil', '504-862-1588'),
    'CWB': ('Darlene Herman', 'Darlene.C.Herman@usace.army.mil', '504-862-2287'),
    'CY':  ('John Herman', 'John.M.Herman@usace.army.mil', '504-862-1581'),
    'EBB': ('Jennifer Burkett', 'jennifer.e.burkett@usace.army.mil', '504-862-2045'),
    'EFF': ('Darrell Barbara', 'Darrell.Barbara@usace.army.mil', '504-862-2260'),
    'EII': ('Ed Wrubluski', 'Edward.F.Wrubluski@usace.army.mil', '504-862-2822'),
    'EMM': ('Scott Kennedy', 'Scott.N.Kennedy@usace.army.mil', '504-862-2259'),
    'EOO': ('Brad LaBorde', 'Brad.LaBorde@usace.army.mil', '504-862-2225'),
    'EPP': ('Stephanie Lacroix', 'Stephanie.L.Lacroix@usace.army.mil', '504-862-1564'),
    'EQ':  ('Melissa Ellis', 'melissa.a.ellis@usace.army.mil', '504-862-2543'),
    'ETT': ('Robert Tewis', 'Robert.M.Tewis2@usace.army.mil', '504-862-2041'),
    'MB':  ('Brian Breaux', 'Brian.W.Breaux@usace.army.mil', '504-862-1938'),
    'MR':  ('Jacqueline Farabee', 'Jacqueline.R.Farabee@usace.army.mil', '504-862-2595'),
    'MS':  ('Stephen Pfeffer', 'stephen.d.pfeffer@usace.army.mil', '504-862-2227'),
    'SU':  ('Rob Heffner', 'rob.heffner@us.army.mil', '504-862-2274'),
    'WB':  ('Darlene Herman', 'Darlene.C.Herman@usace.army.mil', '504-862-2287'),
    'WII': ('James Little', 'James.Little@usace.army.mil', '504-862-2272'),
#   'WII': ('Miranda Martin', 'Miranda.A.Martin@usace.army.mil', '504-862-1113'),
    'WJJ': ('Bobby Quebedeaux', 'Bobby.D.Quebedeaux@usace.army.mil', '504-862-2224'),
    'WKK': ('Sara Fortuna', 'sara.b.fortuna@usace.army.mil', '504-862-1025'),
    'WLL': ('Mike Herrmann', 'michael.h.herrmann@usace.army.mil', '504-862-1954'),
    'WMM': ('Angelle Greer', 'angelle.v.greer@usace.army.mil', '504-862-1879'),
    'WNN': ('John Price', 'john.c.price@usace.army.mil', '504-862-2272'),
    'WOO': ('Donald Rodrigue', 'donald.a.rodrigue@usace.army.mil', '504-862-1445'),
    'WPP': ('Johnny Duplantis', 'Johnny.j.duplantis@usace.army.mil', '504-862-2548'),
    'WPP': ('John Price', 'john.c.price@usace.army.mil', '504-862-2272'),
    'Z':   ('Darlene Herman', 'Darlene.C.Herman@usace.army.mil', '504-862-2287'),
}

_WEB_COLUMNS = [
    'permitApplicationNumber',
    'permitApplicationUrl',

    '_description',
    'expirationDate',

    'publicNoticeUrl',
    'drawingsUrl',
]

_parishes = '(Acadia|allen|ascension|assumption|avoyelles|beauregard|bienville|bossier|caddo|calcasieu|caldwell|cameron|catahoula|claiborne|concordia|de soto|east baton rouge|east carroll|east feliciana|evangeline|franklin|grant|iberia|iberville|jackson|jefferson|jefferson davis|lafayette|lafourche|lasalle|lincoln|livingston|madison|morehouse|natchitoches|orleans|ouachita|plaquemines|pointe coupee|rapides|red river|richland|sabine|saint bernard|saint charles|saint helena|saint james|saint john the baptist|saint landry|saint martin|saint mary|saint tammany|tangipahoa|tensas|terrebonne|union|vermilion|vernon|washington|webster|west baton rouge|west carroll|west feliciana|winn)'
_DESCRIPTION = re.compile(r'([0-9/]*): (.*) in ' + _parishes + ' Parish - ?([^-]*)', flags = re.IGNORECASE)

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
        m = re.match(_DESCRIPTION, row['_description'])
        if not m:
            m = re.match(_DESCRIPTION, re.sub(r'st.', 'saint', row['_description'], flags = re.IGNORECASE))

        if not m:
            print row['_description']
            raise ValueError('The regular expression didn\'t match')

        print row
        row['expirationDate'] = datetime.datetime.strptime(row['expirationDate'], 'Expiration date: %m/%d/%Y').strftime('%Y-%m-%d')
        row['publicNoticeDate'] = datetime.datetime.strptime(m.group(1), '%m/%d/%Y').strftime('%Y-%m-%d')
        row['projectDescription'] = m.group(2)
        row['parish'] = m.group(3).lower()
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
    data = listing_parse(f.read())
    f.close()
    for doc in data:

        # These fields are required
        doc['type'] = 'impact'
        doc['flagged'] = 0
        doc['status'] = 1
        doc['CUP'] = doc['WQC'] = doc['locationOfWork'] = doc['characterOfWork'] = doc['longitude'] = doc['latitude'] = doc['acreage'] = doc['notes'] = doc['reminderDate'] = ''

        # Project manager fields
        projectManagerCode = doc['permitApplicationNumber'].split('-')[-1]
        if projectManagerCode in PROJECT_MANAGERS:
            (doc['projectManagerEmail'], doc['projectManagerName'], doc['projectManagerPhone']) = PROJECT_MANAGERS[projectManagerCode]
        else:
            doc['projectManagerEmail'] = doc['projectManagerName'] = doc['projectManagerPhone'] = ''

        # Turn nones into empty strings.
        for k, v in doc.items():
            if v == None:
                doc[k] = ''

        if web:
            history = 'http://localhost:' + os.environ['PORT'] + '/applications/' + doc['permitApplicationNumber'] + '/history'
            history_file = requests.get(history).text
            if len(filter(lambda line: ' bot {' in line, history_file.split('\n'))) > 2:
                print doc['permitApplicationNumber'] + "'s data have already been uploaded."
                continue

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
