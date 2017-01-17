'use strict'

;(function(){

  const cell = function cell(col, value) {
    return `<span class="flex-column flex-column-${sanitize(col)}">${value}</span>\n`
  }

  const sanitize = _ => _.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()

  const NON_COMBATANT_JOBS = [
    'alc', 'arm', 'bsm', 'btn', 'crp', 'cul',
    'fsh', 'gsm', 'ltw', 'min', 'wvr', 'error'
  ]

  class Renderer {

    constructor(config) {
      this.current = 0

      this.latestData = null
      this.currentHistory = false
      this.updateConfig(config)

      this.elem = {}
      this.acc = {
        rdps: config.format.significant_digit.dps,
        rhps: config.format.significant_digit.hps,
        recover: 0
      }
    }

    updateConfig(config) {
      this.config = config
      this.tabs = []
      for(let k in this.config.tabs) {
        try {
          this.tabs[k] = new Row(this.config.tabs[k])
        } catch(e) {
          // TODO: global error handler
          console.error(`Error while compiling tab: ${e}`)
        }
      }
    }

    get template() { return this.tabs[this.current] }

    switchTab(id) {
      if(!this.tabs[id]) {
        throw new ReferenceError(`Failed to switch to tab '${id}': No such tab`)
        return
      }
      this.current = id
      this.updateHeader()
      if(window.hist.current)
        this.update()
    }

    browseHistory(id) {
      if(id === 'current')
        this.currentHistory = false
      else
        this.currentHistory = id
    }

    updateHeader() {
      $('#header').outerHTML = this.template.header
    }

    updateFooter(d) {
      let r = Object.keys(this.config.footer).filter(_ => this.config.footer[_])
      for(let k of r) {
        this.elem[k] = this.elem[k] || $('#' + k)
        if(k == 'rank') {
          this.elem[k].textContent = d[k]
        } else {
          animateNumber(this.elem[k], parseFloat(d[k]) || 0, {
            timeout: 266,
            digit: this.acc[k]
          })
        }
      }
    }

    update() {
      if(!window.hist.currentData) return

      if(!this.currentHistory) {
        this.render(window.hist.current)
      } else {
        this.render(window.hist.browse(this.currentHistory).data)
      }
    }

    _testRow(data) {
      let d = resolveClass(data.Job, data.name)
      let job = d[0]
      let name = d[1]

      if(this.config.filter.unusual_spaces
        && !d[2] // not a pet
        && name != 'Limit Break' // also not a limit break
        && name.split(' ').length > 1) {
        return false
      }
      if(this.config.filter.non_combatant
        && NON_COMBATANT_JOBS.indexOf(job) != -1) {
        return false
      }
      if(this.config.filter.jobless
        && job.length == 0) {
        return false
      }
      return true
    }

    render(data) {
      // damn chromium 45

      // history header
      $('.history', 0).classList.toggle('enabled', !data.isCurrent)
      $('#history-time').textContent = data.header.duration
      $('#history-mob').textContent = data.header.title
      $('#history-region').textContent = window.l.zone(data.header.CurrentZoneName)

      // columns
      let got = data.get(
        this.template.tab.sort,
        window.config.get('format.merge_pet')
      )
      let d = got[0].filter(_ => this._testRow(_))
      let max = got[1]

      let rank = 0

      let table = $('#table')
      table.innerHTML = ''

      for(let i in d) {
        let o = d[i]
        if(isYou(o.name, this.config.format.myname)) {
          rank = parseInt(i) + 1
        }
        table.insertAdjacentHTML(
          'beforeend',
          this.template.render(o, max)
        )
      }

      // footer (rdps, rhps)

      this.updateFooter({
        rank: rank + '/' + d.length,
        rdps: data.header.encdps,
        rhps: data.header.enchps,
        recover: (
          parseInt(data.header.healstaken)
          / (parseInt(data.header.damagetaken) || 1)
          * 100
        ).toFixed(0)
      })
    }

  }

  class Row {

    constructor(tab) {
      this.tab = tab
      this.header = this.render(null)
      this.owners = window.config && window.config.get('format.myname')
    }

    _value(v, data) {
      if(typeof v === 'string')
        return data[v]
      else if(typeof v === 'function')
        return v(data)
    }

    part(c, data) {
      const col = resolveDotIndex(COLUMN_INDEX, c)

      if(typeof col === 'string') {
        return data[col]
      } else {
        let val = this._value(col.v, data)

        if(typeof col.f === 'function')
          return col.f(val, window.config.get())
        else
          return val
      }
    }

    getTitle(col) {
      let content = '...'
      if(window.l.loaded)
        content = window.l.get(`col.${col}.0`)
      return `<span data-locale="col.${col}.0">${content}</span>`
    }

    render(data, max) {
      let r = data == null? '<li id="header">' : ''
      let part = data == null? 'getTitle' : 'part'
      let gaugeBy = resolveDotIndex(COLUMN_INDEX, this.tab.gauge)

      if(gaugeBy.v) {
        gaugeBy = gaugeBy.v
      }

      if(data !== null) {
        let cls = sanitize(this[part]('i.class', data)) || 'unknown'
        r = `<li class="class-${cls} ${isYou(data.name, this.owners)? 'me' : ''}">`

        let width = this._value(gaugeBy, data) / max[this.tab.gauge] * 100
        r += `<span class="gauge" style="width:${width}%"></span>`
      }

      for(let section of this.tab.col) {
        r += cell(section, this[part](section, data))
      }

      r += '</li>'

      return r
    }

  }

  window.Renderer = Renderer
  window.Row = Row

})()
