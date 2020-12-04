'use strict'

;(function() {

  const liRender = (_, locale) => {
    let head = `<b data-locale="col.${_.split('.')[0]}._">..</b>`
    let label = `<span data-locale="col.${_}.1">...</span>`
    return `<li data-id="${_}">${head}: ${label}</li>`
  }

  const MIGRATE_SORTABLE = {
    'encdps': 'deal.per_second',
    'damage': 'deal.total',
    'damagetaken': 'tank.damage',
    'enchps': 'heal.per_second',
    'healed': 'heal.total',
  }

  const forceFallback = navigator.userAgent.indexOf('QtWebEngine') !== -1
                     || 'obsstudio' in window

  class Tabconfig {

    constructor() {
      this.tabs = config.get('tabs')

      this.template = {
        tab: $('#template-tab').content,
        pane: $('#template-pane').content
      }
      this.container = {
        tab: $('#tab-container'),
        pane: $('#tabconfig-pane-container')
      }
      this.newTabButton = $('#tab-new')
      this.newTabButton.addEventListener('click', _ => {
        this.newTab()
      })
      this.firstTab = true

      this.selections = COLUMN_SORTABLE.map(_ => {
        // let head = `<span data-locale="col.${_.split('.')[0]}._">...</span>`
        // let label = `<span data-locale="col.${_}.1">...</span>`
        return `<option value="${_}" data-locale="col.${_.split('.')[0]}._+: +col.${_}.1"></option>`
      }).join('')

      this.columns = []

      for(let k1 in COLUMN_INDEX) {
        let v1 = COLUMN_INDEX[k1]

        for(let k2 in v1) {
          let id = k1 + '.' + k2
          this.columns.push(id)
        }
      }

      for(let k in this.tabs) {
        this.append(this.tabs[k])
      }

      this.sortable = Sortable.create(this.container.tab, {
        group: 'tab',
        animation: 166,
        draggable: '.draggable',
        forceFallback: forceFallback
      })
    }

    _switch(id) {
      $map(this.container.pane, '.tabconfig-pane', _ => {
        _.classList.remove('active')
      })
      $(this.container.pane, `.tabconfig-pane[data-id='${id}']`, 0)
        .classList.add('active')

      $map(this.container.tab, '.tab li', _ => _.classList.remove('active'))
      $(`.tab [data-id='${id}']`, 0).classList.add('active')
    }

    _read() {
      return $map('#tab-container li', _ => {
        let id = _.getAttribute('data-id')
        if(!id) return false
        let pane = $(this.container.pane, `.tabconfig-pane[data-id="${id}"]`, 0)
        let r = { id: id }

        r.label = $(pane, '[data-render="title.input"]', 0).value
        r.width = $(pane, '[data-render="width.input"]', 0).value
        r.sort = $(pane, '[data-render="sort.input"]', 0).value
        r.col = $map(pane, '[data-control="columns.used"] li', __ => {
          return __.getAttribute('data-id')
        })

        return r
      }).filter(Boolean)
    }

    save() {
      config.set('tabs', this._read())
    }

    append(o) {
      let tab = document.importNode(this.template.tab, true)
                .firstElementChild
      let pane = document.importNode(this.template.pane, true)
                 .firstElementChild

      // tab

      tab.setAttribute('data-id', o.id)

      $(tab, 'label', 0).textContent = o.label
      $(tab, 'svg', 0).addEventListener('click', e => {
        this.remove(o.id)
        e.stopPropagation()
      })
      tab.addEventListener('click', _ => {
        this._switch(o.id)
      })

      // pane

      pane.setAttribute('data-id', o.id)

      let listLeft = $(pane, '[data-control="columns.available"]', 0)
      let listRight = $(pane, '[data-control="columns.used"]', 0)

      let unusedCol = this.columns.slice(0)
      let usedCol = o.col
      usedCol.forEach(_ => {
        listRight.insertAdjacentHTML('beforeend', liRender(_, locale))
        unusedCol.splice(unusedCol.indexOf(_), 1)
      })
      unusedCol.forEach(_ => {
        listLeft.insertAdjacentHTML('beforeend', liRender(_, locale))
      })

      const commonOptions = {
        group: 'g' + o.id,
        animation: 150,
        forceFallback: forceFallback
      }

      Sortable.create(listLeft, commonOptions)
      Sortable.create(listRight, commonOptions)

      let title = $(pane, '[data-render="title.input"]', 0)
      let width = $(pane, '[data-render="width.input"]', 0)
      let sort = $(pane, '[data-render="sort.input"]', 0)

      title.value = o.label
      sort.innerHTML = this.selections

      title.addEventListener('keyup', function() {
        $(tab, 'label', 0).textContent = this.value
      })

      if(MIGRATE_SORTABLE[o.sort])
        sort.value = MIGRATE_SORTABLE[o.sort]
      else
        sort.value = o.sort
      width.value = o.width || 1

      for(let k of ['title', 'width', 'sort']) {
        let id_input = `input-${k}-${o.id}`
        let label = $(pane, `[data-render="${k}.label"]`, 0)
        let input = $(pane, `[data-render="${k}.input"]`, 0)

        label.setAttribute('for', id_input)
        input.id = id_input
      }

      if(this.firstTab) {
        tab.classList.add('active')
        pane.classList.add('active')
        this.firstTab = false
      }

      if(window.locale.loaded)
        window.locale.localizeAll(pane)

      this.container.tab.insertBefore(tab, this.newTabButton)
      this.container.pane.appendChild(pane)

    }

    newTab() {
      let id = Date.now()
      this.append({
        id: id,
        label: 'Tab',
        width: 1,
        sort: 'deal.total',
        col: [
          'i.icon',
          'i.name'
        ]
      })
      this._switch(id)
    }

    remove(id) {
      $(`.tabconfig-pane[data-id='${id}']`, 0).remove()
      $(`.tab [data-id='${id}']`, 0).remove()
      $(`.tab li`, 0).click()
    }

  }

  window.Tabconfig = Tabconfig

})()
