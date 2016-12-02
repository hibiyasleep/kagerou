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

      if(type === 'array') {
        _.value = value.join(', ')
      } else if(type === 'boolean') {
        _.checked = value
      } else {
        _.value = value || ''
      }

      // placeholder glitch workaround
      _.setAttribute('placeholder', '')
      _.setAttribute('placeholder', placeholder)
    })

    // listen on input changes, and show the value
    ;[].map.call($('.input-value'), _ => {
      let target = $('#' + _.getAttribute('for'))
      _.textContent = config.get(target.getAttribute('data-config-key'))

      target.addEventListener('input', function(e) {
        _.textContent = this.value
      })
    })
    ;[].map.call($('.input-value-color'), _ => {
      let target = $('#' + _.getAttribute('for'))
      _.style.backgroundColor = config.get(target.getAttribute('data-config-key'))

      target.addEventListener('input', function(e) {
        _.style.backgroundColor = this.value
      })
    })

    // re-zero
    $('#button-reset').addEventListener('click', _ => {
      let d = new dialog('confirm', {
        title: '이 작업은 되돌릴 수 없습니다.',
        content: '설정을 전부 초기화시키겠습니까?',
        callback: _ => {
          this.config.reset()
          OverlayPluginApi.broadcastMessage('reload')
          location.reload()
        }
      })
    })

    // save
    $('#save').addEventListener('click', _ => {
      [].map.call($('input[data-config-key]'), o => {
        let value = o.value
        let type = o.getAttribute('data-type')

        if(type === 'array') {
          value = value.split(o.getAttribute('data-splitter')).map(_ => _.trim())
        } else if(type === 'boolean') {
          value = o.checked == 'true'
        }
        config.set(o.getAttribute('data-config-key'), value)
      })

      config.save()
      OverlayPluginApi.broadcastMessage('reload')
    })

  })

})()
