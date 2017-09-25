'use strict'

;(function() {

  const resolveSockURI = function() {
    let o = /[?&]HOST_PORT=(wss?:\/\/[^&\/]+)/.exec(location.search)
    return o && o[1]
  }

  const RECONNECT_TIMEOUT = 2000
  const RECONNECT_RETRY = 5

  const WS_REQUEST_COMMAND = {
    'end': 'RequestEnd',
    'capture': 'Capture'
  }

  class Layer extends EventEmitter {
    constructor() {
      super()

      this.type = false
      this.features = []
      this.status = {}

      window.addEventListener('message', e => {
        this.emit('message', {
          type: 'window',
          message: e.data
        })
      })
    }
    supports(feature) {
      return this.features.indexOf(feature) !== -1
    }
    connect() { return true }
    request(feature) { return false }
  }

  class WSLayer extends Layer {

    constructor() {
      super()

      this.type = 'ws'
      this.features = ['end', 'capture']

      this.uri = resolveSockURI()

      if(this.uri === 'ws://:10501') {
        this.uri = 'ws://localhost:10501'
      }
      this.uri += '/MiniParse'

      this.canRetry = RECONNECT_RETRY
      this.retryTimeout = null
      this._overlayid = ''

      window.addEventListener('message', e => {
        this.emit('message', e.data)
      })
    }

    connect() {
      if(!this.uri) return false
      this.ws = new WebSocket(this.uri)

      this.ws.onmessage = e => {
        this.canRetry = RECONNECT_RETRY
        this._onmessage(e)
      }
      this.ws.onerror = e => {
        this.ws.close()
        console.error(e)
      }
      this.ws.onclose = e => {
        if(!this.canRetry) return
        this.emit('closed', {
          code: e.code,
          reconnecting: this.canRetry--
        })
        this.retryTimeout = setTimeout(_ => {
          this.connect()
        }, 2000)
      }

    }

    request(feature) {
      if(!(feature in WS_REQUEST_COMMAND)) {
        return false
      }
      if('overlayWindowId' in window && this._overlayid !== overlayWindowId) {
        this._overlayid = window.overlayWindowId
        this._send({ // WHY THE FUCK
          type: 'set_id',
          id: this._overlayid
        })
      }
      this._send({
        type: 'overlayAPI',
        to: this._overlayid,
        msgtype: WS_REQUEST_COMMAND[feature],
        msg: undefined
      })
    }

    _send(m) {
      if(this.ws.readyState === 1) {
        if(typeof m === 'string') {
          this.ws.send(m)
        } else {
          this.ws.send(JSON.stringify(m))
        }
        return true
      } else return false
    }

    _onmessage(e) {
      if(e.data === '.') {
        this._send('.') // pong!
        return
      }

      let d

      try {
        d = JSON.parse(e.data)
      } catch(err) {
        console.error(err, e.data)
        return
      }

      if(d.type === 'broadcast') {

        switch(d.msgtype) {
          case 'broadcast':
            this.emit('message', {
              type: 'broadcast',
              from: d.from,
              message: d.msg
            })
            break

          case 'CombatData':
            this.emit('data', d.msg)
            break

        }
      } else if(d.type === 'send') {
        this.emit('message', {
          type: 'single',
          from: d.from,
          message: d.msg
        })
      } else if(d.type === 'set_id') {
        this._overlayid = d.id
      }

    }

  }

  class LegacyLayer extends Layer {

    constructor() {
      super()
      this.type = 'legacy'
      this.connected = false
      this.features = []

      this.status.locked = false
      if(window.OverlayPluginApi && window.OverlayPluginApi.endEncounter) {
        this.features.push('end')
      }
    }

    connect() {
      if(this.connected) return
      document.addEventListener('onOverlayDataUpdate', e => {
        this.emit('data', e.detail)
      })
      document.addEventListener('onOverlayStateUpdate', e => {
        this.status.locked = e.detail.isLocked
        this.emit('status', {
          type: 'lock',
          message: e.detail.isLocked
        })
      })
      document.addEventListener('onBroadcastMessageReceive', e => {
        this.emit('message', {
          type: 'broadcast',
          message: e.detail.message
        })
      })
      document.addEventListener('onRecvMessage', e => {
        this.emit('message', {
          type: 'single',
          message: e.detail.message
        })
      })
      document.addEventListener('onLogLine', e => {
        let d = e.detail
        if(d.opcode !== undefined) {
          if(d.opcode !== 56) {
            this.emit('logline', {
              type: 'logline',
              opcode: d.opcode,
              timestamp: d.timestamp,
              payload: d.payload
            })
          } else {
            this.emit('echo', d.payload[3])
          }
        } else {
          this.emit('echo', d.message)
        }
      })
      this.connected = true
    }

    request(feature) {
      if(feature === 'end'
      && 'OverlayPluginApi' in window
      && 'endEncounter' in window.OverlayPluginApi) {
        window.OverlayPluginApi.endEncounter()
        return true
      }
      return false
    }
  }

  window.WSLayer = WSLayer
  window.LegacyLayer = LegacyLayer

  if(resolveSockURI()) {
    window.layer = new WSLayer()
  } else {
    window.layer = new LegacyLayer()
  }

})()
