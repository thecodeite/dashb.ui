import React, { Component } from 'react'
import moment from 'moment'

import {getResponsibilitiesAfterNow} from './upcomingResponsibilitiesService'
import './resps.css'

//const url = 'localhost:51414/list/~/resps/'

class Resps extends Component {
  constructor () {
    super()
    this.state = {
      page: 'list',
      upcoming: [],
      events: []
      // upcoming: getResponsibilitiesAfterNow(Object.keys(d).map(k => d[k]), 10)
    }
  }

  componentWillMount () {
    fetch('https://lists.codeite.aq/list/~/resps/', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(events => {
        events = Object.values(events)
        console.log('events:', events)

        this.setState({
          events,
          upcoming: getResponsibilitiesAfterNow(events, 8)
        })
      })
  }

  render() {
    const respsTabProps = {
      setPage: page => this.setState({page}),
      page: this.state.page
    }
    const onEditEvent = eventId => {
      this.setState({
        page: 'edit',
        editing: eventId
      })
    }
    return <div className='Resps'>
      <RespsTabs>
        <RespsTab to='main' {...respsTabProps} >Upcoming</RespsTab>
        <RespsTab to='list' {...respsTabProps} >List</RespsTab>
        {this.state.page === 'edit' && <RespsTab to='edit' {...respsTabProps} >Edit</RespsTab>}
      </RespsTabs>
      <RespTabsBody>
        {this.state.page === 'main' && <UpcomingItems upcoming={this.state.upcoming}/> }
        {this.state.page === 'list' && <ListEvents events={this.state.events} onEditEvent={onEditEvent} /> }
        {this.state.page === 'edit' && <ListEvents events={this.state.events} /> }
      </RespTabsBody>
    </div>
  }
}

function ListEvents ({events}) {
  return <ul className='ListEvents'>
    {events.map(evt => <li key={evt.id}>
      <ListEvent event={evt} />
    </li>)}
  </ul>
}

function ListEvent ({event}) {
  return <div className='ListEvent' >
    <span className='ListEvent-name'>{event.name}</span>
    <span className='ListEvent-schedule'>{event.schedule}</span>
    <button className='ListEvent-edit'>🖊</button>
  </div>
}

function RespsTabs ({children}) {
  return <div className='RespsTabs' >
    {children}
  </div>
}

function RespsTab ({to, page, setPage, children}) {
  return <button className={'RespsTab' + (page === to ? ' selected' : '')} onClick={() => setPage(to)} >
    {children}
  </button>
}

function RespTabsBody ({children}) {
  return <div className='RespTabsBody' >{children}</div>
}

function UpcomingItems ({upcoming}) {
  return <ul className="UpcomingItems">
    {upcoming.map(u => <UpcomingItem key={u.id} {...u} />)}
  </ul>
}

/*
{
  "name":"Download HSBC Statement",
  "date":"2017-05-23T00:00:00+02:00",
  "id":"9079fd70-2c27-11e7-9223-a51de09c4b66_0",
  "done":false,
  "overdue":false,
  "soon":true
}
*/
function UpcomingItem ({id, name, overdue, soon, date, done, onDone}) {
  return <li className={'UpcomingItem' + (overdue ? ' overdue' : '') + (soon ? ' soon' : '')}>
    <time className='UpcomingItem_schedule' dateTime={date}>
      <span className='UpcomingItem_schedule_date'>{moment(date).format('DD')}</span>
      <span className='UpcomingItem_schedule_rest'>{moment(date).format('MMM YYYY')}</span>
    </time>
    <div>
      <div className='UpcomingItem_name' title={name} >{name}</div>
      <div className='UpcomingItem_until' ><DurationDescription date={date} /></div>
    </div>

    <input className='UpcomingItem_done-box' type='checkbox' checked={done} onChange={e => onDone(e.target.checked, id)} />
  </li>
}

class DurationDescription extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formattedDate: this.formatDate(props.date)
    }
  }

  formatDate (date) {
    return moment(date).add(1, 'day').fromNow()
    //return moment(date)-moment()
  }

  componentWillMount () {
    this.intervalHandle = setInterval(() => {
      this.setState({formattedDate: this.formatDate(this.props.date)})
    }, 60000)
  }

  componentWillUnmount () {
    clearInterval(this.intervalHandle)
  }

  render () {
    return <span>{this.state.formattedDate}</span>
  }
}

export default Resps

