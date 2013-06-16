from collections import OrderedDict
import datetime

from lxml.html import fromstring
import nose.tools as n

import finalip_lib as l

def test_parse_row():
    tr = fromstring('''<tr class="ui-widget-content jqgrow ui-row-ltr"><td  headers="District">New England</td><td  headers="DA Number">NAE-2009-01067</td><td  headers="Applicant">Joseph  Sullivan-Tri-Town Board of Water Com</td><td  headers="Project Name">Tri-Town Board of Water Com / Braintree & Randolph, MA</td><td  headers="Permit Type">Standard Permit</td><td  headers="Public Notice Date">05-OCT-2009</td><td  headers="Action Taken">Issued With Special Conditions</td><td  headers="Date Issued\Denied">03-FEB-2010</td><td  align="center"  headers="Map"><a href = "f?p=340:7:283770440941901::NO::P7_PROJECT_ID:4431690"><img src = "wwv_flow_file_mgr.get_file?p_security_group_id=1211711255363293&p_fname=map_icon.gif" border="0" alt="View on Map"></a></td></tr>''')
    observed = l.parse_row(tr)
    expected = OrderedDict([
        (u'District', u'New England'),
        (u'DA Number', u'NAE-2009-01067'),
        (u'Applicant', u'Joseph  Sullivan-Tri-Town Board of Water Com'),
        (u'Project Name', u'Tri-Town Board of Water Com / Braintree & Randolph, MA'),
        (u'Permit Type', u'Standard Permit'),
        (u'Public Notice Date', datetime.date(2009, 10, 5)),
        (u'Action Taken', u'Issued With Special Conditions'),
        (u'Date Issued\\Denied', datetime.date(2010, 2, 3)),
        (u'Map', u'f?p=340:7:283770440941901::NO::P7_PROJECT_ID:4431690'),
    ])
    n.assert_list_equal(observed.keys(),expected.keys())
    for k in observed.keys():
        n.assert_equal(observed[k], expected[k])

def test_parse_row_empty_map():
    tr = fromstring('''<tr class="ui-widget-content jqgrow ui-row-ltr"><td headers="District">Nashville</td><td headers="DA Number">LRN-2009-00420</td><td headers="Applicant">Nashville District Corps of Engineers, Regulatory Branch</td><td headers="Project Name">Re-Issuance of Regional Permit for Additions to Existing Commercial Marinas in the Tennessee River Basin</td><td headers="Permit Type">Standard Permit</td><td headers="Public Notice Date">09-MAR-2009</td><td headers="Action Taken">Issued With Special Conditions</td><td headers="Date Issued\Denied">22-APR-2009</td><td align="center" headers="Map"> - </td></tr>''')
    observed = l.parse_row(tr)
    n.assert_equal(observed[u'Map'], None)

def test_parse_row_bad_date():
    tr = fromstring('''<tr class="ui-widget-content jqgrow ui-row-ltr"><td headers="District">Alaska</td><td headers="DA Number">POA-2009-00263</td><td headers="Applicant">Garrett Walker</td><td headers="Project Name">Garrett Walker; Campbell Lake</td><td headers="Permit Type">Letter of Permission</td><td headers="Public Notice Date">N/A</td><td headers="Action Taken">Issued With Special Conditions</td><td headers="Date Issued\Denied">09-APR-2009</td><td align="center" headers="Map"><a href="f?p=340:7:1557729285768601::NO::P7_PROJECT_ID:4386786"><img src="wwv_flow_file_mgr.get_file?p_security_group_id=1211711255363293&amp;p_fname=map_icon.gif" border="0" alt="View on Map"></a></td></tr>''')
    observed = l.parse_row(tr)
    n.assert_equal(observed[u'Public Notice Date'], None)
