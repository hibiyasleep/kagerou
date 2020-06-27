'use strict'

const VERSION = '0.8.4'
const CODENAME = 'tears proof masquerade'
const DESCRIPTION = Date.now() > 15959e8? '偽りなき技巧が挑戦への扉を開く' : 'rest in peace, rt-karen.'

const CONFIG_DEFAULT = {
  lang: 'ko',
  style: {
    // body
    'resize-factor': 1,
    'body-margin': '0.25rem',
    'body-font': "'Lato', 'Source Han Sans', 'Meiryo UI', '맑은 고딕', sans-serif",
    // header / ui
    'nav-opacity': 1,
    'nav-bg': 'rgba(31, 31, 31, 0.9)',
    'nav-fg': '#ddd',
    'header-bg': 'rgba(0, 0, 0, 0.5)',
    'dropdown-bg': 'rgba(31, 31, 31, 0.95)',
    'dropdown-fg': '#ddd',
    'content-bg': '', // URL
    'content-bg-color': 'rgba(0, 0, 0, 0.5)',
    'content-bg-opacity': 1,
    'content-bg-filter': '',
    'content-fg': '#eee',
    'cell-bg': 'rgba(255, 255, 255, 0.1)',
    'my-row-fg': 'rgba(179, 229, 252, 1)',
    'content-align': 'center',
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
      width: 1,
      sort: 'deal.total',
      col: [
        'i.icon',
        'i.name',
        'deal.pct',
        'deal.last60',
        'deal.per_second',
        'etc.death'
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
    '_deal-critical': 2.5,
    '_deal-direct': 2.5,
    '_deal-crit_direct': 2.5,
    '_deal-crittypes': 4,
    '_deal-max': 2.5,
    '_deal-maxhit': 7,
    '_deal-maxskill': 5,
    '_deal-last10': 3.5,
    '_deal-last30': 3.5,
    '_deal-last60': 3.5,
    '_deal-last180': 3.5,
    '_heal-critical': 2,
    '_tank-damage': 4,
    '_tank-heal': 4,
    '_tank-parry': 2,
    '_tank-block': 2,
    '_tank-threat_delta': 3.5,
    '_heal-per_second': 3,
    '_heal-pct': 2,
    '_heal-total': 4,
    '_heal-swing': 2,
    '_heal-over': 2,
    '_heal-cure': 2,
    '_heal-max': 2.5,
    '_heal-maxhit': 7,
    '_heal-maxskill': 4,
    '_etc-powerdrain': 4,
    '_etc-powerheal': 4,
    '_etc-death': 2
  },
  color: {
    'gauge-default': '#444',
    'gauge-opacity': '1',
    pld: 'rgb(21, 28, 100)', // Indigo 900 (B -10%)
    war: 'rgb(153, 23, 23)', // Red 900 (B -10%)
    drk: 'rgb(136, 14, 79)', // Pink 900
    gnb: 'rgb(78, 52, 46)', // Brown 800
    mnk: 'rgb(255, 152, 0)', // Orange 500
    drg: 'rgb(63, 81, 181)', // Indigo 500
    brd: 'rgb(158, 157, 36)', // Lime 800
    nin: 'rgb(211, 47, 47)', // Red 700 // 와! 시바! 진성! 닌자다!
    smn: 'rgb(46, 125, 50)', // Green 800
    blm: 'rgb(126, 87, 194)', // Deep Purple 400
    mch: 'rgb(0, 151, 167)', // Cyan 700
    rdm: 'rgb(233, 30, 99)', // Pink 500
    blu: 'rgb(0, 185, 247)', // Light Blue 500
    dnc: 'rgb(244, 143, 177)', // Pink 200
    sam: 'rgb(255, 202, 40)', // Amber 400
    whm: 'rgb(117, 117, 117)', // Gray 600
    sch: 'rgb(121, 134, 203)', // Indigo 300
    ast: 'rgb(121, 85, 72)', // Brown 500
    'smn-pet': 'rgba(46, 125, 50, 0.5)',
    'sch-pet': 'rgba(121, 134, 203, 0.5)',
    'mch-pet': 'rgba(0, 151, 167, 0.5)',
    'chocobo': '#444',
    'limit-break': '#444'
  },
  format: {
    significant_digit: {
      dps: 0,
      hps: 0,
      accuracy: 0,
      critical: 0
    },
    merge_pet: true,
    myname: [],
    use_short_name: 0,
    use_skill_aliases: true,
    use_tailing_pct: true,
    small_lower_numbers: false
  },
  filter: {
    unusual_spaces: false,
    non_combatant: false,
    jobless: true
  },
  element: {
    'narrow-nav': true,
    'hide-footer': true,
    'use-header-instead': true
  },
  footer: {
    rank: false,
    rdps: true,
    rhps: false
  },
  custom_css: `
/* 여기에 사용자 스타일시트를 작성합니다.
 * CSS가 뭔지 모르시면 무시하셔도 되며, 자세한 구조는 소스 코드를
 * 직접 참조해주세요.
 * var()로 설정값 일부를 가져올 수 있습니다. */

/* Write User-stylesheet here.
 * If you don't know what CSS is, you can ignore this section.
 * For details, please refer source code or DevTools directly.
 * some config value can be loaded by var(). */

/* .gauge { -webkit-filter: blur(0.2rem); } */
`
}

const MIGRATE_MAP = {
  'color.gnb': { if: _ => !_, action: 'default' },
  'color.blu': { if: _ => !_, action: 'default' },
  'color.dnc': { if: _ => !_, action: 'default' }
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
  'crithits', 'damagetaken', 'healstaken',
  'enchps', 'healed', 'healed%',
  'heals', 'critheals', 'cures',
  'powerdrain', 'powerheal',
  'Last10DPS', 'Last30DPS', 'Last60DPS'
]
const COLUMN_USE_LARGER = {
  'MAXHIT': ['MAXHIT', 'maxhit'],
  'MAXHEAL': ['MAXHEAL', 'maxheal']
}

const VALID_PLAYER_JOBS = [
  'GLA', 'GLD', 'MRD', 'PUG', 'PGL', 'LNC', 'ROG', 'ARC', 'THM', 'ACN', 'CNJ',
  'PLD', 'WAR', 'MNK', 'DRG', 'NIN', 'BRD', 'BLM', 'SMN', 'SCH', 'WHM', 'DRK',
  'MCH', 'AST', 'SAM', 'RDM', 'BLU', 'GNB', 'DNC',
  'CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL', 'MIN', 'BTN', 'FSH'
]

const PET_MAPPING = {
  '카벙클 에메랄드': 'acn-pet',
  '카벙클 토파즈': 'acn-pet',
  '카벙클 루비': 'acn-pet',
  '가루다 에기': 'garuda',
  '타이탄 에기': 'titan',
  '이프리트 에기': 'ifrit',
  '요정 에오스': 'eos',
  '요정 셀레네': 'selene',
  '자동포탑 룩': 'rook',
  '자동포탑 비숍': 'bishop',
  'Emerald Carbuncle': 'acn-pet',
  'Topaz Carbuncle': 'acn-pet',
  'Ruby Carbuncle': 'acn-pet',
  'Garuda-Egi': 'garuda',
  'Titan-Egi': 'titan',
  'Ifrit-Egi': 'ifrit',
  'Eos': 'eos',
  'Selene': 'selene',
  'Rook Autoturret': 'rook',
  'Bishop Autoturret': 'bishop',
  'カーバンクル・エメラルド': 'acn-pet',
  'カーバンクル・トパーズ': 'acn-pet',
  'カーバンクル・ルビー': 'acn-pet',
  'ガルーダ・エギ': 'garuda',
  'タイタン・エギ': 'titan',
  'イフリート・エギ': 'ifrit',
  'フェアリー・エオス': 'eos',
  'フェアリー・セレネ': 'selene',
  'オートタレット・ルーク': 'rook',
  'オートタレット・ビショップ': 'bishop',
  '蓝宝石兽': 'acn-pet',
  '黄宝石兽': 'acn-pet',
  '红宝石兽': 'acn-pet',
  '迦楼罗之灵': 'garuda',
  '泰坦之灵': 'titan',
  '伊芙利特之灵': 'ifrit',
  '朝日小仙女': 'eos',
  '夕月小仙女': 'selene',
  '车式浮空炮塔': 'rook',
  '象式浮空炮塔': 'bishop',
  // TODO: add another languages
}

/*
const APRIL_FOOL_CLASS_REMAP = {
  'pld': 'gla', 'gla': 'pld',
  'war': 'mrd', 'mrd': 'war',
  'drk': 'min', 'min': 'drk',
  'mnk': 'pug', 'pug': 'mnk',
  'drg': 'lnc', 'lnc': 'drg',
  'brd': 'arc', 'arc': 'brd',
  'nin': 'rog', 'rog': 'nin',
  'smn': 'arc', 'arc': 'smn',
  'blm': 'thm', 'thm': 'blm',
  'mch': 'bsm', 'bsm': 'mch',
  'whm': 'cnj', 'cnj': 'whm',
  'sch': 'acn', 'acn': 'sch',
  'ast': 'fsh', 'fsh': 'ast',
  'garuda': 'emerald', 'emerald': 'garuda',
  'titan': 'topaz', 'topaz': 'titan',
  'eos': 'emerald',
  'selene': 'topaz',
}
*/

const COLUMN_INDEX = {
  i: {
    icon: {
      v: _ => ' '
    }/* {
      v: _ => resolveClass(_.Job, _.name)[0],
      f: _ => {
        let job = _.toLowerCase()
        if(job === 'gld') job = 'gla'
        /*
        if('IS_APRIL_FOOL' in window
         && IS_APRIL_FOOL === true
         && job in APRIL_FOOL_CLASS_REMAP) {
          job = APRIL_FOOL_CLASS_REMAP[job]
        }
        /
      }
    } */,
    class: {
      v: _ => {
        let job = resolveClass(_.Job, _.name)[0]
        if(job === 'gld') job = 'gla'
        return job
      }
    },
    owner: {
      v: _ => resolveClass(_.Job, _.name)[2],
      f: _ => `<span>${_}</span>`
    },
    name: {
      v: _ => resolveClass(_.Job, _.name)[1],
      f: (_, conf) => {
        let name = _.split(' ')
        let flag = +conf.format.use_short_name
        let you = isYou(_, conf.format.myname)
        if(!you && name.length >= 2) {
          if((flag & 1) && typeof name[0] === 'string') // Firstname
            name[0] = name[0][0] + '.'
          if((flag & 2) && typeof name[1] === 'string') // Lastname
            name[1] = name[1][0] + '.'
        }
        return name.join(' ')
      }
    }
  },
  // deal
  deal: {
    per_second: {
      v: 'encdps',
      f: (_, conf) => {
        _ = pFloat(_)
        if(isNaN(_)) {
          return '---'
        }
        return formatDps(_, +conf.format.significant_digit.dps)
      }
    },
    pct: {
      v: _ => parseInt(_['damage%']),
      f: (_, conf) => {
        if(isNaN(_)) return '---'
        else if(_ >= 100) return '100'
        else return _ + (conf.format.use_tailing_pct? '<small>%</small>' : '')
      }
    },
    total: 'damage',
    failure: {
      v: _ => _.swings > 0? _.misses / _.swings * 100 : -1,
      f: (_, conf) =>
        _ < 0?
          '-' : _.toFixed(conf.format.significant_digit.accuracy) +
          (conf.format.use_tailing_pct? '<small>%</small>' : '')
    },
    accuracy: {
      v: _ => _.swings > 0? (1 - _.misses/_.swings) * 100 : -1,
      f: (_, conf) =>
        _ < 0?
          '-' :  _.toFixed(conf.format.significant_digit.accuracy) +
          (conf.format.use_tailing_pct? '<small>%</small>' : '')
    },
    swing: 'swings',
    miss: 'misses',
    hitfail: 'hitfailed',
    critical: {
      v: _ => (parseInt(_.crithits) || 0) / (parseInt(_.swings) || 1) * 100,
      f: (_, conf) => _.toFixed(conf.format.significant_digit.critical) +
                      (conf.format.use_tailing_pct? '<small>%</small>' : '')
    },
    direct: {
      v: _ => 'DirectHitCount' in _? (parseInt(_.DirectHitCount) || 0) / (parseInt(_.swings) || 1) * 100 : null,
      f: (_, conf) => _ !== null?
        _.toFixed(conf.format.significant_digit.critical) +
        (conf.format.use_tailing_pct? '<small>%</small>' : '') : '-'
    },
    crit_direct: {
      v: _ => 'CritDirectHitCount' in _? (parseInt(_.CritDirectHitCount) || 0) / (parseInt(_.swings) || 1) * 100 : null,
      f: (_, conf) => _ !== null?
        _.toFixed(conf.format.significant_digit.critical) +
        (conf.format.use_tailing_pct? '<small>%</small>' : '') : '-'
    },
    crittypes: {
      v: _ => [_.DirectHitCount || '-', _.crithits || '-', _.CritDirectHitCount || '-'],
      f: _ => _.join('/')
    },
    max: {
      v: 'MAXHIT',
      f: _ => formatDps(_, 0)
    },
    maxhit: {
      v: 'maxhit',
      f: (_, conf) => {
        let map = l.skillname(_, conf.format.use_skill_aliases)
        return `${formatDps(map[1], 0)} <small>${map[0]}</small>`
      }
    },
    maxskill: {
      v: 'maxhit',
      f: (_, conf) => l.skillname(_, conf.format.use_skill_aliases)[0]
    },
    last10: {
      v: 'Last10DPS',
      f: (_, conf) => {
        return isNaN(_)? '0' : formatDps(_, conf.format.significant_digit.dps)
      }
    },
    last30: {
      v: 'Last30DPS',
      f: (_, conf) => {
        return isNaN(_)? '0' : formatDps(_, conf.format.significant_digit.dps)
      }
    },
    last60: {
      v: 'Last60DPS',
      f: (_, conf) => {
        return isNaN(_)? '0' : formatDps(_, conf.format.significant_digit.dps)
      }
    }/*,
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
    block: 'BlockPct',
    threat_delta: 'threatdelta'
  },
  // heal
  heal: {
    per_second: {
      v: 'enchps',
      f: (_, conf) => {
        _ = pFloat(_)
        return isNaN(_)? '0' : formatDps(_, conf.format.significant_digit.hps)
      }
    },
    pct: {
      v: _ => parseInt(_['healed%']),
      f: _ => {
        if(isNaN(_)) return '---'
        else if(_ >= 100) return '100'
        else return _ + '<small>%</small>'
      }
    },
    total: 'healed',
    over: {
      v: _ => _['OverHealPct'],
      f: _ => _ && _.replace? _.replace('%', '<small>%</small>') : '---'
    },
    swing: 'heals',
    critical: {
      v: _ => (parseInt(_.critheals) || 0) / (parseInt(_.heals) || 1) * 100,
      f: (_, conf) => (_).toFixed(conf.format.significant_digit.critical) + (conf.format.use_tailing_pct? '<small>%</small>' : '')
    },
    cure: 'cures',
    max: 'MAXHEALWARD',
    maxhit: {
      v: 'maxhealward',
      f: (_, conf) => l.skillname(_, conf.format.use_skill_aliases).join(': ')
    },
    maxskill: {
      v: 'maxhealward',
      f: (_, conf) => l.skillname(_, conf.format.use_skill_aliases)[0]
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

      if(!o) {
        this.init()
      } else {
        this.config = {}

        for(let k in localConfig) {
          if(CONFIG_KEY_SHOULD_OVERRIDE.indexOf(k) !== -1) {
            if(k === 'tabs' && o[k].length === 0) {
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

    migrate() {
      if(!this.config) { return false }

      Object.keys(MIGRATE_MAP).map(k => {
        let v = this.get(k)
        let cond = MIGRATE_MAP[k]
        if(cond.if(v)) {
          let result
          if(typeof cond.action === 'function') {
            result = cond.action(v)
          } else {
            switch(cond.action) {
              case 'default':
                result = resolveDotIndex(CONFIG_DEFAULT, k)
                break
            }
          }
          this.set(k, result)
        }
      })
    }

    init() {
      let localConfig = copy(CONFIG_DEFAULT)
      this.config = localConfig
      let lang = (navigator.language || '').split('-')[0]
      if(['ko', 'en', 'ja', 'de'].indexOf(lang) !== -1){
        this.set('lang', lang)
      }
      this.save()
    }

    loadStyle(path, section) {
      if(!Array.isArray(path)) {
        path = [path]
      }

      for(let p of path){
        let sanitizedId = p.replace(/[^a-z]/g, '_')

        let xhr = new XMLHttpRequest()
        xhr.open('GET', p, true)
        xhr.onreadystatechange = _ => {
          if(xhr.readyState === 4) {
            if(xhr.status === 200) {
              attachStyle(sanitizedId, section, xhr.responseText)
            }
          }
        }
        xhr.send(null)
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
