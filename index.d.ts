import { Server } from 'http'

type Port = number | string

type Callback = (...args: any[]) => any

interface Listenable {
  listen (port: Port, bind: string, cb: Callback): Server
}

declare class Boot {
  constructor (server: Listenable)
  startServer (port: Port, bind?: string): Promise<Server>
  start (port: Port, bind?: string): Promise<Server>
}

declare namespace Boot {}

export = Boot
