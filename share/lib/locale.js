'use strict'

;(function() {

  const UNKNOWN_ZONE_REGEX = /^Unknown Zone \(([0-9A-Fa-f]{3})\)$/
  const SKILL_REGEX = /^(.+?)( \(\*\))?$/
  const LOCALE_PATH = '../share/lang/'

  class Locale {

    constructor(callback) {
      this.L = {}
      this.current = window.config.get('lang') || CONFIG_DEFAULT.locale || 'en'
      this.load(this.current, callback || (_ => this.localizeAll()) )
    }

    setLang(lang, callback) {
      this.current = lang
      this.load(lang, callback || (_ => this.localizeAll()) )
    }

    load(lang, callback, forceReload) {
      if(!lang) lang = this.current || 'en'

      if(lang in this.L || forceReload) {
        if(callback) callback(this.L[lang])
        return this.L[lang]
      }
      fetch(LOCALE_PATH + lang + '.json').then(res => {
        if(!res.ok) return false
        return res.json()
      }).then(json => {
        this.L[lang] = json
        if(callback) callback(json)
      })
    }

    get loaded() {
      return this.current in this.L
    }

    get(path) {
      return resolveDotIndex(this.L[this.current], path)
    }

    skillname(n) {
      if(!n) return ''
      let o = n.split('-')
      let dot = this._skill(o[0])
      let name = this.get('skill.' + dot[0]) || dot[0]
      let value = o[1] || -1

      if(value) {
        return name + (dot[1]? '*' : '') + ': ' + value
      } else {
        return name
      }
    }

    _skill(n) {
      let o = SKILL_REGEX.exec(n)
      if(!o)
        return []
      else if(o[2] === undefined)
        return [n, false]
      else if(o[2] === ' (*)')
        return [n, true]
      else
        return []
    }

    zone(n) {
      let o = UNKNOWN_ZONE_REGEX.exec(n)

      if(o && o[1]) {
        let v = this.L[this.current].zone.unknown[o[1]]
        if(v) return v
      }

      return n
    }

    localizeAll(under) {
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
