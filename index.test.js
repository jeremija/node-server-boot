const Boot = require('./index')
const { spawn } = require('child_process')
const app = require('./app')
const fs = require('fs')


const PORT = 3005
const SOCKET = 'unix.socket'


describe('Boot', () => {

  function startServer (port) {
    return new Promise((resolve, reject) => {
      const process = spawn('node', ['server.js', String(port)])
      process.stdout.once('data', data => {
        data = data.toString()
        if (data.startsWith('listening')) {
          return resolve(process)
        }
        reject(new Error('Unexpected stdout: ' + data))
      })
      process.stderr.on('data', data => {
        reject(new Error('Unexpected stderr: ' + data.toString()))
      })
    })
  }

  function killServer (server, signal = 'SIGKILL') {
    return new Promise((resolve) => {
      server.on('close', resolve)
      server.kill(signal)
    })
  }

  describe('numeric port in use', () => {

    let server
    beforeEach(() => {
      return startServer(PORT)
      .then(s => server = s)
    })

    afterEach(() => killServer(server))

    it('does not start the server when the port is alrady in use', done => {
      new Boot(app).start(PORT)
      .catch(err => {
        expect(err.message).toEqual('Port ' + PORT + ' is already in use!')
        done()
      })
    })

  })

  describe('numeric port - normal startup', () => {

    let server
    afterEach(() => {
      return server && new Promise(resolve => {
        server.close(() => resolve())
      })
    })

    it('starts normally when the port is not in use', () => {
      return new Boot(app).start(PORT)
      .then(s => server = s)
    })

  })

  describe('unix socket - normal startup', () => {

    it('starts normally when unix socket is not in use', () => {
      return new Boot(app).start(SOCKET)
      .then(server => {
        return new Promise(resolve => {
          server.close(() => resolve())
        })
      })
    })

  })

  describe('unix socket - in use', () => {

    let server
    beforeEach(() => {
      return startServer(SOCKET)
      .then(s => server = s)
    })

    afterEach(() => {
      fs.unlinkSync(SOCKET)
      return killServer(server)
    })

    it('does not start the server when the port is alrady in use', done => {
      new Boot(app).start(SOCKET)
      .catch(err => {
        expect(err.message).toEqual(
          'Another server instance is using the unix socket: ' + SOCKET)
        done()
      })
    })

  })


  describe('unix socket - unlink', () => {

    let server
    beforeEach(() => {
      return startServer(SOCKET)
      .then(server => killServer(server))
    })

    it('should start the application even if dead unix socket exists', () => {
      expect(fs.existsSync(SOCKET)).toBeTruthy()
      new Boot(app).start(SOCKET)
      .then(server => {
        return new Promise(resolve => {
          server.close(() => resolve())
        })
      })
    })

  })

  describe('unix socket - fails when it\'s a regular file', () => {

    const FILE = 'test-file'
    beforeEach(() => {
      fs.writeFileSync(FILE, 'test')
    })

    afterEach(() => {
      fs.unlinkSync(FILE)
    })

    it('should complain about a file', done => {
      new Boot(app).start(FILE)
      .catch(err => {
        expect(err.code).toEqual('ENOTSOCK')
        done()
      })
    })

  })

  describe('other errors', () => {

    it('handles other errors', done => {
      new Boot(app).start(99999999)
      .catch(err => {
        expect(err.message).toMatch(/65536/)
        done()
      })
    })

  })

})
