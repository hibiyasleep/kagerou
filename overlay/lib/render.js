'use strict'

;(function(){

  const cell = function cell(col, value) {
    return `<span class="flex-column-${sanitize(col)}">${value}</span>\n`
  }

  const sanitize = _ => _.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()


  class Renderer {

    constructor(config) {
      this.config = config
      this.tabs = []
      this.current = 0

      this.latestData = null
      this.currentHistory = false

      for(let t in this.config.tabs) {
        this.tabs[t] = new Row(this.config.tabs[t])
        try {

        } catch(e) {
          // TODO: global error handler
          console.error(`Error while compiling tab ${t}: ${e}`)
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
      }
    }

    render(data) {
      let d
      let table = $('#table')
      data.sort(this.template.tab.sort)
      d = data.data

      table.innerHTML = ''
      for(let i of d) {
        table.insertAdjacentHTML(
          'beforeend',
          this.template.render(i, data.max)
        )
      }
    }

  }

  class Row {

    constructor(tab) {
      this.tab = tab
      this.header = this.render(null)
    }

    part(c, data) {
      const col = resolveDotIndex(COLUMN_INDEX, c)

      if(typeof col === 'string') {
        return data[col]
      } else {
        let val

        if(typeof col.v === 'string')
          val = data[col.v]
        else if(typeof col.v === 'function')
          val = col.v(data)

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
      let r, part

      if(data === null) {
        r = `<li id="header">`
        part = this.getTitle
      } else {
        part = this.part
        r = `<li class="class-${sanitize(part('i.class', data))}">`

        let width = part(this.tab.gauge, data) /
                    max[this.tab.gauge] * 100
        r += `<span class="guage" style="width:${width}%"></span>`
      }

      for(let section of this.tab.col) {

        if(typeof section === 'string') { // single-value cell
          r += cell(section, part(section, data))
        } else {
          r += '<section>\n'

          for(let line of section) {
            r += '<div>\n'
            for(let c of line) {
              r += cell(c, part(c, data))
            }
            r += '</div>\n'
          }

          r += '</section>\n'
        }
      }

      r += '</li>'

      return r
    }

  }

  window.Renderer = Renderer

  window.renderer = new Renderer(window.config.get())

  document.addEventListener('DOMContentLoaded', e => {
    window.renderer.updateHeader()
  })

})()
