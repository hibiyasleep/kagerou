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

  let o = /^(.+?) \((.+?)\)$/.exec(_name)
  if(!o) {
    if(_name === 'Limit Break' || _name === '리미트 브레이크') {
      return ['limit break', 'Limit Break', '']
    } else {
      return [_job.toLowerCase(), _name, '']
    }
  }

  let name = o[1]
  let owner = o[2]

  // TODO: make this localizable again
  return [PET_MAPPING[name] || 'chocobo', name, owner]
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
})

const pFloat = function parseLocaledFloat(string) {
  if(typeof string !== 'string') return string
  else return parseFloat(string.replace(',', '.'))
}

const pInt = function parseLocaledInteger(string) {
  if(typeof string !== 'string') return string
  else return parseInt(string.replace(/[,.]/g, ''))
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
    this._events[event].forEach(_ => _.apply(this, [].slice.call(arguments, 1)))
  }
}
