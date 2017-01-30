'use strict'

;(function() {

  class Dialog {

    constructor(type, option) {
      if(window.lastDialog) {
        window.lastDialog._remove()
      }
      window.lastDialog = this

      this.callback = typeof option.callback === 'function' && option.callback
      this.dom = this._container(type)

      this.dom.insertAdjacentHTML(
        'beforeend',
        this._content(option.title, option.content)
      )
      this._insert()
    }

    _container(clsname) {
      let dom = document.createElement('div')
      let buttons = document.createElement('span')

      dom.className = 'dialog removing'
      dom.classList.add(clsname)

      buttons.className = 'buttons'

      if(this.callback) {
        for(let b of ['yes', 'no']) {
          let button = document.createElement('button')
          button.className = 'dialog-button ' + b
          button.addEventListener('click', _ => {
            if(b === 'yes') this.callback()
            this._remove(button.parentNode.parentNode)
          })
          button.textContent = window.locale.get('ui.config.dialog.' + b)
          buttons.appendChild(button)
        }
      } else {
        let button = document.createElement('button')
        button.className = 'dialog-button close'
        button.addEventListener('click', _ => {
          this._remove(button.parentNode.parentNode)
        })
        buttons.appendChild(button)
      }

      dom.insertAdjacentElement('afterbegin', buttons)

      return dom
    }
    _content(title, content) {
      let h = ''
      if(title) h += `<h4>${title}</h4>`
      if(content) h += `<p>${content}</p>`
      return h
    }
    _insert() {
      let section = $('section.active', 0)
      if(section.classList.contains('tabbed-section'))
        section.insertBefore(this.dom, section.firstChild)
      else {
        let main = $('main', 0)
        main.insertBefore(this.dom, main.firstChild)
      }
      setTimeout(_ => this.dom.classList.remove('removing'), 1)
    }
    _remove() {
      if(window.lastDialog == this) {
        window.lastDialog = null
      }
      this.dom.classList.add('removing')
      setTimeout(_ => this.dom.remove(), 500)
    }
  }

  window.dialog = Dialog

})()