/*
function data () {
  return {
  "aba9c120-fce8-11e6-906b-db4fba41b822": {
    "created": "2017-02-27T12:31:32.381Z",
    "updated": "2017-02-27T12:31:32.381Z",
    "complete": "0_4",
    "schedule": "R/2017-01-10/P1M",
    "id": "aba9c120-fce8-11e6-906b-db4fba41b822",
    "name": "Personal Finances"
  },
  "ae834260-08da-11e7-8e05-75fe44a30e4b": {
    "created": "2017-03-14T17:21:38.166Z",
    "updated": "2017-03-14T17:21:38.166Z",
    "complete": "0",
    "schedule": "2017-04-14",
    "id": "ae834260-08da-11e7-8e05-75fe44a30e4b",
    "name": "Setup Standing order for garage"
  },
  "d36f5190-3959-11e7-96e9-011b29e999e1": {
    "created": "2017-05-15T10:32:42.011Z",
    "updated": "2017-05-15T10:32:42.011Z",
    "schedule": "R/2002-06-16/P1Y",
    "id": "d36f5190-3959-11e7-96e9-011b29e999e1",
    "name": "WorldWideDns"
  },
  "9079fd70-2c27-11e7-9223-a51de09c4b66": {
    "created": "2017-04-28T15:30:09.721Z",
    "updated": "2017-04-28T15:30:09.721Z",
    "schedule": "R/2017-05-20T12:00:00/P1M",
    "id": "9079fd70-2c27-11e7-9223-a51de09c4b66",
    "name": "Download HSBC Statement"
  },
  "e2447ad0-ff64-11e6-add8-d3dcfc4fef27": {
    "created": "2017-03-02T16:25:43.916Z",
    "updated": "2017-03-02T16:25:43.916Z",
    "complete": "42_47",
    "schedule": "R/2013-06-17/P1M",
    "id": "e2447ad0-ff64-11e6-add8-d3dcfc4fef27",
    "name": "PAYE/NI Payment"
  },
  "ebf07440-f838-11e6-b3ef-1d20b2789276": {
    "created": "2017-02-21T13:23:24.146Z",
    "updated": "2017-02-21T13:23:24.146Z",
    "complete": "0_1",
    "schedule": "R/2016-12-07/P3M",
    "id": "ebf07440-f838-11e6-b3ef-1d20b2789276",
    "name": "File VAT Return"
  },
  "f3320e80-f88d-11e6-ac75-1ff28c1f4159": {
    "created": "2017-02-21T23:32:03.559Z",
    "updated": "2017-02-21T23:32:03.559Z",
    "complete": "0_47",
    "schedule": "R/2013-06-05/P1M",
    "id": "f3320e80-f88d-11e6-ac75-1ff28c1f4159",
    "name": "Do Payroll"
  },
  "22c3a7e0-fcca-11e6-adab-81b089159a34": {
    "created": "2017-02-27T08:52:57.809Z",
    "updated": "2017-02-27T08:52:57.809Z",
    "complete": "0",
    "schedule": "2017-02-27",
    "id": "22c3a7e0-fcca-11e6-adab-81b089159a34",
    "name": "Send contact to Peter Ball"
  },
  "1c93be50-f89c-11e6-9078-edfe494efaa6": {
    "created": "2017-02-22T01:13:25.928Z",
    "updated": "2017-02-22T01:13:25.928Z",
    "complete": "0_3",
    "schedule": "R/2017-01-31/P1M",
    "id": "1c93be50-f89c-11e6-9078-edfe494efaa6",
    "name": "Do invoice & Timesheet"
  },
  "60c48fa0-f89c-11e6-9078-edfe494efaa6": {
    "created": "2017-02-22T01:15:20.344Z",
    "updated": "2017-02-22T01:15:20.344Z",
    "complete": "0_4",
    "schedule": "R/2017-01-01/P1M",
    "id": "60c48fa0-f89c-11e6-9078-edfe494efaa6",
    "name": "Pay rent"
  },
  "f9562e30-24fd-11e7-bc05-8199fe2293c3": {
    "created": "2017-04-19T12:44:48.646Z",
    "updated": "2017-04-19T12:44:48.646Z",
    "complete": "5",
    "schedule": "R/2012-04-19/P1Y",
    "id": "f9562e30-24fd-11e7-bc05-8199fe2293c3",
    "name": "FreeAgent renewal"
  }
}
}
*/