'use strict'

;(function(){

  class TabDisplay {

    constructor() {
      this.dom = $('.tabs', 0)
    }


    render() {
      this.dom.innerHTML = ''

      window.renderer.tabs.forEach((v, k) => {
        let element = document.createElement('span')

        element.textContent = v.tab.label

        element.addEventListener('click', e => {
          [].forEach.call($('.tabs span'), vv => vv.classList.remove('active'))
          element.classList.add('active')
          renderer.switchTab(k)
        })

        this.dom.insertAdjacentElement('beforeend', element)
      })

      $('.tabs span', 0).classList.add('active')
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
          아직 데이터가 없습니다.
          <br/>전투를 진행 후 다시 확인해주세요.
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
        <span class="history-region">${histdata.region}</span>
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

  window.addEventListener('load', () => {

    // Dropdown

    let dropdowns = $('.dropdown-trigger')

    ;[].forEach.call(dropdowns, button => {
      let target = button.getAttribute('data-dropdown')

      button.addEventListener('click', function(e) {
        let l = $(`#dropdown-${target}`).classList

        if(l.contains('opened')) {
          l.remove('opened')
          l.add('closing')
          setTimeout(_ => l.remove('closing'), 200)
        } else {
          l.add('opened')
        }
      })

      $(`#dropdown-${target}`).addEventListener('click', function(e) {
        this.classList.remove('opened')
        this.classList.add('closing')
        setTimeout(_ => this.classList.remove('closing'), 200)
      })
    })

    // load configs
    ;[{
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
        window.renderer.update()
      }
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

    window.tabdisplay = new TabDisplay()
    tabdisplay.render()

    window.historyUI = new HistoryUI()

    $('.history', 0).addEventListener('click', e => {
      window.historyUI.updateList()
    })

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
        return
    }
  })

})()
