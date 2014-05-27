from pongdataserv import app
from bottle import static_file
from bottle import template, request, response, view
from pongdataserv.models import pong_model
import json
import uuid
import datetime

def get_input_data(request):
    if 'curl' in request.headers['User-Agent']:
        input_data = json.loads(request.POST.keys()[0])
    else:
        input_data = dict(request.POST)
    return input_data

