import os
import uuid
import json
import random
import datetime
import pymongo
from bson.objectid import ObjectId

conn = pymongo.Connection()
db = conn['ping']['pong']
#SELECT: list(db.find({'_id':ObjectId(game_id)}))[0]
#UDPATE: db.update({'_id':ObjectId(game_id)},{'$inc':{player:1},'$push':{'history':player}})
#INSERT: db.insert({})
"""
def create_game(player1, player2):
    startTime = str(datetime.datetime.now())[:-7]
    game = {
        "player1":player1,
        "player2":player2,
        "start_time":startTime,
        player1:0,
        player2:0,
        'history':[],
        'game_over':False
    }
    game_id = str(db.insert(game))
    return list(db.find({'_id':ObjectId(game_id)}))[0]
"""

def get_all_data():
    return list(db.find())
