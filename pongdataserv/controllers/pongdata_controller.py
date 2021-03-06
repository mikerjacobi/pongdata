from pongdataserv import app
from bottle import static_file
from bottle import template, request, response, view
from pongdataserv.models import pong_model
import json
import uuid
import datetime

@app.hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = 'http://pongapp.s3-website-us-west-2.amazonaws.com'
    response.headers["Access-Control-Allow-Headers"] =  "Origin, X-Requested-With, Content-Type, Accept"
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';


def get_input_data(request):
    if 'curl' in request.headers['User-Agent']:
        input_data = json.loads(request.POST.keys()[0])
    else:
        input_data = dict(request.POST)
    return input_data

@app.route("/alldata", method="GET")
def getalldata():
    data = pong_model.get_all_data()
    for i in range(len(data)):
        data[i]['_id'] = str(data[i]['_id'])
    return json.dumps(data)

@app.route('/')
def static_html():
    static_dir = 'pongdata/pongdataserv/html'
    filename="index.html"
    return static_file(filename, root=static_dir)

@app.route('/html/<filename>')
def static_html(filename):
    static_dir = "pongdata/pongdataserv/%s"%"html"
    return static_file(filename, root=static_dir)

@app.route('/js/<filename>')
def static_js(filename):
    static_dir = "pongdata/pongdataserv/%s"%"js"
    return static_file(filename, root=static_dir)
	
@app.route('/css/<filename>')
def static_css(filename):
    static_dir = "pongdata/pongdataserv/%s"%"css"
    return static_file(filename, root=static_dir)

