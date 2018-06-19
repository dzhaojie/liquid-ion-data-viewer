#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed May  9 15:12:55 2018

@author: lilydeng
"""

import os
from pytz import timezone
from flask import Flask, render_template, jsonify, request, Response, make_response
 
import urllib.parse
import psycopg2
import json
import datetime
from psycopg2.extras import RealDictCursor

def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()
    
    
app=Flask(__name__,static_url_path='', 
            static_folder='./public/static',
            template_folder='./public/templates')
app.config["DEBUG"] = True

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/show30min')
def show30min():
    return render_template('show30min.html')

@app.route('/data30min/')
def data30min():
    url=urllib.parse.urlparse('postgres://rjuaavmfljklqt:NS45BXr7x3A2JMt2tQx8jm0UTP@ec2-54-197-245-93.compute-1.amazonaws.com:5432/da4d97tfnadshb')
    db = "dbname=%s user=%s password=%s host=%s " % (url.path[1:], url.username, url.password, url.hostname)
    schema = "schema.sql"
    conn = psycopg2.connect(db)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(""" select nitrate_c,  calcium_c, potassium_c, timereceived from sensordata_1 order by  timereceived desc limit 30""")
    data=cur.fetchall()
    conn.close()
    for item in data:
        a=item['timereceived'].astimezone(timezone('US/Eastern'))
        item['timereceived']=datetime.datetime(a.year, a.month, a.day,a.hour,a.minute,a.second)
    data=json.dumps(data,default=myconverter)
    return    data

@app.route('/show1day')
def show1day():
    return render_template('show1day.html')
    
@app.route('/data1day/')
def data1day():
    url=urllib.parse.urlparse('postgres://rjuaavmfljklqt:NS45BXr7x3A2JMt2tQx8jm0UTP@ec2-54-197-245-93.compute-1.amazonaws.com:5432/da4d97tfnadshb')
    db = "dbname=%s user=%s password=%s host=%s " % (url.path[1:], url.username, url.password, url.hostname)
    schema = "schema.sql"
    conn = psycopg2.connect(db)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(""" select nitrate_c,  calcium_c, potassium_c, timereceived from sensordata_1 where sensordata_1.timereceived >=CURRENT_TIMESTAMP-interval '24 hours' AND sensordata_1.timereceived<=CURRENT_TIMESTAMP order by timereceived desc""")
    data=cur.fetchall()
    conn.close()
    for item in data:
        a=item['timereceived'].astimezone(timezone('US/Eastern'))
        item['timereceived']=datetime.datetime(a.year, a.month, a.day,a.hour,a.minute,a.second)
    data=json.dumps(data,default=myconverter)
    return    data
    
    
if __name__=="__main__":
    app.run(debug=True)


