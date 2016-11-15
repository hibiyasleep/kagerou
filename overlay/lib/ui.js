'use strict'

;(function(){

  class TabDisplay {

    constructor() {
      this.dom = $('.tabs', 0)
    }


    render() {
      this.dom.innerHTML = ''

      window.renderer.tabs.forEach((v, k) => {
        let element = document.createElement('li')

        element.className = 'button button-text'
        element.textContent = v.tab.label

        element.addEventListener('click', e => {
          [].forEach.call($('.tabs li'), vv => vv.classList.remove('active'))
          element.classList.add('active')
          renderer.switchTab(k)
        })

        this.dom.insertAdjacentElement('beforeend', element)
      })

      $('.tabs li', 0).classList.add('active')
    }

  }

  window.addEventListener('load', () => {
    let dropdowns = $('.dropdown-trigger')

    ;[].forEach.call(dropdowns, button => {
      let target = button.getAttribute('data-dropdown')

      const listener = function(e) {
        $(`#dropdown-${target}`).classList.toggle('opened')
      }

      button.addEventListener('click', listener)
    })

    $('[data-button=toggle-detail]', 0).addEventListener('click', function(e) {
      this.classList.toggle('enabled')
      $('main', 0).classList.toggle('collapsed')
    })

    window.tabdisplay = new TabDisplay()
    tabdisplay.render()

  })



})()
