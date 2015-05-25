import os
import urllib
import urllib2
import json
import logging
import time

def apikey(testing=False):
    
    if testing is True:
        key = 'JOT'
    else:
        key = 'VN'
    
    path = os.path.join(os.path.abspath(os.path.dirname(__file__)), '{0}.key'.format(key))
    api_key = open(path, "r").read().rstrip()
    
    return api_key


def createIssue(org, repo, labels, title, body):
    
    key = apikey()
    data = {'title': title, 'body': body, 'labels': labels}
    url = 'https://api.github.com/repos/{0}/{1}/issues'.format(org, repo)

    req = urllib2.Request(url)
    req.add_header('User-Agent', 'VertNet')
    req.add_header('Authorization', 'token {0}'.format(key))
    req.add_header('Content-Type', 'application/json')

    res = urllib2.urlopen(req, json.dumps(data))
    
    return res


def main(environ, start_response):
    
    status = '200'
    headers = []
    start_response(status, headers)
    success = True

    data = json.loads(environ['wsgi.input'].read())['data']
    
    title = data['title']
    body = data['body']
    providers = data['providers']
    labels = data['labels']
    failed = []

    # r = createIssue(org, repo, title, body)
    # code = r.code

    for i in providers:
        org = i['github_orgname']
        repo = i['github_reponame']

        logging.info("Sending to {0}/{1}".format(org, repo))
        
        try:
            r = createIssue(org, repo, labels, title, body)
            if r.code != 201:
                failed.append(i)
        except:
            failed.append(i)

        time.sleep(2)
    
    resp = 'failed' if len(failed)>0 else 'success'
    d = {
        'resp': resp,
        'failed': failed
    }

    return json.dumps(d)