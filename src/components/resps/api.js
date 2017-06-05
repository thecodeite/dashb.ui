import {toRange, toArray} from './number-range'

const tld = window.location.hostname.substr(window.location.hostname.lastIndexOf('.') + 1)
const server = `https://lists.codeite.${tld}`

export class RespsApi {
  constructor (onError) {
    if (typeof onError === 'function') {
      this.onError = onError
    } else {
      this.onError = (url, err) => {
        console.error(url, err)
        alert('error occured')
      }
    }
  }

  setDone = (checked, eventIdSeq) => {
    const [id, seqStr] = eventIdSeq.split('_')
    const seq = Number(seqStr)

    return this.loadResp(id)
      .then (event => {
        const existing = new Set(toArray(event.complete))

        if (checked) existing.add(seq)
        else existing.delete(seq)

        const complete = toRange([...existing])
        const args = {id, complete}
        return this.saveEditing(args).then(() => args)
      })
  }

  loadResp = id => {
    const url = `${server}/list/~/resps/_/${id}`
    return fetch(url, {
      credentials: 'include'
    })
    .then(res => res.json())
    .catch(err => this.onError(url, err))
  }

  loadResps = () => {
    const url = `${server}/list/~/resps/`
    return fetch(url, {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(events => {
      return Object.keys(events).map(id => ({id, ...events[id]}))
    })
    .catch(err => this.onError(url, err))
  }

  saveEditing = update => {
    // console.log('update:', update)

    const url = `${server}/list/~/resps/_/${update.id}`
    return fetch(url, {
      method: 'PATCH',
      credentials: 'include',
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify(update)
    })
      .then(res => {if(!res.ok) throw new Error(`failed to retreive "${url}" : ${res.status}`)})
      .catch(err => this.onError(url, err))
  }

  deleteEvent = eventId => {
    console.log('deleteEvent event:', eventId)

    const url = `${server}/list/~/resps/_/${eventId}`
    return fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => {if(!res.ok) throw new Error('failed ' + res.status)})
      .catch(err => this.onError(url, err))
  }
}