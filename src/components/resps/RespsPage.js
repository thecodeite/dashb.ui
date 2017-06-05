import React from 'react'
import TabContainer, { TabPage } from '../common/TabContainer'
import { EditEventContainer } from './EditEventContainer'
import { UpcomingPageContainer } from './UpcomingPageContainer'
import { ListEventsPageContainer } from './ListEventsPageContainer'
// import { respsStore } from './respsStore'
import { Store } from '../common/store'
import ExtendedComponent from '../common/ExtendedComponent'
import {RespsController} from './controller'
import {RespsApi} from './api'

export default class RespsPage extends ExtendedComponent {
  constructor (props) {
    super(props)

    const initialTabState = {
      selectedTabId: 'Upcoming',
      editTabText: null
    }

    const api = new RespsApi()
    const respsStore = new Store()
    const tabStore = new Store(initialTabState)
    this.controller = new RespsController(api, respsStore, tabStore)

    // this.addUnmountEvent(tabStore.register('selectedTabId', selectedTabId => this.setState({selectedTabId})))
    // this.addUnmountEvent(tabStore.register('editTabText', editTabText => this.setState({editTabText})))

    // this.watch(tabStore, 'selectedTabId')
    // this.watch(tabStore, 'editTabText')
    this.bind(tabStore, ['editTabText', 'selectedTabId'])

    this.state = initialTabState

    api.loadResps()
      .then(events => {
        respsStore.set('events', events)
        this.setState({loaded: true})
      })
  }

  onTabChange = newTabId => this.setState({selectedTabId: newTabId})

  render () {
    return <div className='RespsPage'>
      {this.state.loaded ? this.renderLoaded() : this.renderLoading()}
    </div>
  }

  renderLoading () {
    return  <img alt='' src='/squares.svg' className={'show'} />
  }

  renderLoaded () {
    return <TabContainer selectedTabId={this.state.selectedTabId} onChange={this.onTabChange}>
      <TabPage id='Upcoming' component={UpcomingPageContainer} controller={this.controller} />
      <TabPage id='List' component={ListEventsPageContainer} controller={this.controller} />
      <TabPage id='editTab' component={EditEventContainer} text={this.state.editTabText} visiblity={!!this.state.editTabText} controller={this.controller} />
    </TabContainer>
  }
}
