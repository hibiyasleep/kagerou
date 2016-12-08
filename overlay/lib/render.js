'use strict'

;(function(){

  const cell = function cell(col, value) {
    return `<span class="flex-column-${sanitize(col)}">${value}</span>\n`
  }

  const sanitize = _ => _.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()

  class Renderer {

    constructor(config) {
      this.current = 0

      this.latestData = null
      this.currentHistory = false
      this.updateConfig(config)
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
      let header = $('#header')
      header.outerHTML = this.template.header
    }

    update() {
      if(!this.currentHistory) {
        this.render(window.hist.current)
      } else {
        this.render(window.hist.browse(this.currentHistory).data)
      }
    }

    render(data) {
      // damn chromium 45

      // history header
      $('.history', 0).classList.toggle('enabled', !data.isCurrent)
      $('#history-time').textContent = data.header.duration
      $('#history-mob').textContent = data.header.title
      $('#history-region').textContent = data.header.CurrentZoneName

      // columns
      let got = data.get(
        this.template.tab.sort,
        window.config.get('format.merge_pet')
      )
      let d = got[0], max = got[1]
      let table = $('#table')

      table.innerHTML = ''
      for(let i of d) {
        table.insertAdjacentHTML(
          'beforeend',
          this.template.render(i, max)
        )
      }

      // footer (rdps etc)

      $('#rdps').textContent = data.header.encdps
      $('#rhps').textContent = data.header.enchps
    }

  }

  class Row {

    constructor(tab) {
      this.tab = tab
      this.header = this.render(null)
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
      let title = window.l.get(`col.${col.split('.')[0]}._`)
      let content = window.l.get(`col.${col}`)
      if(!content) {
        console.error(`Cannot find localized string for col.${col}`)
      }
      return `<span title="${title}: ${content[1]}">${content[0]}</span>`
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
        r = `<li class="class-${cls} ${data.name === 'YOU'? 'me' : ''}">`

        let width = this._value(gaugeBy, data) / max[this.tab.gauge] * 100
        r += `<span class="guage" style="width:${width}%"></span>`
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
