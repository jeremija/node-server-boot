const server = require('./app')

const port = process.argv[2]
server.listen(port, () => {
  console.log('listening on', port)
})
