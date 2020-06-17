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

        this.dom.appendChild(element)
      }

      $('.tabs span', 0).classList.add('active')
      renderer.switchTab(firstTab)

      return window.renderer.tabs.length
    }
  }

  class HistoryUI {

    constructor() { }

    updateList() {
      let dom = $('.dropdown-history', 0)
      let current = window.hist.current
      let active = window.renderer.currentHistory || 'current'
      let r = []

      if(!current) {
        return
      }

      dom.innerHTML = ''

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
        r.map(_ => dom.appendChild(_))
    }

    _render(histdata, active) {
      let elem = document.createElement('li')

      elem.className = histdata.id === active? 'history-current' : ''
      elem.innerHTML = `
        <mark class="history-time">${histdata.duration}</mark>
        <span class="history-mob">${histdata.title}</span>
        <br />
        <span class="history-region">${window.l.zone(histdata.region)}</span>
        <span class="history-dps">${parseFloat(histdata.dps).toFixed(2)}</span>`

      elem.addEventListener('click', e => {
        window.renderer.browseHistory(histdata.id)
        window.renderer.update()
      })
      return elem
    }
  }

  window.TabDisplay = TabDisplay
  window.HistoryUI = HistoryUI

  const loadFormatButtons = function loadFormatButtons() {
    [{
      value: 'format.merge_pet',
      callback: _ => {
        if(_){
          $('[data-button=merge-pet]', 0).classList.add('enabled')
          document.body.classList.add('pet-merged')
        }
      }
    }, {
      value: 'format.nameblur',
      callback: _ => {
        if(_){
          $('[data-button=nameblur]', 0).classList.add('enabled')
          document.body.classList.add('nameblur')
        }
      }
    }, {
      value: 'element.narrow-nav',
      callback: _ => {
        document.body.classList.toggle('narrow-nav', _)
      }
    }, {
      value: 'element.hide-footer',
      callback: _ => {
        document.body.classList.toggle('hide-footer', _)
      }
    }].forEach( _ => _.callback(config.get(_.value)) )
  }

  const setFooterVisibility = function setFooterVisibility() {
    let r = false
    const f = window.config.get('footer')
    for(let _ in f) {
      if(_ === 'recover') {
        continue
      }
      const el = $(`.footer-${_}`, 0)
      if(f[_]) {
        el.classList.remove('hidden')
      } else {
        el.classList.add('hidden')
        r = true
      }
    }

    return r
  }

  window.addEventListener('load', () => {

    // Dropdown

    $map('.dropdown-trigger', button => {
      let target = button.getAttribute('data-dropdown')
      let el = $(`#dropdown-${target}`)

      button.addEventListener('click', function(e) {
        let l = el.classList

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

      if(el.getAttribute('data-event-attached') !== null) {
        return
      } else {
        el.setAttribute('data-event-attached', '')
      }
      el.addEventListener('click', function(e) {
        this.classList.remove('opened')
        this.classList.add('closed')
        this.classList.add('closing')
        setTimeout(_ => this.classList.remove('closing'), 200)
      })
    })

    $('#table').addEventListener('contextmenu', event => {
      if(event.target.classList.contains('flex-column-i-name')) {
        $('[data-button="nameblur"]', 0).click()
      }
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
      callback: _ => layer.request('end')
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
    }, {
      name: 'donate',
      callback: _ => {
        let resize = window.config.get('style.resize-factor')

        window.open(
          'https://hibiya.moe/donate',
          'hibiya.moe - donate',
          `width=${800 * resize},height=${600 * resize}`
        )
      }
    }, {
      name: 'fullscreen',
      toggle: 'fullscreen',
      callback: _ => {
        // WEB IS AWESOME
        if(!document.fullscreenElement
        && !document.mozFullScreenElement
        && !document.webkitFullscreenElement) {
          if(document.documentElement.requestFullscreen)
            document.documentElement.requestFullscreen()
          if(document.documentElement.mozRequestFullScreen)
            document.documentElement.mozRequestFullScreen()
          if(document.documentElement.webkitrequestFullscreen)
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        } else {
          if(document.cancelFullScreen)
            document.cancelFullScreen()
          if(document.mozCancelFullScreen)
            document.mozCancelFullScreen()
          if(document.webkitCancelFullScreen)
            document.webkitCancelFullScreen()
        }
      }
    }, {
      name: 'capture',
      callback: _ => {
        if(layer.supports('capture')) {
          setTimeout(_ => layer.request('capture'), 216)
        }
      }
    }].forEach(_ => {
      [].forEach.call($(`[data-button=${_.name}]`), el => {
        el.addEventListener('click', function(e) {
          if(_.toggle) {
            this.classList.toggle('enabled')
            document.body.classList.toggle(_.toggle)
          }
          if(_.callback)
            _.callback(e)
        })
      })
    })

    if(!layer.supports('end')) {
      document.body.classList.add('legacy-plugin')
    }

    document.body.classList.add(layer.type)
    document.body.classList.add(location.protocol.slice(0, -1))
    if(navigator.userAgent.indexOf('Overlay') !== -1
    || 'OverlayPluginApi' in window) {
      document.body.classList.add('overlay')
    }

    setFooterVisibility()

  })


  window.layer.on('message', e => {
    switch(e.message) {
      case 'reload':
        location.reload()
        break
      case 'restyle':
        config.load()
        config.setResizeFactor()
        config.attachOverlayStyle()
        window.l.setLang(config.get('lang'))

        window.renderer = new Renderer(window.config.get())
        if(hist.currentData) renderer.render(hist.currentData)

        window.tabdisplay = new TabDisplay()

        $('footer', 0).classList.toggle('hidden',
          window.config.get('element.hide-footer') ||
         (window.config.get('element.use-header-instead') ||
          setFooterVisibility() === 0) &&
          window.tabdisplay.render() === 1
        )

        loadFormatButtons()
        return
    }
  })

})()
