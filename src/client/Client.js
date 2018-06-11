const io = require('socket.io-client')
const port = 1334

export default class Client {
  constructor (name) {
    if (!name) {
      // eslint-disable-next-line
      console.error('CLIENT ERROR: You must specify a client name.\nEx: var client = new Client("client-name")')
      return
    }
    if (!window.IP) {
      // eslint-disable-next-line
      console.error('CLIENT ERROR: No IP address is defined.\n\nBe sure to include "<script src="socket/IP.js"></script>" in your head.\n\nIf still not working, relaunch the server.')
      return
    }
    this.name = name
    this.clientID = undefined
    this.onConnectCallback = null
    this.onMessageCallback = null
    this.onDisconnectCallback = null

    // Initialize socket connection
    //
    this.socket = io(`${window.IP()}:${port}`)
    this.socket.on('connect', () => {
      // Send a connection request
      //
      this.socket.emit('client-connection', JSON.stringify({
        name: this.name
      }))
      // Handle some events & connections messages
      //
      this.socket.on('message', msg => {
        const parsedMsg = JSON.parse(msg)
        switch (parsedMsg.type) {
        case 'connection-established':
          // eslint-disable-next-line
          console.log(`\n*********\nCONNECTION ESTABLISHED\n*********\n${this.name} connected on: ${window.IP()}:${port}`)
          if (this.onConnectCallback) {
            this.onConnectCallback(parsedMsg)
          }
          break
        case 'server-error':
          // eslint-disable-next-line
          console.error(`SERVER ERROR: ${parsedMsg.msg}`)
          break
        case 'server-warning':
          // eslint-disable-next-line
          console.warn(`SERVER WARNING: ${parsedMsg.msg}`)
          break
        default:
          if (this.onMessageCallback) {
            this.onMessageCallback(parsedMsg)
          }
          break
        }
      })
      this.socket.on('disconnect', msg => {
        if (this.onDisconnectCallback) {
          this.onDisconnectCallback(msg)
        }
      })
    })
  }

  send (target, type, message) {
    this.socket.send(JSON.stringify({
      target,
      type,
      message
    }))
  }

  onConnect (callback) {
    this.onConnectCallback = callback
  }

  onMessage (callback) {
    if (callback) {
      this.onMessageCallback = callback
    }
  }

  onDisconnect (callback) {
    this.onDisconnectCallback = callback
  }
}

// Export the client in the window
//
window.Client = Client