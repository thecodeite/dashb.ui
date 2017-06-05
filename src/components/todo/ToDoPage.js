import React, { Component } from 'react'
import TabContainer, { TabPage } from '../common/TabContainer'

export default class ToDoPage extends Component {
  constructor () {
    super()
    this.state = {
      selectedTabId: 'meat'
    }
  }

  onTabChange = newTabId => {
    console.log('onTabChange newTabId:', newTabId)
    this.setState({selectedTabId: newTabId})
  }

  render () {
    return null
  }

  Xrender () {
    return <div className='ToDoPage'>
      <TabContainer selectedTabId={this.state.selectedTabId} onChange={this.onTabChange}>
        <TabPage id='cheese' text='Cheese' ><button onClick={() => this.setState({selectedTabId: 'meat'})} >Meat</button></TabPage>
        <TabPage id='meat' >Bacon</TabPage>
        <TabPage id='fish' >Cod</TabPage>
      </TabContainer>
    </div>
  }
}
