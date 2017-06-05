import { Component } from 'react';


export class ExtendedComponent extends Component {
  constructor (props) {
    super (props)

    this.unmountEvents = new Set()
    this._mounted = null
  }

  watch (store, name, defaultValue) {
    this.addUnmountEvent(store.register(name, value => {
      this.setState({[name]: value})
    }))

    if (!this._mounted && !this.state) this.state = {}

    const getValue = store.get(name)
    const value = (getValue === undefined) ? defaultValue : getValue

    if (this._mounted) {
      if (this._mounted) this.setState({[name]: value})
    } else {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state[name] = value
    }
  }

  bind (store, names, defaultValues) {
    if (Array.isArray(names)) {
      this.bindMany(store, names, defaultValues)
    } else if (typeof names === 'object') {
      this.bindMany(store, Object.keys(names), names)
    } else {
      this.bindSingle(store, names, defaultValues)
    }
  }

  bindMany (store, names, defaultValues = {}) {
    store.setManyIfUndefined(defaultValues)
    this.addUnmountEvent(store.registerMany(names, values => {
      if (this._mounted) this.setState(values)
    }))

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state = Object.assign(this.state || {}, store.getMany(names))
  }

  bindSingle (store, name, defaultValue) {
    this.addUnmountEvent(store.register(name, value => {
      if (this._mounted) this.setState({[name]: value})
    }))
    if (!this.state) this.state = {}
    const getValue = store.get(name)
    const value = (getValue === undefined) ? defaultValue : getValue

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state[name] = value
  }

  addUnmountEvent (callback) {
    if (typeof callback === 'function') {
      this.unmountEvents.add(callback)
    }
  }

  componentDidMount () {
    this._mounted = true
  }

  componentWillUnmount () {
    this._mounted = false
    this.unmountEvents.forEach(cb => cb())
  }
}

export default ExtendedComponent