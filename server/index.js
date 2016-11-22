#!/usr/bin/env node
'use strict'

const serveStatic = require('serve-static')
const nunjucks = require('nunjucks')
const express = require('express')
const session = require('express-session')
const config = require('../config.json')
const oauth = require('oauth')
const twit = require('twit')

const fs = require('fs')

const db = require('monk')('localhost/kagerou')

const app = express()

app.use(session({
  secret: config.secret || 'kagerou-test-not-really-secret-나는-착하다'
}))

nunjucks.configure('template', {
  autoescape: true,
  express: app
})

config.oa = _ => new oauth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  config.twitter.token,
  config.twitter.secret,
  '1.0A',
  config.root.domain + config.root.api + '/callback',
  'HMAC-SHA1'
)
config.db = db

fs.readdir('route/', (e, f) => {
  if(e) return

  f.map(_ => require('./route/' + _)(app, config))
})

const routes = ['login']

for(let l of routes) {

}

app.use('/overlay', serveStatic('../overlay', { index: 'index.html' }))
app.use('/config', serveStatic('../config', { index: 'index.html' }))

app.listen(8080)
