import React from 'react'
import ExtendedComponent from '../common/ExtendedComponent'
//import moment from 'moment'
import './ListEventsPageContainer.css'

export class ListEventsPageContainer extends ExtendedComponent {
  constructor (props) {
    super(props)
    this.bind(props.controller.respsStore, 'events', [])
  }

  onEditEvent = eventId => {
    this.props.controller.editEvent(eventId)
  }

  render () {
    return <ListEventsPage
      events={this.state.events}
      onEditEvent={this.props.controller.editEvent}
      onAddNewEvent={this.props.controller.addNewEvent}
    />
  }
}

export function ListEventsPage ({events, onEditEvent, onAddNewEvent}) {
  return <div className='ListEventsPage' >
    <div className='ListEventsContainer' >
      <ListEvents events={events} onEditEvent={onEditEvent} />
    </div>
    <button onClick={() => onAddNewEvent()}>Add new Event</button>
  </div>
}

function ListEvents ({events, onEditEvent}) {
  return <ul className='ListEvents'>
    {events.map(evt => <li key={evt.id}>
      <ListEvent event={evt} onEditEvent={() => onEditEvent(evt.id)}/>
    </li>)}
  </ul>
}

function ListEvent ({event, onEditEvent}) {
  return <button className='ListEvent' onClick={onEditEvent} >
    <div className='ListEvent-text'>
      <div className='ListEvent-name'>{event.name}</div>
      <div className='ListEvent-schedule'>{event.schedule}</div>
    </div>
  </button>
}