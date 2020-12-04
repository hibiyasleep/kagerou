'use strict'

;(function() {

  const parseImportedString = function parseImportedString(s) {
    try {
      let d = JSON.parse(decodeURIComponent(escape(atob(s))))
      let header = d.h.split('|')
      return {
        data: d.d,
        header: {
          col: header[0].split(','),
          date: header[1]
        }
      }
    } catch(e) {
      return false
    }
  }

  const getUnduplicated = function getUnduplicated(key, value) {
    let _default = CONFIG_DEFAULT[key]
    let newObj = {}
    let updated = false

    if(key == 'tabs'
    && JSON.stringify(_default) === JSON.stringify(value)) {
      return false
    }

    for(let k in _default) {
      if(CONFIG_KEY_SHOULDNT_EXPORTED.indexOf(key + '.' + k) != -1
      || _default[k] == value[k])
        continue
      else {
        updated = true
        newObj[k] = value[k]
      }
    }

    return updated? newObj : null
  }

  const getExportedValue = function getExportedValue(col) {
    let d = {}

    if(!Array.isArray(col)) {
      col = col.split(',')
    }

    let c = col.slice(0)
    for(let k of c) {
      let g = getUnduplicated(k, config.get(k))
      if(g !== null)
        d[k] = g
      else {
        col.splice(col.indexOf(k), 1)
      }
    }

    return btoa(unescape(encodeURIComponent(JSON.stringify({
      d: d,
      h: `${col.join(',')}|${Date.now()}`
    }))))
  }

  const outputRow = function createOutputRow(t, c) {
    let element = document.createElement('p')
    let title = document.createElement('b')
    let content = document.createTextNode(': ' + c)
    title.textContent = t

    element.appendChild(title)
    element.appendChild(content)

    return element
  }


  window.addEventListener('load', _ => {

    $('#import-text').addEventListener('input', function() {
      let text = this.value.trim()
      let output = $('#import-data')

      output.innerHTML = ''
      if(!text) {
        return
      }

      let d = parseImportedString(text)

      if(!d) {
        output.textContent = locale.get('ui.config.i/e.data-fault')
        return
      }

      for(let k of ['style', 'color', 'colwidth', 'tabs']) {
        if(!d.data[k] || d.header.col.indexOf(k) === -1)
          continue

        if(k == 'tabs') {
          for(let kk in d.data[k]) {
            let v = d.data[k][kk]
            let title = document.createElement('h3')
            title.textContent = 'Tab: ' + v.label

            output.appendChild(title)
            output.appendChild(outputRow(locale.get('ui.config.tab.sortby'), v.sort))
            output.appendChild(outputRow(locale.get('ui.config.i/e.content-count'), v.col.length))
          }
        } else if(k == 'colwidth') {
          let h3 = document.createElement('h3')
          h3.textContent = locale.get('ui.config.width._')
          h3.setAttribute('data-locale', 'ui.config.width._')
          output.appendChild(h3)

          for(let kk in d.data[k]) {
            let o = kk.substr(1).split('-')
            let type = o[0]
            let col = o[1]
            let localized = locale.get(`col.${type}.${col}`)
            if(!localized) continue

            let title = locale.get(`col.${type}._`) + ' - ' + localized[1]
            output.appendChild(outputRow(title, d.data[k][kk]))
          }
        } else {
          let type = locale.get('config.' + k + '._')
          output.insertAdjacentHTML('beforeend', '<h3>' + type + '</h3>')

          for(let kk in d.data[k]) {
            let v = d.data[k][kk]
            let localized = locale.get(`config.${k}.${kk}`)
            if(!localized) continue

            output.appendChild(outputRow(localized, d.data[k][kk]))
          }
        }
      }
    })

    $('#import-with-prompt').addEventListener('click', _ => {
      $('#import-text').value = prompt(locale.get('ui.config.i/e.paste-here'))
    })
    $('#import-button').addEventListener('click', _ => {
      let text = $('#import-text').value.trim()
      let output = $('#import-data')

      if(!text) {
        return
      }

      let d = parseImportedString(text)

      if(!d) {
        output.textContent = locale.get('ui.config.i/e.data-fault')
        return
      }

      new dialog('confirm', {
        title: locale.get('ui.config.dialog.apply'),
        content: locale.get('ui.config.dialog.undone'),
        callback: _ => {
          for(let k of ['style', 'color', 'colwidth', 'tabs']) {
            config.update(k, d.data[k])
          }
          config.save()
          sendMessage('reload')
          location.reload()
        }
      })
    })

    $('#export-with-prompt').addEventListener('click', _ => {
      $('#export-button').click()
      setTimeout(_ => {
        prompt(locale.get('ui.config.i/e.copy-this'), $('#export-text').value)
      }, 10)
    })

    $('#export-button').addEventListener('click', _ => {
      $('#export-text').value = getExportedValue($('#export-column').value)
    })
  })

})()
