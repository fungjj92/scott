#!/usr/bin/env python2

trs = html.xpath('//table[@style="border-collapse: collapse; width: 100%;"]/descendant::tr')

data = map(parse_row, trs[2:])
