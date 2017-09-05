'use strict'

;(function() {

  const UNKNOWN_ZONE_REGEX = /^Unknown Zone \(([0-9A-Fa-f]{2,4})\)$/
  const SKILL_REGEX = /^(.+?)( \(\*\))?$/
  const LOCALE_PATH = '../share/lang/'

  class Locale {

    constructor(lang, callback) {
      this.L = {}
      this.current = lang || CONFIG_DEFAULT.locale || 'en'
      this.load(this.current, callback || (_ => this.localizeAll()) )
    }

    setLang(lang, callback) {
      this.current = lang
      this.load(lang, callback || (_ => this.localizeAll()) )
    }

    load(lang, callback, forceReload) {
      if(!lang) lang = this.current || 'en'

      if(lang in this.L && forceReload) {
        if(callback) callback(this.L[lang])
        return this.L[lang]
      }

      let xhr = new XMLHttpRequest()
      xhr.open('GET', LOCALE_PATH + lang + '.json')

      xhr.onreadystatechange = _ => {
        if(xhr.readyState === 4) {
          if(xhr.status === 200) {
            let json
            try {
              json = JSON.parse(xhr.responseText)
            } catch(e) {
              return
            }
            this.L[lang] = json
            if(callback) callback(json)
          }
        }
      }
      xhr.send(null)
    }

    get loaded() {
      return this.current in this.L
    }

    get(path) {
      return resolveDotIndex(this.L[this.current], path)
    }

    skillname(n, useAlias) {
      if(!n) return [n, -1]

      let o = n.split('-')
      let dot = this._skill(o[0])
      let name = this.get('skill.' + dot[0]) || dot[0]
      let value = o[1] || -1

      if(useAlias && this.get('skill.alias.' + name)) {
        name = this.get('skill.alias.' + name)
      }

      if(value) {
        return [name + (dot[1]? '*' : ''), value]
      } else {
        return [name, -1]
      }
    }

    _skill(n) {
      let o = SKILL_REGEX.exec(n)
      if(!o)
        return []
      else if(o[2] === undefined)
        return [n, false]
      else if(o[2] === ' (*)')
        return [o[1], true]
      else
        return []
    }

    zone(n) {
      let o = UNKNOWN_ZONE_REGEX.exec(n)

      if(o && typeof o[1] === 'string') { // Unknown zone matches
        let v = this.get(`zone.unknown.${o[1].toLowerCase()}`)
        if(v) return v
      }

      return n
    }

    localizeAll(under, _stack) { // retry stack
      if(!(this.current in this.L)
      || JSON.stringify(this.L[this.current]) === '{}' ) {
        if(_stack < 5) {
          setTimeout(_ => {
            _stack = _stack || 0
            this.localizeAll(under, _stack + 1)
          }, 200)
        } else {
          console.error('Current locale not loaded; try refresh this page.')
        }
        return
      }

      $('html', 0).className = this.current
      $map(under, '[data-locale]', _ => {
        let c = _.getAttribute('data-locale')
        if(!c) return

        c.split('|').forEach(token => {
          let t = token.split('=')
          let key = t[1]
          let value = t[0]

          let joins = value.split('+')
          value = joins.reduce((p, c) => {
            try {
              return p + (this.get(c) || c)
            } catch(e) {
              console.error('Cannot load localized text for: ' + c)
              return c
            }
          }, '')

          if(key)
            _.setAttribute(key, value)
          else
            _.innerHTML = value
        })
      })
    }

    get locale() {
      return Object.keys(this.L)
    }

    set locale(v) {
      if(this.available(v)) {
        this.current = v
      } else {
        return false
      }
    }

  }

  window.Locale = Locale

})()
