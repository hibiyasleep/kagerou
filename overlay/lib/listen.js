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
      this.isCurrent = true
      this.saveid = `kagerou_save_${Date.now()}` +
          sanitize(this.header.CurrentZoneName)
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

          if(window.config.get('format.myname').indexOf(owner) != -1) {
            owner = 'YOU'
          }
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
      this.isCurrent = false
      return this.saveid
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
            region: this.currentData.header.CurrentZoneName,
            duration: this.currentData.header.duration,
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
        hits: encounter.hits,
        region: encounter.CurrentZoneName,
        damage: encounter.damage,
        duration: parseInt(encounter.DURATION)
      }
    }

    isNewEncounter(encounter) {
      let really = (
        !this.lastEncounter
      || this.lastEncounter.region !== encounter.CurrentZoneName
      || this.lastEncounter.duration > parseInt(encounter.DURATION)
      // ACT-side bug (scrambling data) making this invalid!
      // || this.lastEncounter.damage > encounter.damage
      // || this.lastEncounter.hits > encounter.hits
      )
      this.updateLastEncounter(encounter)
      return really
    }

    get list() { return this.history }

    get current() { return this.currentData }

    browse(id) {
      return this.history[id]
    }
  }

  window.Data = Data
  window.History = History


})()
