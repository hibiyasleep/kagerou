'use strict'

;(function(){

  const NON_COMBATANT_JOBS = [
    'alc', 'arm', 'bsm', 'btn', 'crp', 'cul',
    'fsh', 'gsm', 'ltw', 'min', 'wvr', 'error'
  ]

  const TAB_SORTBY_MIGRATE_MAPPING = {
    '+encdps': 'deal.per_second',
    '-encdps': 'deal.per_second',
    '+damage': 'deal.total',
    '-damage': 'deal.total',
    '+damagetaken': 'tank.damage',
    '-damagetaken': 'tank.damage',
    '+enchps': 'heal.per_second',
    '-enchps': 'heal.per_second',
    '+healed': 'heal.total',
    '-healed': 'heal.total'
  }

  class Renderer {

    constructor(config) {
      this.current = 0

      this.standby = true
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
        let current = this.config.tabs[k]
        // migration before 0.2; it's from 2016!!
        if(current.sort in TAB_SORTBY_MIGRATE_MAPPING) {
          current.sort = TAB_SORTBY_MIGRATE_MAPPING[current.sort]
        }
        this.tabs[k] = new Row(this.config.tabs[k])

        // Raven && Raven.captureException(e, {
        //   extra: {
        //     key: k,
        //     tab_string: k in this.config.tabs? JSON.stringify(this.config.tabs[k]) : 'undefined'
        //   }
        // })
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

      $('#table').setAttribute('data-width', this.tabs[id].tab.width)
    }

    browseHistory(id) {
      if(id === 'current')
        this.currentHistory = false
      else
        this.currentHistory = id
    }

    updateHeader() {
      let h = $('#header')
      h.parentNode.replaceChild(this.template.header, h)
    }

    updateFooter(d) {
      let r = Object.keys(this.config.footer).filter(_ => this.config.footer[_])
      for(let k of r) {
        this.elem[k] = this.elem[k] || $('#' + k)
        if(k == 'rank') {
          this.elem[k].textContent = d[k]
        } else {
          animateNumber(this.elem[k], pFloat(d[k]) || 0, {
            timeout: 266,
            digit: this.acc[k]
          })
        }
      }
    }

    update() {
      if(!window.hist.currentData) return

      if(this.standby) {
        $('body', 0).classList.remove('standby')
        this.standby = false
      }

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
      $('.history', 0).classList.toggle('stopped', data.isActive === 'false')
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
        table.appendChild(this.template.render(o, max))
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
      let el = document.createElement('span')
      el.className = `flex-column flex-column-${sanitize(c)}`

      if(!data) {
        let content = window.l.loaded? window.l.get(`col.${c}.0`) : '...'
        el.setAttribute('data-locale', `col.${c}.0`)
        el.innerHTML = content
        return el
      }
      const col = resolveDotIndex(COLUMN_INDEX, c)

      let val
      if(typeof col === 'string') {
        val = data[col]
        el.innerHTML = val
      } else {
        val = this._value(col.v, data)

        if(typeof col.f === 'function')
          el.innerHTML = col.f(val, window.config.get())
        else
          el.innerHTML = val
      }
      if(val == 0 || val === '0%' || val === '---') {
        el.classList.add('zero')
      }
      return el
    }

    render(data, max) {
      let el = document.createElement('li')
      let gaugeBy = resolveDotIndex(COLUMN_INDEX, this.tab.sort)
      // this.tab.gauge) <- deprecated

      if(gaugeBy.v) {
        gaugeBy = gaugeBy.v
      }

      if(data !== null) {
        let cls = sanitize(COLUMN_INDEX.i.class.v(data))
        el.classList.add('class-' + (cls || 'unknown'))
        el.classList.toggle('me', isYou(data.name, this.owners))

        let width = this._value(gaugeBy, data) / max[this.tab.sort] * 100
        el.innerHTML = `<span class="gauge" style="width:${width}%"></span>`
      } else {
        el.id = 'header'
      }

      for(let section of this.tab.col) {
        el.appendChild(this.part(section, data))
      }

      return el
    }

  }

  window.Renderer = Renderer
  window.Row = Row

})()
