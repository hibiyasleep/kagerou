'use strict'

;(function() {

  const sanitize = _ => _.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
  const toArray = o => Object.keys(o).map(_ => o[_])
  const SORTABLE = {}

  COLUMN_SORTABLE.map(_ => {
    let o = resolveDotIndex(COLUMN_INDEX, _)
    SORTABLE[o.v || o] = _
  })

  class Data {

    constructor(data) {
      // reconstruct
      this.update(data)
    }

    update(data) {
      this.header = data.Encounter
      this.data = toArray(data.Combatant)
      this.calculateMax(data.Combatant)
    }

    get(sort, merged) {
      let r = this.data.slice(0)

      if(merged) {
        let players = {}

        for(let o of r) {
          let name = o.name
          let owner = resolveOwner(name)
          let isUser = !owner
          owner = owner || name

          if(players[owner]) {
            for(let k of COLUMN_MERGEABLE) {
              players[owner][k] = parseFloat(o[k])
                + parseFloat(players[owner][k])
            }
            // if player: override metadata
            if(isUser) {
              players[owner].name = o.name
              players[owner].Job = o.Job
            }

          } else {
            players[owner] = Object.assign({}, o)
          }
        }
        console.log(players)
        r = toArray(players)
      }

      r = this.sort(sort, r)

      return [r, this.calculateMax(r)]
    }

    sort(key, target) {
      let d = (('+-'.indexOf(key[0]))+1 || 1) * 2 - 3
      let k = key.slice(1)

      ;(target || this.data).sort((a, b) =>
        (parseFloat(a[k]) - parseFloat(b[k])) * d)

      if(target) return target
    }

    calculateMax(combatant) {
      let max = {}

      for(let k in SORTABLE) {
        let v = SORTABLE[k]
        max[v] = Math.max.apply(
          Math, Object.keys(combatant).map(_ => combatant[_][k])
        )
      }

      return max
    }

    finalize() {
      let saveid = `kagerou_save_${Date.now()}` +
          sanitize(this.header.CurrentZoneName)

      return saveid
    }

  }

  class History {

    constructor() {
      this.lastEncounter = false
      this.currentData = false
      this.history = {}
    }

    push(data) {
      if(this.isNewEncounter(data.Encounter)) {

        if(this.currentData) {
          let id = this.currentData.finalize()
          this.history[id] = {
            id: id,
            title: this.currentData.header.title,
            dps: this.currentData.header.damage /
                 this.currentData.header.DURATION,
            data: this.currentData
          }
        }

        this.currentData = new Data(data)

      } else {
        this.currentData.update(data)
      }

      window.ui && window.ui.update()
      window.renderer.update()
    }

    updateLastEncounter(encounter) {
      this.lastEncounter = {
        title: encounter.title,
        damage: encounter.damage,
        duration: parseInt(encounter.DURATION)
      }
    }

    isNewEncounter(encounter) {
      if(!this.lastEncounter
      || this.lastEncounter.title !== encounter.title
      || this.lastEncounter.damage > encounter.damage
      || this.lastEncounter.duration > encounter.duration) {
        this.updateLastEncounter(encounter)
        return true
      }
      return false
    }

    get list() { return this.history }

    get current() { return this.currentData }

    browse(id) {
      return this.history[id]
    }
  }

  const listener = e => {
    window.hist.push(e.detail)
  }

  document.addEventListener('onOverlayDataUpdate', listener)
  document.addEventListener('message', e => {
    if(e.data.type == 'onOverlayDataUpdate') {
      listener(e)
    }
  })

  window.Data = Data

  window.hist = new History()

})()
