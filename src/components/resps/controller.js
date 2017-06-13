import moment from 'moment'
import uuid from 'uuid'

import {toRange, toArray} from './number-range'

export class RespsController {
  constructor (api, respsStore, tabStore) {
    this.api = api
    this.respsStore = respsStore
    this.tabStore = tabStore
  }

  setDone = (checked, eventIdSeq) => {
    const [id, seqStr] = eventIdSeq.split('_')
    const seq = Number(seqStr)

    return this.api.loadResp(id)
      .then (event => {
        const existing = new Set(toArray(event.complete))

        if (checked) existing.add(seq)
        else existing.delete(seq)

        const complete = toRange([...existing])
        const args = {id, complete}
        return this.api.saveEditing(args).then(() => args)
      })
      .then(({id, complete}) => {
        const oldEvents = this.respsStore.get('events')
        const event = {...oldEvents.find(x => x.id === id), complete}
        const events = [event, ...oldEvents.filter(x => x.id !== id)]
        this.respsStore.set({events})
      })
  }

  editEvent = (eventId) => {
    this.tabStore.set({
      selectedTabId: 'editTab',
      editTabText: 'Edit'
    })
    const events = this.respsStore.get('events')
    const editing = events && events.find(x => x.id === eventId)
    this.respsStore.set({editing})
  }

  cancelEditing = () => {
    this.tabStore.set({
      selectedTabId: 'List',
      editTabText: null
    })
    this.respsStore.set({editing: null})
  }

  addNewEvent = () => {
    this.tabStore.set({
      selectedTabId: 'editTab',
      editTabText: 'Add'
    })
    this.respsStore.set({
      editing: {
        name: 'new',
        schedule: `R/${moment().format('YYYY-MM-DD')}/P1M`
      }
    })
  }

  saveEditing = event => {
    this.tabStore.set({working: true})

    this.api.saveEditing(event)
      .then(() => {
        const oldEvents = this.respsStore.get('events')
        const events = [event, ...oldEvents.filter(x => x.id !== event.id)]

        this.respsStore.set({events})
        this.tabStore.set({
          selectedTabId: 'List',
          editTabText: null,
          working: false
        })
      })
  }

  addEditing = event => {
    this.tabStore.set({working: true})

    event.id = uuid()

    this.api.saveEditing(event)
      .then(() => {
        const oldEvents = this.respsStore.get('events')
        const events = [...oldEvents.filter(x => x.id !== event.id), event]

        this.respsStore.set({events})
        this.tabStore.set({
          selectedTabId: 'List',
          editTabText: null,
          working: false
        })
      })
  }

  deleteEditing = eventId => {
    this.tabStore.set({working: true})

    this.api.deleteEvent(eventId)
      .then(() => {
        const oldEvents = this.respsStore.get('events')
        const events = [...oldEvents.filter(x => x.id !== eventId)]
        this.respsStore.set({events})

        this.tabStore.set({
          selectedTabId: 'List',
          editTabText: null,
          working: false
        })
      })
  }
}
