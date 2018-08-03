const tld = window.location.hostname.substr(window.location.hostname.lastIndexOf('.') + 1)
const server = `//lists.codeite.${tld}`
const loginPage = `//auth.codeite.${tld}/login`

export class HttpError extends Error {
  constructor(message, filename, lineNumber, status) {
    super(message, filename, lineNumber)
    this.status = status
  }
}

HttpError.check = res => {
  if (res.ok) return res
  throw new HttpError('failed ' + res.status, null, null, res.status)
}

export class RespsApi {
  constructor (onError) {
    if (typeof onError === 'function') {
      this.onError = onError
    } else {
      this.onError = (url, err) => {
        console.error(url, err, err.status)

        if (err.status === 401) {
          if (tld !== 'aq' || confirm('Authentication issue. Login?')) {
            window.location = loginPage + `?redirect=${window.location}`
          }
        } else {
          alert('error occured' + err)
        }
      }
    }
  }

  loadResp = id => {
    const url = `${server}/list/~/resps/_/${id}`
    return fetch(url, {
      credentials: 'include'
    })
    .then(HttpError.check)
    .then(res => res.json())
    .catch(err => this.onError(url, err))
  }

  loadResps = () => {
    const url = `${server}/list/~/resps/`
    return fetch(url, {
      credentials: 'include'
    })
    .then(res => {
      console.log('res.ok:', res.ok)
      return res

    })
    .then(HttpError.check)
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
    .then(HttpError.check)
    .catch(err => this.onError(url, err))
  }

  deleteEvent = eventId => {
    console.log('deleteEvent event:', eventId)

    const url = `${server}/list/~/resps/_/${eventId}`
    return fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(HttpError.check)
    .catch(err => this.onError(url, err))
  }
}