'use strict'

module.exports = function(app, config) {

  app.get(`${config.root.api}/login`, function(req, res) {

    config.oa().getOAuthRequestToken(function(e, token, tokenSecret) {
      if(e) {
        console.error(e)
        res.status(500)
        res.render('500')
      } else {
        req.session.tokenSecret = tokenSecret
        res.redirect('https://twitter.com/oauth/authorize?oauth_token=' + token)
      }
    })
  })

}
