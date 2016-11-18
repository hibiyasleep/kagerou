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

    update(index, time) { }

    updateList() {
      let dom = $('.dropdown-history')
      dom.innerHTML = ''
      for(let tab in window.hist) {
        //
      }
    }
  }

  window.addEventListener('load', () => {

    // Dropdown

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

    // pet merge

    $('[data-button="merge-pet"]', 0).addEventListener('click', function(e) {
      this.classList.toggle('enabled')
      window.config.toggle('format.mergePet')
      window.renderer.update()
    })

    if(config.get('format.mergePet')) {
      $('[data-button="merge-pet"]', 0).classList.add('enabled')
    }

    // nameblur
    $('[data-button="nameblur"]', 0).addEventListener('click', function(e) {
      this.classList.toggle('enabled')
      $('main', 0).classList.toggle('nameblur')
    })


    window.tabdisplay = new TabDisplay()
    tabdisplay.render()

  })



})()
