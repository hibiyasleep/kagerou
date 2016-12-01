'use strict'

const switchTab = function switchTab(target) {
  $('section.active', 0).classList.remove('active')
  $(`section[data-page='${target}']`, 0).classList.add('active')

  $('header h2', 0).textContent = $(`li[data-page='${target}']`, 0).textContent

  $('body', 0).classList.toggle('hide-header', target === 'info')
}

(function() {

  const updateIL = function updateIntegrationLabels(token, connected) {

    $('#current-account').textContent = `로그인됨: ${this.token.name} (${this.token.uid})`
    $('[data-button=log-in-out]', 0).textContent = '로그아웃'


    [].map.call($('.label-save-type'), _ => _.classList.toggle('hidden', 1))
    let c = $(`.label-save-type[data-where=${this.serv.connected.to}]`, 0)
    let c_id = c.getElementsByTagName('b')[0]

    c.classList.remove('hidden')
    if(c_id)
      c_id.innerText = serv.connected.id

  }

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

    // self-explationary
    $('#save').addEventListener('click', _ => {
      [].map.call($('input[data-config-key]'), o => {
        let value = o.value
        let type = o.getAttribute('data-type')

        if(type === 'array') {
          value = value.split(o.getAttribute('data-splitter')).map(_ => _.trim())
        } else if(type === 'boolean') {
          value = o.checked
        }
        config.set(o.getAttribute('data-config-key'), value)
      })

      config.save()
      OverlayPluginApi.broadcastMessage('reload')
    })

    // integration

    window.integration = new Integration()
    updateIL(integration.read())

    $('[data-button=log-in-out]', 0).addEventListener('click', function(e) {
      let loggedIn = this.textContent.trim() != '로그인'
      if(!loggedIn)
        integration.login()
      else
        new dialog('error', {
          title: '로그아웃하시겠습니까?',
          content: '서버에 저장된 모든 설정이 삭제됩니다.',
          callback: _ => {
            integration.logout()
            this.textContent = '로그인'
            $('#current-account').textContent = '로그인되지 않음'
            new dialog('confirm', {content: '로그아웃되었습니다.'})
          }
        })
    })

  })

})()
