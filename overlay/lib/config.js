'use strict'

const VERSION = '0.1.3'

const CONFIG_DEFAULT = {
  lang: 'ko',
  style: {
    // body
    'resize-factor': 1,
    'body-margin': '0.25rem',
    'body-font': "'Roboto', 'Source Han Sans', 'MalgunGotinc', '본고딕', '맑은 고딕', sans-serif",
    // header / ui
    'nav-bg': 'rgba(31, 31, 31, 0.9)',
    'nav-fg': '#ddd',
    'content-bg': 'rgba(0, 0, 0, 0.5)',
    'content-fg': '#eee',
    'color-accent': '#FF6F00',
    'shadow-card': '0 0.05rem 0.25rem rgba(0, 0, 0, 0.5)',
    'shadow-text': '0 0 0.125em rgba(0, 0, 0, 1)',
    'font-size-small': '0.75rem',
    'graph-height': '1.5rem'
  },
  tabs: [
    {
      label: '딜',
      gauge: 'deal.total',
      sort: '+damage',
      subgauge: false,
      col: [
        'i.icon',
        'i.name',
        'deal.pct',
        'deal.per_second',
        'deal.total',
        'deal.critical',
        'deal.swing'
      ]
    }, {
      label: '탱',
      gauge: 'tank.damage',
      sort: '+damagetaken',
      subgauge: false,
      col: [
        'i.icon',
        'i.name',
        'deal.per_second',
        'tank.damage',
        'tank.heal',
        'tank.parry',
        'etc.death'
      ]
    }, {
      label: '힐',
      gauge: 'heal.total',
      sort: '+healed',
      subgauge: false,
      col: [
        'i.icon',
        'i.name',
        'heal.pct',
        'heal.per_second',
        'heal.total',
        'heal.over',
        'heal.swing'
      ]
    }
  ],
  colwidth: {
    '_i-name': 6,
    '_i-owner': 6,
    '_deal-total': 4.5,
    '_deal-per_second': 3.5,
    '_deal-pct': 2,
    '_deal-accuracy': 3,
    '_deal-swing': 2.5,
    '_deal-miss': 2.5,
    '_deal-hitfail': 2.5,
    '_deal-critical': 2,
    '_heal-critical': 2,
    '_tank-damage': 3.5,
    '_tank-heal': 3.5,
    '_tank-parry': 2,
    '_tank-block': 2,
    '_heal-per_second': 3,
    '_heal-pct': 2,
    '_heal-total': 4,
    '_heal-swing': 2,
    '_heal-over': 2,
    '_heal-cure': 2,
    '_etc-powerdrain': 4,
    '_etc-powerheal': 4,
    '_etc-death': 2
  },
  format: {
    significant_digit: {
      dps: 2,
      hps: 2,
      accuracy: 2
    },
    merge_pet: true,
    myname: []
  }
}

const COLUMN_SORTABLE = [
  'deal.per_second',
  'deal.total',
  'tank.damage',
  'heal.per_second',
  'heal.total'
]
const COLUMN_MERGEABLE = [
  'encdps', 'damage', 'damage%',
  'swings', 'misses', 'hitfailed',
  'crithit', 'maxhit', 'damagetaken',
  'healstaken', 'enchps', 'healed',
  'healed%', 'heals', 'critheal',
  'cures', 'powerdrain', 'powerheal'
]

const PET_MAPPING = {
  '요정 에오스': 'eos',
  '가루다 에기': 'garuda',
  '타이탄 에기': 'titan',
  '이프리트 에기': 'ifrit',
  '요정 셀레네': 'selene',
  '카벙클 에메랄드': 'emerald',
  '카벙클 토파즈': 'topaz',
  '자동포탑 룩': 'look',
  '자동포탑 비숍': 'bishop'
}

