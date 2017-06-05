const concat = (x,y) => x.concat(y)

export class Store {
  constructor (initialState = {}) {
    this.listeners = {}
    this.data = Object.assign({}, initialState)
  }

  register (name, callback) {
    if (Array.isArray(name)) {
      return this.registerMany(name, callback)
    } else {
      return this.registerSingle(name, callback)
    }
  }

  registerSingle (name, callback) {
    if (typeof callback !== 'function') throw new Error('callback must be a function')
    if (!this.listeners[name]) this.listeners[name] = new Set()

    callback.valueName = name
    this.listeners[name].add(callback)
    return () => this.listeners[name].delete(callback)
  }

  registerMany (names, callback) {
    if (typeof callback !== 'function') throw new Error('callback must be a function')

    callback.valueNames = names
    names.forEach(name => {
      if (!this.listeners[name]) this.listeners[name] = new Set()
      this.listeners[name].add(callback)
    })
    return () => names.forEach(name => {
      this.listeners[name].delete(callback)
    })
  }

  get (name) {
    return this.data[name]
  }

  getMany (names) {
    const res = {}
    names.forEach(name => res[name] = this.data[name])
    return res
  }

  set (...args) {
    if (typeof args[0] !== 'string') {
      this.setMany(...args)
    } else {
      this.setOne(...args)
    }
  }

  setOne (name, value, done) {
    this.data[name] = value
      this.listeners[name] && this.listeners[name].forEach(cb => {
        if (cb.valueName) cb(value)
        else if (cb.valueNames) cb({[name]: value})
        else cb(value)
      })
      if (typeof done === 'function') done()
  }

  setManyIfUndefined (values, done) {
    const valuesClone = Object.assign({}, values)
    Object.keys(valuesClone).forEach(k => {
      if (this.data[k] !== undefined) {
        delete valuesClone[k]
      }
    })
    return this.setMany(valuesClone, done)
  }

  setMany (values, done) {
    return new Promise((resolve, reject) => {
      const callbacks = new Set(Object.keys(values).map(k => {
        this.data[k] = values[k]
        return this.listeners[k]
      }).filter(x => x).reduce((p, c) => concat(p, [...c]), []))

      callbacks.forEach(cb => {
        if (cb.valueName) cb(values[cb.valueName])
        else if (cb.valueNames) {
          const res = {}
          cb.valueNames.forEach(name => {
            if (values[name] !== undefined) {
              res[name] = values[name]
            }
          })
          cb(res)
        }
        else cb(values)
      })
      if (typeof done === 'function') done()
      resolve()
    })
  }
}