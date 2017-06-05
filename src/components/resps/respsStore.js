const data = {
  events: [],
  listeners: {}
}

export const respsStore = {
  register (name, callback) {
    if (!data.listeners[name]) data.listeners[name] = []

    data.listeners[name].push(callback)

    return () => {
      if (data.listeners[name].includes(callback)) {
        data.listeners[name].splice(data.listeners[name].indexOf(callback), 1)
     }
    }
  },

  get (name) {
    return data[name]
  },

  set (name, value) {
    data[name] = value
    data.listeners[name] && data.listeners[name].forEach(cb => cb(value))
  },

  setEditingById (id) {
    const editing = data.events && data.events.find(x => x.id === id)
    this.set('editing', editing)
  },

  loadResps () {
    fetch('https://lists.codeite.aq/list/~/resps/', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(events => {
      data.events = Object.keys(events).map(id => ({id, ...events[id]}))
      //data.listeners.events && data.listeners.events.forEach(cb => cb(data.events))
      this.set('events', data.events)
    })
  }


}

respsStore.loadResps()