const COLUMN_INDEX = {
  i: {
    icon: {
      v: _ => resolveClass(_.Job, _.name)[0],
      f: _ => `<img src="img/class/${_.toLowerCase()}.png" class="clsicon" />`
    },
    class: {
      v: _ => resolveClass(_.Job, _.name)[0]
    },
    owner: {
      v: _ => resolveClass(_.Job, _.name)[2],
      f: _ => `<span>${_}</span>`
    },
    name: {
      v: _ => resolveClass(_.Job, _.name)[1],
      f: _ => `<span class="${_ === 'YOU'? 'name-you' : ''}">${_}</span>`
    }
  },
  // deal
  deal: {
    per_second: {
      v: 'encdps',
      f: (_, conf) => parseFloat(_).toFixed(conf.format.significant_digit.dps) || '-'
    },
    pct: {
      v: 'damage%',
      f: _ => parseInt(_) + '%'
    },
    total: 'damage',
    accuracy: { // '정확도'
      v: _ => _.swings > 0? _.misses/_.swings * 100 : -1,
      f: (_, conf) => _ < 0? '-' :  _.toFixed(conf.format.significant_digit.accuracy)
    },
    swing: 'swings',
    miss: 'misses',
    hitfail: 'hitfailed',
    critical: 'crithit%',
    maxhit: 'maxhit'
  },
  // tank
  tank: {
    damage: {
      v: 'damagetaken',
      f: _ => '-' + _
    },
    heal: {
      v: 'healstaken',
      f: _ => '+' + _
    },
    parry: 'ParryPct',
    block: 'BlockPct'
  },
  // heal
  heal: {
    per_second: {
      v: 'enchps',
      f: (_, conf) => parseFloat(_).toFixed(conf.format.significant_digit.hps) || '-'
    },
    pct: {
      v: 'healed%',
      f: _ => parseInt(_) + '%'
    },
    total: 'healed',
    over: 'OverHealPct',
    swing: 'heals',
    critical: 'critheal%',
    cure: 'cures'
  },
  etc: {
    powerdrain: 'powerdrain',
    powerheal: 'powerheal',
    death: 'deaths'
  }
}

;(function() {

  const copy = function copyByJsonString(o) {
    return JSON.parse(JSON.stringify(o))
  }

  class Config {

    constructor() { }

    load() {
      let localConfig = copy(CONFIG_DEFAULT)
      let rawJson = localStorage.getItem('kagerou_config')
      let o

      try {
        o = JSON.parse(rawJson)
      } catch(e) { // broken!
        o = null
      }

      if(!o) { // anyway, it's empty, let's populate localStorage
        localStorage.setItem('kagerou_config', JSON.stringify(localConfig))
        this.config = localConfig
      } else {
        this.config = updateObject(localConfig, o)
      }

      return this.config
    }

    attachCSS(path, section) {
      let variables = copy(this.config.style)

      if(section) {
        if(!Array.isArray(section)) {
          section = [section]
        }
        section = section.map(_ => this.config[_])

        variables = Object.assign.apply(null, [variables].concat(section))
      }

      if(!Array.isArray(path)) {
        path = [path]
      }

      for(let p of path){
        let sanitizedId = p.replace(/[^a-z]/g, '_')
        let oldNode = document.getElementById(sanitizedId)

        fetch(p).then(res => {
          if(!res.ok) return ''
          return res.text()
        }).then(css => {
          for(let k in variables) {
            css = css.replace(new RegExp(`var\\(--${k}\\)`, 'g'), variables[k])
          }

          if(oldNode) { // (re)loadCSS
            oldNode.innerHTML = css
          } else {
            let node = document.createElement('style')
            node.id = sanitizedId
            node.innerHTML = css
            document.getElementsByTagName('head')[0].appendChild(node)
          }
        })
      }
    }

    setResizeFactor() {
      $('html', 0).style.fontSize = this.get('style.resize-factor') + 'em'
    }

    attachOverlayStyle() {
      this.attachCSS([
        'css/index.css',
        'css/nav.css'
      ], 'style')
      this.attachCSS('css/table.css', ['style', 'colwidth'])
    }

    get(k) {
      if(!this.config) return false
      if(k) return resolveDotIndex(this.config, k)
      else return this.config
    }

    set(k, v) {
      if(k)
        return resolveDotIndex(this.config, k, v)
      else
        this.config = v
    }

    toggle(k) {
      if(!this.config) return false
      if(typeof this.get(k) !== 'boolean') return false
      this.set(k, !this.get(k))
    }

    reset(key) {
      if(key) {
        this.set(key, resolveDotIndex(CONFIG_DEFAULT, key))
        this.save()
      } else {
        localStorage.setItem('kagerou_config', '')
        this.load()
      }
    }

    save() {
      localStorage.setItem('kagerou_config', JSON.stringify(this.config))
    }

  }

  window.Config = Config
  localStorage.getItem('kagerou_config')

})()
