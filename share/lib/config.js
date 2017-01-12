'use strict'

const VERSION = '0.5.4-pre'

const CONFIG_DEFAULT = {
  lang: 'ko',
  style: {
    // body
    'resize-factor': 1,
    'body-margin': '0.25rem',
    'body-font': "'Roboto', 'Source Han Sans', 'MalgunGotinc', '본고딕', '맑은 고딕', sans-serif",
    // header / ui
    'nav-opacity': 1,
    'nav-bg': 'rgba(31, 31, 31, 0.9)',
    'nav-fg': '#ddd',
    'header-bg': 'rgba(0, 0, 0, 0.5)',
    'dropdown-bg': 'rgba(31, 31, 31, 0.95)',
    'dropdown-fg': '#ddd',
    'content-bg': 'rgba(0, 0, 0, 0.5)',
    'content-fg': '#eee',
    'color-accent': '#26c6da',
    'shadow-card': '0 0.05rem 0.25rem rgba(0, 0, 0, 0.5)',
    'shadow-text': '0 0 0.125em rgba(0, 0, 0, 1)',
    'font-size-small': '0.75rem',
    'gauge-height': '10%',
    'graph-height': '1.5rem'
  },
  tabs: [
    {
      id: 0,
      label: 'DPS',
      gauge: 'deal.total',
      sort: 'deal.total',
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
      id: 1,
      label: 'Tank',
      gauge: 'tank.damage',
      sort: 'tank.damage',
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
      id: 2,
      label: 'Heal',
      gauge: 'heal.total',
      sort: 'heal.total',
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
    '_i-class': 2,
    '_i-owner': 6,
    '_i-name': 6,
    '_deal-total': 4.5,
    '_deal-per_second': 3.5,
    '_deal-pct': 2,
    '_deal-failure': 3,
    '_deal-accuracy': 3,
    '_deal-swing': 2.5,
    '_deal-miss': 2.5,
    '_deal-hitfail': 2.5,
    '_deal-critical': 2,
    '_deal-max': 2.5,
    '_deal-maxhit': 6,
    '_deal-last10': 3.5,
    '_deal-last30': 3.5,
    '_deal-last60': 3.5,
    '_deal-last180': 3.5,
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
    '_heal-max': 2.5,
    '_heal-maxhit': 6,
    '_etc-powerdrain': 4,
    '_etc-powerheal': 4,
    '_etc-death': 2
  },
  color: {
    'gauge-default': '#444',
    'gauge-opacity': '1',
    'position-tank': 'rgb(33, 150, 243)',
    'position-deal': 'rgb(244, 67, 54)',
    'position-heal': 'rgb(139, 195, 74)',
    pld: 'rgb(21, 28, 100)', // Indigo 900 (B -10%)
    war: 'rgb(153, 23, 23)', // Red 900 (B -10%)
    drk: 'rgb(136, 14, 79)', // Pink 900
    mnk: 'rgb(255, 152, 0)', // Orange 500
    drg: 'rgb(63, 81, 181)', // Indigo 500
    brd: 'rgb(158, 157, 36)', // Lime 800
    nin: 'rgb(211, 47, 47)', // Red 700
    smn: 'rgb(46, 125, 50)', // Green 800
    blm: 'rgb(126, 87, 194)', // Deep Purple 400
    mch: 'rgb(0, 151, 167)', // Cyan 700
    whm: 'rgb(117, 117, 117)', // Gray 600
    sch: 'rgb(121, 134, 203)', // Indigo 300
    ast: 'rgb(121, 85, 72)', // Brown 500
    'limit-break': '',
    'smn-pet': 'rgba(46, 125, 50, 0.5)',
    'sch-pet': 'rgba(121, 134, 203, 0.5)',
    'mch-pet': 'rgba(0, 151, 167, 0.5)',
    'chocobo': '#444',
    'limit-break': '#444'
  },
  format: {
    significant_digit: {
      dps: 2,
      hps: 2,
      accuracy: 2
    },
    merge_pet: true,
    myname: [],
    use_short_name: false
  },
  filter: {
    unusual_spaces: false,
    non_combatant: false,
    jobless: true
  },
  footer: {
    rank: true,
    rdps: true,
    rhps: false,
    recover: false
  },
  custom_css: `
/* 사용자 스타일시트를 작성합니다.
 * CSS가 뭔지 모르시면 무시하셔도 되며, 자세한 구조는 소스 코드를
 * 직접 참조해주세요.
 * var()로 설정값 일부를 가져올 수 있습니다. */

/* Writing User-stylesheet.
 * If you don't know what CSS is, you can ignore this section.
 * For details, please refer source code or DevTools directly.
 * some config value can be loaded by var(). */

/* .gauge { -webkit-filter: blur(0.2rem); } */
`
}

const CONFIG_KEY_SHOULD_OVERRIDE = [
  'tabs'
]

const CONFIG_KEY_SHOULDNT_EXPORTED = [
  'style.resize-factor',
  'style.nav-opacity'
]

const COLUMN_SORTABLE = [
  'deal.per_second',
  'deal.total',
  'tank.damage',
  'tank.heal',
  'heal.per_second',
  'heal.total'
]
const COLUMN_MERGEABLE = [
  'encdps', 'damage', 'damage%',
  'swings', 'misses', 'hitfailed',
  'crithit', 'damagetaken', 'healstaken',
  'enchps', 'healed', 'healed%',
  'heals', 'critheal', 'cures',
  'powerdrain', 'powerheal',
  'Last10DPS', 'Last30DPS', 'Last60DPS'
]
const COLUMN_USE_LARGER = {
  'MAXHIT': ['MAXHIT', 'maxhit'],
  'MAXHEAL': ['MAXHEAL', 'maxheal']
}

const PET_MAPPING = {
  // acn, smn
  '카벙클 에메랄드': 'emerald',
  'Emerald Carbuncle': 'emerald',
  '카벙클 토파즈': 'topaz',
  'Topaz Carbuncle': 'topaz',
  '가루다 에기': 'garuda',
  'Garuda-Egi': 'garuda',
  '타이탄 에기': 'titan',
  'Titan-Egi': 'titan',
  '이프리트 에기': 'ifrit',
  'Ifrit-Egi': 'ifrit',
  // sch
  '요정 에오스': 'eos',
  'Eos': 'eos',
  '요정 셀레네': 'selene',
  'Selene': 'selene',
  // mch
  '자동포탑 룩': 'look',
  'Look Autoturret': 'look',
  '자동포탑 비숍': 'bishop',
  'Bishop Autoturret': 'bishop'
}

const COLUMN_INDEX = {
  i: {
    icon: {
      v: _ => resolveClass(_.Job, _.name)[0],
      f: _ => `<img src="../share/img/class/${_.toLowerCase() || 'empty'}.png" class="clsicon" />`
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
      f: (_, conf) => {
        let text
        if(conf.format.use_short_name && _ !== 'YOU')
          text = _.split(' ').reduceRight((p, c) => p = c[0] + '. ' + p)
        else
          text = _
        return `<span class="${_ === 'YOU'? 'name-you' : ''}">${text}</span>`
      }
    }
  },
  // deal
  deal: {
    per_second: {
      v: 'encdps',
      f: (_, conf) => {
        _ = parseFloat(_)
        return isNaN(_)? '0' : _.toFixed(conf.format.significant_digit.dps)
      }
    },
    pct: {
      v: _ => parseFloat(_['damage%']),
      f: _ => {
        if(isNaN(_)) return '---'
        else if(_ >= 100) return '100'
        else return _ + '%'
      }
    },
    total: 'damage',
    failure: {
      v: _ => _.swings > 0? _.misses/_.swings * 100 : -1,
      f: (_, conf) => _ < 0? '-' :  _.toFixed(conf.format.significant_digit.accuracy)
    },
    accuracy: {
      v: _ => _.swings > 0? (1 - _.misses/_.swings) * 100 : -1,
      f: (_, conf) => _ < 0? '-' :  _.toFixed(conf.format.significant_digit.accuracy)
    },
    swing: 'swings',
    miss: 'misses',
    hitfail: 'hitfailed',
    critical: 'crithit%',
    max: 'MAXHIT',
    maxhit: {
      v: 'maxhit',
      f: _ => l.skillname(_)
    },
    last10: 'Last10DPS',
    last30: 'Last30DPS',
    last60: 'Last60DPS'/*,
    last180: {
      v: _ => 'Last180DPS' in _? _.Last180 : NaN
    }*/
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
      f: (_, conf) => {
        _ = parseFloat(_)
        return isNaN(_)? '0' : _.toFixed(conf.format.significant_digit.hps)
      }
    },
    pct: {
      v: _ => parseFloat(_['healed%']),
      f: _ => {
        if(isNaN(_)) return '---'
        else if(_ >= 100) return '100'
        else return _ + '%'
      }
    },
    total: 'healed',
    over: 'OverHealPct',
    swing: 'heals',
    critical: 'critheal%',
    cure: 'cures',
    max: 'MAXHEALWARD',
    maxhit: {
      v: 'maxhealward',
      f: _ => l.skillname(_)
    }
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

  const attachStyle = function attachStyle(id, section, css) {
    let variables = []
    if(!css) {
      css = ''
    }

    if(section) {
      if(!Array.isArray(section)) {
        section = [section]
      }
      section = section.map(_ => config.config[_])

      variables = Object.assign.apply(null, [variables].concat(section))
    }

    for(let k in variables) {
      let v = variables[k]? variables[k] : 'none'
      css = css.replace(new RegExp(`var\\(--${k}\\)`, 'g'), variables[k])
    }

    let oldNode = document.getElementById(id)

    if(oldNode) { // (re)loadCSS
      oldNode.innerHTML = css
    } else {
      let node = document.createElement('style')
      node.id = id
      node.innerHTML = css
      document.getElementsByTagName('head')[0].appendChild(node)
    }
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
        this.config = {}

        for(let k in localConfig) {
          if(CONFIG_KEY_SHOULD_OVERRIDE.indexOf(k) != -1) {
            if(k == 'tabs' && o[k].length == 0) {
              this.config[k] = localConfig[k]
            } else {
              this.config[k] = o[k]
            }
          } else if(typeof localConfig[k] !== 'object') {
            this.config[k] = o[k]
          } else {
            this.config[k] = updateObject(localConfig[k], o[k])
          }
        }
      }

      return this.config
    }

    loadStyle(path, section) {
      let variables = copy(this.config.style)


      if(!Array.isArray(path)) {
        path = [path]
      }

      for(let p of path){
        let sanitizedId = p.replace(/[^a-z]/g, '_')

        fetch(p).then(res => {
          if(!res.ok) return ''
          return res.text()
        }).then(css => {
          attachStyle(sanitizedId, section, css)
        })
      }
    }

    setResizeFactor() {
      $('html', 0).style.fontSize = this.get('style.resize-factor') + 'em'
    }

    attachOverlayStyle() {
      this.loadStyle([
        'css/index.css',
        'css/nav.css'
      ], 'style')
      this.loadStyle('css/table.css', ['style', 'colwidth', 'color'])

      attachStyle(
        'custom_css',
        ['style', 'colwidth', 'color'],
        config.get('custom_css') || ''
      )

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

    update(k, v) {
      if(k === 'tabs') {
        this.config.tabs = v
      } else {
        updateObject(this.config[k], v)
      }
    }

    toggle(k) {
      if(!this.config) return false

      let v = this.get(k)
      if(typeof v !== 'boolean') return false
      this.set(k, !v)
      return !v
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
