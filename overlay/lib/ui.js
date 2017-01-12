'use strict'

;(function(){

  class TabDisplay {

    constructor() {
      this.dom = $('.tabs', 0)
    }

    render() {
      this.dom.innerHTML = ''
      let firstTab = false

      for(let k in window.renderer.tabs){
        let v = window.renderer.tabs[k]
        let element = document.createElement('span')

        firstTab = firstTab || k

        element.textContent = v.tab.label

        element.addEventListener('click', e => {
          [].forEach.call($('.tabs span'), vv => vv.classList.remove('active'))
          element.classList.add('active')
          renderer.switchTab(k)
        })

        this.dom.insertAdjacentElement('beforeend', element)
      }

      $('.tabs span', 0).classList.add('active')
      renderer.switchTab(firstTab)
    }
  }

  class HistoryUI {

    constructor() { }

    updateList() {
      let dom = $('.dropdown-history', 0)
      let current = window.hist.current
      let active = window.renderer.currentHistory || 'current'
      let r = []

      dom.innerHTML = ''

      if(!current) {
        dom.innerHTML = `<li>
          <span data-locale="ui.header.no-data-yet">
            ${window.l.get('ui.header.no-data-yet')}
          </span>
          <br/>
          <span data-locale="ui.header.please-do-combat">
            ${window.l.get('ui.header.please-do-combat')}
          </span>
        </li>`
        return
      }

      for(let k in window.hist.list) {
        let v = window.hist.browse(k)
        r.push(this._render(v, active))
      }

      r.push(this._render({
        id: 'current',
        dps: current.header.encdps,
        title: current.header.title,
        duration: current.header.duration,
        region: current.header.CurrentZoneName
      }, active))

      r.reverse()
      if(r.length !== 0)
        r.map(_ => dom.insertAdjacentElement('beforeend', _))
    }

    _render(histdata, active) {
      let elem = document.createElement('li')

      elem.className = histdata.id === active? 'history-current' : ''
      elem.innerHTML = `
        <mark class="history-time">${histdata.duration}</mark>
        <span class="history-mob">${histdata.title}</span>
        <br />
        <span class="history-region">${window.l.zone(histdata.region)}</span>
        |
        <span class="history-dps">${parseFloat(histdata.dps).toFixed(2)}</span>
      `.trim()

      elem.addEventListener('click', e => {
        window.renderer.browseHistory(histdata.id)
        window.renderer.update()
      })
      return elem
    }
  }

  window.TabDisplay = TabDisplay
  window.HistoryUI = HistoryUI

  window.notify = function notify(message) {
    let d = $('.footer-notify', 0)
    d.textContent = '*' + message
    setTimeout(_ => d.textContent = '', 15000)
  }

  const loadFormatButtons = function loadFormatButtons() {
    [{
      value: 'format.merge_pet',
      callback: _ => {
        if(_){
          $('[data-button=merge-pet]', 0).classList.add('enabled')
          $('body', 0).classList.add('pet-merged')
        }
      }
    }, {
      value: 'format.nameblur',
      callback: _ => {
        if(_){
          $('[data-button=nameblur]', 0).classList.add('enabled')
          $('body', 0).classList.add('nameblur')
        }
      }
    }].forEach( _ => _.callback(config.get(_.value)) )
  }

  const setFooterVisibility = function setFooterVisibility() {
    let f = window.config.get('footer')
    Object.keys(f)
          .forEach(_ => $(`.footer-${_}`, 0).classList.toggle('hidden', !f[_]))
  }

  window.addEventListener('load', () => {

    // Dropdown

    $map('.dropdown-trigger', button => {
      let target = button.getAttribute('data-dropdown')

      button.addEventListener('click', function(e) {
        let l = $(`#dropdown-${target}`).classList

        if(l.contains('opened')) {
          l.remove('opened')
          l.add('closed')
          l.add('closing')
          setTimeout(_ => l.remove('closing'), 200)
        } else {
          l.add('opened')
          l.remove('closed')
        }
      })

      $(`#dropdown-${target}`).addEventListener('click', function(e) {
        this.classList.remove('opened')
        this.classList.add('closed')
        this.classList.add('closing')
        setTimeout(_ => this.classList.remove('closing'), 200)
      })
    })

    // dropdown menu label

    $map('#dropdown-more li', _ => {
      _.addEventListener('mouseover', function(e) {
        let label = this.getAttribute('data-label')
        let label_enabled = this.getAttribute('data-label-enabled')
        if(this.classList.contains('enabled')) {
          $('#nav-label').textContent = label_enabled || label
        } else {
          $('#nav-label').textContent = label
        }
      })
    })

    // load configs
    loadFormatButtons()


    // Button handlers
    ;[{
      name: 'toggle-detail',
      toggle: 'collapsed'
    }, {
      name: 'nameblur',
      toggle: 'nameblur'
    }, {
      name: 'merge-pet',
      toggle: 'pet-merged',
      callback: _ => {
        window.config.toggle('format.merge_pet')
        window.config.save()
        window.renderer.update()
      }
    }, {
      name: 'end-encounter',
      callback: _ => OverlayPluginApi.endEncounter()
    }, {
      name: 'settings',
      callback: _ => {
        let resize = window.config.get('style.resize-factor')

        window.open(
          '../config/index.html',
          'kagerou - Settings',
          `width=${800 * resize},height=${600 * resize}`
        )
      }
    }].forEach(_ => {
      $(`[data-button=${_.name}]`, 0).addEventListener('click', function(e) {
        if(_.toggle) {
          this.classList.toggle('enabled')
          $('main', 0).classList.toggle(_.toggle)
        }
        if(_.callback)
          _.callback(e)
      })
    })

    if(!('OverlayPluginApi' in window && 'endEncounter' in OverlayPluginApi)) {
      document.body.classList.add('legacy-overlayplugin')
    }

    setFooterVisibility()

  })


  document.addEventListener('onBroadcastMessageReceive', e => {
    let message

    try {
      message = e.detail.message
    } catch(e) {
      return
    }

    switch(message) {
      case 'reload':
        location.reload()
        break
      case 'restyle':
        config.load()
        config.setResizeFactor()
        config.attachOverlayStyle()
        window.l.setLang(config.get('lang'))
        setFooterVisibility()

        window.renderer = new Renderer(window.config.get())
        if(!window.tabdisplay)
          window.tabdisplay = new TabDisplay()
        window.tabdisplay.render()

        loadFormatButtons()
        return
    }
  })

})()
