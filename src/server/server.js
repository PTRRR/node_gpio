// Save the IP address in an external file accessible from the clien when the server is launched
//
const ip = require('ip')
var fs = require('fs')
fs.writeFile('IP.js', `/* eslint-disable */\nfunction IP () { return '${ip.address()}' }`, function(err) {
  if(err) {
    // eslint-disable-next-line
    return console.error(err)
  }
  // eslint-disable-next-line
  console.log('The file was saved!')
})

// Initialize the server
//
const server = require('http').createServer()
const io = require('socket.io')(server)
const clients = []
io.on('connection', function (socket) {
  // Listen for connections and send back a confirmation
  //
  socket.on('client-connection', data => {
    const content = JSON.parse(data)
    clients.push({
      name: content.name,
      socket
    })
    socket.send(JSON.stringify({
      type: 'connection-established',
      message: 'ok'
    }))
  })
  // Listen for messages and dispatch them to corresponding targets
  //
  socket.on('message', data => {
    const content = JSON.parse(data)
    // Create a dispatch message
    //
    const msg = {
      type: content.type,
      message: content.message,
      origin: getClientBySocket(socket).name
    }
    // Send this message to all sockets that have the specified target name
    //
    const targets = getTargetClients(content.target)
    if (targets.length > 0) {
      for (const target of targets) {
        target.socket.send(JSON.stringify(msg))
      }
    } else {
      socket.send(JSON.stringify({
        type: 'server-warning',
        msg: `No target client called: "${content.target}" was found.`
      }))
    }
  })
  // Check for disconnections
  //
  socket.on('disconnect', () => {
  })
})
server.listen(1334)

// Utils
//
const getClientBySocket = socket => {
  for(const client of clients) {
    if (client.socket === socket) {
      return client
    }
  }
}

const getTargetClients = target => {
  const targets = []
  for(const client of clients) {
    if (client.name === target || target === '*') {
      targets.push(client)
    }
  }
  return targets
}