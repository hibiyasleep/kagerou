'use strict'

const $ = function $(selector, index) {
  'This is not actually jQuery, just shortcut for `document.querySelectorAll`.'
  if(/^#[0-9a-z_\-]+?$/.test(selector))
    return document.getElementById(selector.slice(1))
  else if(index != undefined)
    if(index == 0)
      return document.querySelector(selector)
    else
      return document.querySelectorAll(selector)[index]
  else
    return document.querySelectorAll(selector)
}

const $map = function $map(selector, index, callback) {
  if(index !== undefined && callback == undefined) {
    callback = index
    index = undefined
  }
  return [].map.call($(selector, index), callback)
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
      return [_job, _name, ''] // <- TODO: localized classname at [2]
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

const displayVersionNumber = function displayVersionNumber(dom) {
  [].map.call(dom, _ => _.textContent = VERSION)
}

document.addEventListener('DOMContentLoaded', function(e) {
  displayVersionNumber($('.version'))
})
