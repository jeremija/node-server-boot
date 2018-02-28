declare module 'server-boot' {
  type Port = number | string

  type Callback = (any) => any

  interface Server {
    listen (Port, string, Callback)
  }

  class Boot<T extends Server> {
    constructor (server: T)
    startServer (port: Port, bind?: string): Promise<T>
    start (port: Port, bind?: string): Promise<T>
  }

  namespace Boot {}

  export = Boot
}
