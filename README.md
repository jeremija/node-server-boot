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
