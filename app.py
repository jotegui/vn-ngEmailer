import os
import json
import urllib
import urllib2

import jinja2
import webapp2
import logging

from google.appengine.api import users


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


def buildGithubUsers():

	user_list = []
	members_url = 'https://api.github.com/orgs/VertNet/members'
	members = [x['login'] for x in json.loads(urllib2.urlopen(members_url).read())]
	
	user_url = 'https://api.github.com/users/{0}'
	
	for i in members:
		user_list.append(json.loads(urllib2.urlopen(user_url.format(i)).read())['email'])
	
	return user_list


class MainPage(webapp2.RequestHandler):

    def get(self):
    	user = users.get_current_user()
    	
    	#user_list = buildGithubUsers()
    	user_list = [
    		'javier.otegui@gmail.com',
    		'dbloom@vertnet.org',
    		'robgur@gmail.com',
    		'larussell@vertnet.org',
    		'tuco@berkeley.edu',
    		'gtuco.btuco@gmail.com',
    		'robert.guralnick@colorado.edu'
		]
    	logging.warning(user.email())
    	logging.info(user_list)
    	logging.info(user.email().lower() in user_list)

    	if user.email().lower() in user_list:
        	template = JINJA_ENVIRONMENT.get_template('index.html')
        	self.response.write(template.render({}))
    	else:
    		self.redirect(users.create_login_url(self.request.uri))

main = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)