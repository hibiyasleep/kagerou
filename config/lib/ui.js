'use strict'

const switchTab = function switchTab(target) {
  $('section.active', 0).classList.remove('active')
  $(`section[data-page='${target}']`, 0).classList.add('active')

  $('header h2', 0).textContent = $(`li[data-page='${target}']`, 0).textContent

  $('body', 0).classList.toggle('hide-header', target === 'info')
}

;(function() {

  window.addEventListener('load', function(e) {

    // menu switcher
    [].map.call($('.menu li[data-page]'), _ => {
      let target = _.getAttribute('data-page')
      _.addEventListener('click', function() {
        switchTab(target)
      })
    })

    // load config & fill all inputs
    ;[].map.call($('input[data-config-key]'), _ => {
      let placeholder = _.getAttribute('placeholder')
      let value = config.get(_.getAttribute('data-config-key'))
      let type = _.getAttribute('data-type')
      let unit = _.getAttribute('data-unit') || ''

      if(type === 'array') {
        _.value = value.join(', ')
      } else if(type === 'boolean') {
        _.checked = value
      } else {
        _.value = ((value || '') + '').replace(new RegExp(unit, 'g'), '')
      }

      // placeholder glitch workaround
      _.setAttribute('placeholder', '')
      _.setAttribute('placeholder', placeholder || '')
    })

    // listen on input changes, and show the value
    ;[].map.call($('.input-value'), _ => {
      let target = $('#' + _.getAttribute('for'))
      _.textContent = config.get(target.getAttribute('data-config-key'))

      target.addEventListener('input', function(e) {
        _.textContent = this.value
      })
    })
    ;[].map.call($('.input-value-style'), _ => {
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
          title: '이 작업은 되돌릴 수 없습니다.',
          content: '해당 설정을 초기화시키겠습니까?',
          callback: _ => {
            this.config.reset(key)
            OverlayPluginApi.broadcastMessage('reload')
            location.reload()
          }
        })
      })
    })

    // save
    $('#save').addEventListener('click', _ => {
      [].map.call($('input[data-config-key]'), o => {
        let value = o.value
        let type = o.getAttribute('data-type')
        let unit = o.getAttribute('data-unit') || ''

        if(type === 'array') {
          value = value.split(o.getAttribute('data-splitter')).map(_ => _.trim())
        } else if(type === 'boolean') {
          value = o.checked == 'true'
        } else {
          value += unit
        }
        config.set(o.getAttribute('data-config-key'), value)
      })

      config.save()
      OverlayPluginApi.broadcastMessage('reload')
    })

  })

})()
