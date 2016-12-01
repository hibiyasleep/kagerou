'use strict'

const API_ENDPOINT = 'http://mari.local:8080/api'
const _uri = _ => API_ENDPOINT + _

class Integration {

  constructor() {
    this.token = false
    this.read()
  }

  login() {
    window.open(
      '../api/login',
      'Login',
      'width=320, height=480'
    )
  }

  logout() {
    fetch(
      _uri('/logout') + `?token=${this.token.token}&secret=${this.token.secret}`
    ).then(res => {

    })
    localStorage.setItem('kagerou_token', '{}')
  }

  read() {
    let token = localStorage.getItem('kagerou_token')
    let save = localStorage.getItem('kagerou_save')

    try {
      this.token = JSON.parse(token || '!')
    } catch(e) {
      this.token = {}
      localStorage.setItem('kagerou_token', '{}')
    }
    try {
      this.connected = JSON.parse(save || '!')
    } catch(e) {
      this.connected = {
        to: 'nowhere',
        id: ''
      }
      localStorage.setItem('kagerou_save', '{"to":"nowhere","id":""}')
    }

    return { token: this.token, connected: this.connected }
  }

  saveToken(o) {
    localStorage.setItem('kagerou_token', JSON.stringify({
      uid: o.uid,
      name: o.name,
      token: o.token,
      secret: o.secret
    }))
  }

  load(id, callback) {
    let uri = _uri('/load')
    if(id) {
      uri += '?id=' + id
    } else if(this.token) {
      uri += `?token=${this.token.token}&secret=${this.token.secret}`
    }
    fetch(uri).then(res => {
      if(!res.ok) return ''
      return res.json()
    }).then(json => {
      if(id) {
        this.save = {
          to: 'id',
          id: json.id
        }
      } else {
        this.save = {
          to: 'twitter',
          id: this.token.name
        }
      }

      try {
        let d = JSON.parse(json.config)
        callback(null, d)
      } catch(e) {
        callback('서버에서 잘못된 설정을 보냈습니다.')
      }
    }).error(e => {
      callback('통신하는 중 무언가 잘못되었습니다.')
    })
  }

  register(toTwitter) {

  }

  disconnect() {

  }
}

//window.integration = new Integration()

window.addEventListener('load', function() {

})
