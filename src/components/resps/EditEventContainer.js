import React from 'react'

//import moment from 'moment'
//import uuid from 'uuid'

import './EditEventContainer.css'
import { ExtendedComponent } from '../common/ExtendedComponent'

export class EditEventContainer extends ExtendedComponent {
  constructor(props) {
    super(props)
    this.bind(this.props.controller.respsStore, 'editing', {})
  }

  editField = (fieldName, newValue) => {
    const editing = {...this.state.editing}
    editing[fieldName] = newValue
    this.setState({editing})
  }

  onDone = () => {
    // console.log('this.state.editing:', this.state.editing)
    if (this.state.editing.id) {
      this.props.controller.saveEditing(this.state.editing)
    } else {
      this.props.controller.addEditing(this.state.editing)
    }
  }

  onDelete = () => {
    // console.log('onDelete this.state.editing:', this.state.editing)
    this.props.controller.deleteEditing(this.state.editing.id)
  }

  render () {
    // console.log('this.state.editing:', this.state.editing)

    return <EditEvent
      onCancel={this.props.controller.cancelEditing}
      onDone={this.onDone}
      editing={this.state.editing}
      onEdit={this.editField}
      onDelete={this.onDelete} />
  }
}

function EditEvent ({editing, onEdit, onDone, onCancel, onDelete}) {
  const onSubmit = e => {
    e.preventDefault()
    onDone()
  }

  return <form className='EditEvent' onSubmit={onSubmit}>
    <div className='EditEvent-section'>
      <label className='EditEvent-label'>Name</label>
      <input value={editing.name} onChange={e => onEdit('name', e.target.value)}  className='EditEvent-input' />
    </div>
    <div className='EditEvent-section'>
      <label className='EditEvent-label'>Schedule</label>
      <input value={editing.schedule} onChange={e => onEdit('schedule', e.target.value)}  className='EditEvent-input' placeholder="R/2018-04-03/P1M"/>
    </div>
    <div className='EditEvent-due'>
      <label className='EditEvent-label'>Due</label>
      <input value={editing.due} onChange={e => onEdit('due', e.target.value)}  className='EditEvent-input' placeholder="P1Y2M3DT4H5M6S" />
    </div>
    <div className='EditEvent-complete'>
      <label className='EditEvent-label'>Complete</label>
      <input value={editing.complete} onChange={e => onEdit('complete', e.target.value)}  className='EditEvent-input' placeholder="P1Y2M3DT4H5M6S" />
    </div>
    <div className='EditEvent-until'>
      <label className='EditEvent-until'>Until</label>
      <input value={editing.until} onChange={e => onEdit('until', e.target.value)}  className='EditEvent-input' placeholder="2020-01-01" />
    </div>
    <div className='EditEvent-buttonSection'>
      <input type='submit' value={editing.id?'Save':'Add'}/>
      {editing.id && <input type='button' value='Delete' onClick={onDelete} />}
      <input type='button' value='Cancel' onClick={onCancel} />
    </div>
  </form>
}