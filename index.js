// const debug = require('debug')('server-boot')
const { Socket } = require('net')
const fs = require('fs')

class Boot {
  constructor (server) {
    this.server = server
  }

  startServer (port, bind = undefined) {
    const { server, logger } = this
    return new Promise((resolve, reject) => {
      const instance = server.listen(port, bind, () => {
        resolve(instance)
      })
      instance.on('error', err => {
        reject(err)
      })
    })
  }

  connectToUnixSocket (path) {
    return new Promise((resolve, reject) => {

      if (!isNaN(parseInt(path, 10))) {
        reject(new Error('Port ' + path + ' is already in use!'))
        return
      }

      const socket = new Socket()
      socket.on('error', (err) => {
        reject(err)
      })
      socket.connect({ path }, () => {
        socket.destroy()
        resolve()
      })
    })
  }

  start (port, bind) {
    return this.startServer(port, bind)
    .catch(err => {
      if (err.code !== 'EADDRINUSE') {
        throw err
      }

      return this.connectToUnixSocket(port)
      .then(() => {
        throw new Error(
          'Another server instance is using the unix socket: ' + port
        )
      })
      .catch(err => {
        if (err.code !== 'ECONNREFUSED') {
          throw err
        }
        fs.unlinkSync(port)
        return this.startServer(port, bind)
      })
    })
  }
}

module.exports = Boot
