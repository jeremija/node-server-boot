import { Server } from 'http'

declare module 'server-boot' {
  type Port = number | string

  type Callback = (any) => any

  interface Listenable {
    listen (Port, string, Callback)
  }

  class Boot {
    constructor (server: Listenable)
    startServer (port: Port, bind?: string): Promise<Server>
    start (port: Port, bind?: string): Promise<Server>
  }

  namespace Boot {}

  export = Boot
}
