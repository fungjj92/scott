#!/usr/bin/env python2

def parse_row(tr):
    row = {unicode(td.xpath('@headers')[0]): unicode(td.text_content()) for td in tr.xpath('td[@headers!="Map"]')}
    row[u'Map'] = unicode(tr.xpath('descendant::td[@headers="Map"]/a/@href')[0])
    return row

def apex_submit(meta_session, p_t03, p_t04):
    session, response, html = meta_session
    url = 'http://geo.usace.army.mil/egis/wwv_flow.accept'
    data = {
        'p_t02': '2',   # all districts
        'p_t03': p_t03, # year
        'p_t04': p_t04, # month
        'X01': 'current', # page
    }
    data.update({unicode(i.xpath('@name')[0]): unicode(i.xpath('@value')[0]) for i in html.xpath('//input[@type="hidden"]')})

    p_arg_names = map(unicode, html.xpath('//input[@name="p_arg_names"]/@value'))

    # Maybe order matters
    keys = ['p_flow_id',
            'p_flow_step_id',
            'p_instance',
            'p_page_submission_id',
            'p_request',
            'p_arg_names',
            'p_t01',
            'p_arg_names',
            'p_t02',
            'p_arg_names',
            'p_t03',
            'p_arg_names',
            'p_t04',
            'X01',
            'p_md5_checksum',
            'p_page_checksum',
    ]
    serialized_data = ''
    for key in keys:
        if key == 'p_arg_names':
            value = p_arg_names.pop(0)
        else:
            value = data[key]
        serialized_data += key + '=' + value + '&'
    serialized_data = serialized_data[:-1] # remove an ampersand

    headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    #   'Accept-Encoding': 'gzip,deflate,sdch',
        'Accept-Language': 'en-US,en;q=0.8,fr;q=0.6,sv;q=0.4,zh;q=0.2,zh-CN;q=0.2,zh-TW;q=0.2',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'geo.usace.army.mil',
        'Origin': 'http://geo.usace.army.mil',
        'Referer': response.url,
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
    }

    return session.post(url, serialized_data, headers = headers)

def p_t03s(html):
    'List years'
    return map(unicode, html.xpath('//select[@name="p_t03"]/option/@value'))

def p_t04s(html):
    'List months'
    return map(unicode, html.xpath('//select[@name="p_t04"]/option/@value'))

def X01s(html):
    'Return a list of page parameters'
    return map(unicode, html.xpath('//select[@name="X01"]/option/@value'))
