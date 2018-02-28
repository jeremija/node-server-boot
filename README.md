# Server-Boot [![Build Status](https://travis-ci.org/jeremija/node-server-boot.svg?branch=master)](https://travis-ci.org/jeremija/node-server-boot)

# Usage:

```javascript
const Boot = require('server-boot')

new Boot(app).start(port)
.then(server => {
  console.log('started')
})
.catch(err => {
  console.log(err.message)
  process.exit(1)
})
```
