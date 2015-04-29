import urllib
import urllib2
import logging
import json

def main(environ, start_response):
    
    status = '200'
    headers = []
    start_response(status, headers)
    success = True

    url = "https://vertnet.cartodb.com/api/v2/sql"
    q = "select github_orgname || '/' || github_reponame as name, github_orgname, github_reponame from resource_staging where ipt is true and github_orgname <> 'no_github_orgname' and github_orgname <> '' order by github_orgname, github_reponame"
    data = {
        'q': q
    }

    req = urllib2.Request(url)
    req.add_header('Content-Type', 'application/json')
    
    res = urllib2.urlopen(req, json.dumps(data))
    logging.info(res.code)

    d = res.read()
    return d