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
  else if(index || index == 0)
    if(index == 0)
      return root.querySelector(selector)
    else
      return root.querySelectorAll(selector)[index]
  else
    return root.querySelectorAll(selector)
}

const $map = function $map(root, selector, index, callback) {
  let _$

  switch(arguments.length) {
    case 2:  // index, callback, undefined, undefined
      _$ = $(root)
      callback = selector
      break
    case 3: // selector, index, callback, undefined
      _$ = $(root, selector)
      callback = index
      break
    case 4:
      _$ = $(root, selector, index)
      break
  }

  return [].map.call(_$, callback)
}

const parseSvg = function parseSvg(text) {
  let parser = new DOMParser()
  return parser.parseFromString(text, 'image/svg+xml')
}

const loadSvg = function loadSvg(src, callback) {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', src, true)

  xhr.onreadystatechange = (e) => {
    if(xhr.readyState === 4)
      if(xhr.status === 200)
        callback(null, parseSvg(xhr.responseText))
      else
        callback({
          xhr: xhr,
          event: e
        }, null)
  }

  xhr.send(null)
}

const loadSvgSync = function loadSvgSync(src) {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', src, false)
  xhr.send(null)

  if(req.status === 200)
    return parseSvg(xhr.responseText)
  else return null
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
  if (typeof p === 'string')
    return resolveDotIndex(o, p.split('.'), v);
  else if (p.length === 1 && v !== undefined)
    return o[p[0]] = v;
  else if (p.length==0)
    return o
  else
    return resolveDotIndex(o[p[0]], p.slice(1), v);
}

const _in = (key, array) => array.indexOf(key) > -1

const resolveClass = function resolveJobFromName(_job, _name) {
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

const displayVersionNumber = function displayVersionNumber(dom) {
  [].map.call(dom, _ => _.textContent = VERSION)
}

document.addEventListener('DOMContentLoaded', function(e) {
  displayVersionNumber($('.version'))
})
