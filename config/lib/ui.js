'use strict'

const switchTab = function switchTab(target) {
  $('section.active', 0).classList.remove('active')
  $(`section[data-page='${target}']`, 0).classList.add('active')
  let targetLi = $(`li[data-page='${target}']`, 0)

  $('header h2', 0).textContent = $(`li[data-page='${target}']`, 0).textContent
  $('header h2', 0).setAttribute(
    'data-locale',
    $(`li[data-page='${target}'] > label`, 0).getAttribute('data-locale')
  )

  $('body', 0).classList.toggle('hide-header', target === 'info')
}

const sendMessage = function sendMessage (message) {
  if(window.OverlayPluginApi) {
    OverlayPluginApi.broadcastMessage(message)
  } else if(window.opener) {
    window.opener.postMessage(message, '*')
  } else {
    new dialog('error', {
      title: window.locale.get('ui.config.dialog.manual-reload.title'),
      content: window.locale.get('ui.config.dialog.manual-reload.content')
    })
  }
}

;(function() {


  window.addEventListener('load', function(e) {

    // menu switcher
    $map('.menu li[data-page]', _ => {
      let target = _.getAttribute('data-page')
      _.addEventListener('click', function() {
        switchTab(target)
      })
    })

    // tab switcher

    $map('.tab-switcher', element => {
      let target = element.getAttribute('data-target')
      let targets = $(target, 0)

      ;[].forEach.call(element.getElementsByTagName('li'), _ => {
        _.addEventListener('click', function() {
          let id = this.getAttribute('data-pane')
          $(element, '.active', 0).classList.remove('active')
          $(targets, '.active', 0).classList.remove('active')
          $(element, `li[data-pane='${id}']`, 0).classList.add('active')
          $(targets, `[data-pane='${id}']`, 0).classList.add('active')
        })
      })
    })

    // colwidth
    ;(function(){
      const columns = COLUMN_INDEX
      const _container = $('section[data-page=width]', 0)

      for(let k1 in columns) {
        let article = '<article>'

        article += `<h3 data-locale="col.${k1}._"> </h3>`

        for(let k2 in columns[k1]) {
          if(k2 === '_' || k2 === 'icon') continue
          let id = `input-colwidth-_${k1}-${k2}`

          article += `
<p class="control">
  <label for="${id}" data-locale="col.${k1}.${k2}.1"> </label>
  <span class="input-group">
    <label class="input-value" for="${id}"> ... </label>
    <input type="range" id="${id}" min="1.5" step="0.5" max="9"
           data-config-key="colwidth._${k1}-${k2}" />
  </span>
</p>`
        }
        article += '</article>'

        _container.insertAdjacentHTML('beforeend', article)
      }
    })()

    // load config & fill all inputs
    $map('[data-config-key]', _ => {
      let placeholder = _.getAttribute('placeholder')
      let value = config.get(_.getAttribute('data-config-key'))
      let type = _.getAttribute('data-type')
      let unit = _.getAttribute('data-unit') || ''

      if(type === 'array') {
        _.value = value.join(', ')
      } else if(type === 'boolean') {
        _.checked = value
      } else if(type === 'integer') {
        _.value = +value
      } else {
        _.value = ((value || '') + '').replace(new RegExp(unit, 'g'), '')
      }

      // placeholder glitch workaround
      _.setAttribute('placeholder', '')
      _.setAttribute('placeholder', placeholder || '')
    })

    // listen on input changes, and show the value
    $map('.input-value', _ => {
      let target = $('#' + _.getAttribute('for'))
      _.textContent = config.get(target.getAttribute('data-config-key'))
      let unit = target.getAttribute('data-unit') || ''

      target.addEventListener('input', function(e) {
        _.textContent = this.value + unit
      })
    })

    $map('.input-value-style', _ => {
      let target = $('#' + _.getAttribute('for'))
      let key = target.getAttribute('data-style')
      let unit = target.getAttribute('data-unit') || ''

      _.style[key] = config.get(target.getAttribute('data-config-key'))

      target.addEventListener('input', function(e) {
        _.style[key] = this.value + unit
      })
    })

    // re-zero
    $map('[data-reset]', _ => {
      _.addEventListener('click', function(e) {
        let key = this.getAttribute('data-reset') || false
        new dialog('confirm', {
          title: window.locale.get('ui.config.dialog.really'),
          content: window.locale.get('ui.config.dialog.undone'),
          callback: _ => {
            config.reset(key)
            sendMessage('reload')
            location.reload()
          }
        })
      })
    })

    // save
    $('#save').addEventListener('click', _ => {
      [].map.call($('[data-config-key]'), o => {
        let value = o.value
        let type = o.getAttribute('data-type')
        let unit = o.getAttribute('data-unit') || ''
        let key = o.getAttribute('data-config-key')

        if(type === 'array') {
          value = value.split(o.getAttribute('data-splitter')).map(_ => _.trim())
        } else if(type === 'boolean') {
          value = o.checked
        } else {
          value += unit
        }

        config.set(key, value)
      })

      window.locale.setLang(config.get('lang'))

      tabconfig.save()

      // css editor

      config.set('custom_css', window.editor.getValue())

      config.save()
      sendMessage('restyle')
    })

    if(navigator.userAgent.indexOf('QtWebEngine') !== -1) {
      $('.ws-tab-notice', 0).classList.remove('hidden')

      const copyEvent = (type, event) => new event.constructor(type, event)
      let dragging = false

      document.addEventListener('dragstart', _ => dragging = true)
      document.addEventListener('dragend', _ => dragging = false)

      // mimics dragend
      document.addEventListener('mousedown', _ => {
        if(dragging) {
          dragging = false
          document.dispatchEvent(copyEvent('dragend', _))
        }
      })
    }

  })

})()
