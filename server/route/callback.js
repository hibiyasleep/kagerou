'use strict'

const oauth = require('oauth')



module.exports = function(app, config) {

  const users = config.db.get('users')

  app.get(`${config.root.api}/callback`, function(req, res) {
    let token = req.query.oauth_token
    let verifier = req.query.oauth_verifier

    config.oa().getOAuthAccessToken(
      token,
      req.session.tokenSecret,
      verifier,
      (e, accessToken, accessTokenSecret, r) => {
        if(e) {
          res.status(500)
          res.render('500')
          return
        }

        let data = {
          uid: r.user_id,
          name: r.screen_name,
          token: accessToken,
          secret: accessTokenSecret
        }

        users.findOneAndUpdate(
          { uid: r.user_id },
          { $set: data },
          { upsert: true }
        ).then(updated => {
          console.log(data)
          res.render('save.html', {
            JSON: JSON,
            data: data
          })
        }).catch(_ => console.error(_) )
    })
  })

}
