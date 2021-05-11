'use strict'

const $ = function $(root, selector, index) {
  'This is not actually jQuery, just shortcut for `document.querySelectorAll`.'
  if(arguments.length === 2) {
    index = selector
    selector = root
    root = document
  } else if(arguments.length === 1) {
    selector = root
    root = document
    index = undefined
  }

  if(!root) {
    root = document
  }

  if(/^#[0-9a-z_\-]+?$/.test(selector))
    return root.getElementById(selector.slice(1))
  else if(index || index === 0)
    if(index === 0)
      return root.querySelector(selector)
    else
      return root.querySelectorAll(selector)[index]
  else
    return root.querySelectorAll(selector)
}

const $map = function $map(root, selector, callback) {
  let _$

  switch(arguments.length) {
    case 2: // selector, callback, undefined
      _$ = $(root)
      callback = selector
      break
    case 3: // selector, index, callback
      _$ = $(root, selector, false)
      break
  }

  return [].map.call(_$, callback)
}

const parseSvg = function parseSvg(text) {
  let parser = new DOMParser()
  return parser.parseFromString(text, 'image/svg+xml')
}

const updateObject = function updateObject(obj/*, ... */) {
  for(let i=1; i<arguments.length; i++) {
    for(let prop in arguments[i]) {
      let val = arguments[i][prop]
      if(typeof val == 'object')
        updateObject(obj[prop], val)
      else
        obj[prop] = val
    }
  }
  return obj
}

const resolveDotIndex = function resolveDotIndex(o, p, v) {
  // Example:
  //   o: {a: {b: {c: 1}}}
  //   p: 'a.b.c'
  //   returns: 1
  if(typeof p === 'string')
    return resolveDotIndex(o, p.split('.'), v)
  else if(p.length === 0)
    return o
  else if(p[0] != null && !(p[0] in o))
    return undefined
  else if(p.length === 1 && v !== undefined)
    return o[p[0]] = v
  else
    return resolveDotIndex(o[p[0]], p.slice(1), v)
}

const resolveClass = function resolveJobFromName(_job, _name) {
  _job = _job || ''

  const o = /^(.+?) \((.+?)\)$/.exec(_name)
  if(!o) {
    if(_name === 'Limit Break' || _name === '리미트 브레이크') {
      return ['limit-break', 'Limit Break', false]
    } else {
      return [_job.toLowerCase(), _name, false]
    }
  } else if(_job) {
    return [_job.toLowerCase(), o[1], false]
  } else {
    o[0] = PET_MAPPING[o[1]] || 'chocobo'
    return o
  }
}

const resolveOwner = function resolveOwner(_) {
  let o = /^.+? \((.+?)\)$/.exec(_)
  return o && o[1] || undefined
}

const animateNumber = function animateNumber(element, to, option) {
  if(typeof element === 'string') {
    element = $(element, 0)
  }

  option.timeout = option.timeout || 500

  const from = parseFloat(element.textContent)
  const step = (from - to) / (option.timeout / 20)
  let current = from - step

  let set = function(v) {
    element.textContent = v.toFixed(option.digit || 0)
  }

  let interval = setInterval(function() {
    current -= step
    set(current)
    if(current == to) {
      clearInterval(interval)
    }
  }, 20)

  setTimeout(function() {
    clearInterval(interval)
    set(to)
  }, option.timeout)
}

const isYou = function isYou(name, list) {
  return (name === 'YOU' || Array.isArray(list) && list.indexOf(name) !== -1)
}

document.addEventListener('DOMContentLoaded', function(e) {
  $map('.version', _ => _.textContent = VERSION)
  $map('.codename', _ => _.textContent = CODENAME)
  $map('.description', _ => _.textContent = DESCRIPTION)
})

const pFloat = function parseLocaledFloat(string) {
  if(typeof string !== 'string') return string
  else return parseFloat(string.replace(',', '.'))
}

const pInt = function parseLocaledInteger(string) {
  if(typeof string !== 'string') return string
  else return parseInt(string.replace(/[,.]/g, ''))
}

const ABBREVIATION_SUFFIXES = ['', 'k', 'M', 'G', 'T']

const formatDps = function formatDPSNumberWithSmalls(number, decimals, abbr, type) {
  number = number || 0
  decimals = decimals == null? 2 : +decimals
  type = (type || 'dps') + ' lower'

  const exponential = Math.floor(Math.log10(number))
  const abbrUnit = abbr? Math.max(0, Math.min(4, Math.floor((exponential - 1) / 3))) : 0
  const suffix = ABBREVIATION_SUFFIXES[abbrUnit]
  number /= Math.pow(10, abbrUnit * 3)

  if(typeof number === 'string') {
    number = pFloat(number).toFixed(decimals)
  } else if(typeof number === 'number') {
    number = number.toFixed(decimals)
  } else {
    number = (0).toFixed(decimals)
  }

  if(number >= 1000 || abbrUnit) {
    type += ' with-larger-digits'
  }

  const decimalLength = ((decimals > 0) + decimals)

  let upper, lower, tail
  const upperEndsAt = Math.max(0, number.length - decimalLength - (abbrUnit? 0 : 3))
  const lowerEndsAt = (abbrUnit? 0 : -decimalLength) || undefined

  upper = number.slice(0, upperEndsAt)
  lower = number.slice(upperEndsAt, lowerEndsAt)
  tail = lowerEndsAt? number.slice(lowerEndsAt) : suffix

  const wrappedLower = '<small class="' + type + '">' + lower + '</small>'
  const wrappedTail = '<small>' + tail + '</small>'
  return upper + wrappedLower + (tail? wrappedTail : '')
}

const sanitize = _ => _.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')

class EventEmitter {
  /* Copyright (c) 2011 Jerome Etienne, http://jetienne.com - MIT License */

  constructor() {
    this._events = {}
  }

  on(event, fct) {
    this._events[event] = this._events[event] || []
    this._events[event].push(fct)
  }

  off(event, fct) {
    if(!(event in this._events)) return
    this._events[event].splice(this._events[event].indexOf(fct), 1)
  }

  emit(event/*, args...*/) {
    if(!(event in this._events)) return
    for(let e of this._events[event]) {
      e.apply(this, [].slice.call(arguments, 1))
    }
  }
}
