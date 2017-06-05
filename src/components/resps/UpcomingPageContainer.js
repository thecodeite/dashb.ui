import React, { Component } from 'react'
import moment from 'moment'

import './UpcomingPageContainer.css'
import {getResponsibilitiesAfterNow} from './upcomingResponsibilitiesService'
import ExtendedComponent from '../common/ExtendedComponent'

const getResps = events => getResponsibilitiesAfterNow(events, 8)

export class UpcomingPageContainer extends ExtendedComponent {
  constructor (props) {
    super(props)

    this.bind(props.controller.respsStore, {
      events: [],
      working: new Set()
    })
  }

  render () {
    const upcoming = getResps(this.state.events)
    const handlers = {
      onMarkDone: (checked, idSeq) => {
        const match = upcoming.find(x => x.id === idSeq)
        if (match) {
          const working = new Set([...this.state.working, idSeq])
          this.setState({working})
          this.props.controller.setDone(checked, idSeq)
            .then(() => {
              const working = new Set([...this.state.working].filter(x => x !== idSeq))
              this.setState({working})
            })
        }
      }
    }
    return <UpcomingItems upcoming={upcoming} working={this.state.working} handlers={handlers} />
  }
}


function UpcomingItems ({upcoming, working, handlers}) {
  return <ul className="UpcomingItems">
    {upcoming.map(u => <UpcomingItem key={u.id} {...u} working={working} handlers={handlers} />)}
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

function UpcomingItem ({id, name, overdue, soon, date, done, working, complete, handlers: {onMarkDone}}) {
  return <li className={'UpcomingItem' + (overdue ? ' overdue' : '') + (soon ? ' soon' : '')}>
    <time className='UpcomingItem_schedule' dateTime={date}>
      <span className='UpcomingItem_schedule_date'>{moment(date).format('DD')}</span>
      <span className='UpcomingItem_schedule_rest'>{moment(date).format('MMM YYYY')}</span>
    </time>
    <div>
      <div className='UpcomingItem_name' title={name} >{name}</div>
      <div className='UpcomingItem_until' ><DurationDescription date={date} /></div>
    </div>

    <div className='UpcomingItem_done-box'>
    <WorkingCheckbox isWorking={working.has(id)} className='UpcomingItem_done-box' type='checkbox' checked={done} onChange={e => onMarkDone(e.target.checked, id)} />
    </div>
  </li>
}

function WorkingCheckbox({className, isWorking, checked, onChange}) {
  if (isWorking) {
    return <img className={className} alt='' src='/squares.svg' />
  } else {
    return <input type='checkbox' className={className} checked={checked} onChange={onChange} />
  }
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