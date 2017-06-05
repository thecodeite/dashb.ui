import React, { Component } from 'react';

import './TabContainer.css';

export default class TabContainer extends Component {
  constructor (props) {
    super(props)

    if (props.selectedTabId) {
      this.state = {
        selectedTabId: props.selectedTabId,
        controlled: true
      }
    } else {
      const firstTab = React.Children.toArray(this.props.children)[0]
      const selectedTabId = firstTab.props.id  || 'Tab 1'
      this.state = {
        selectedTabId,
        controlled: false
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedTabId !== this.state.selectedTabId) {
      this.setState({selectedTabId: nextProps.selectedTabId})
    }
  }

  tabClicked = tabId => {
    if (this.state.controlled) {
      this.props.onChange && this.props.onChange(tabId)
    } else {
      this.setState({selectedTabId: tabId})
    }
  }

  render() {
    const tabs = []
    let visiblePage = null

    React.Children.forEach(this.props.children, (c, i) => {
      const id = (c.props && c.props.id) || `Tab ${i+1}`
      const text = (c.props && c.props.text) || id
      let visible = true

      if (c.props.visiblity !== undefined) {
        visible = c.props.visiblity
      }

      if (visible) {
        tabs.push({id, text})
      }

      if (!visiblePage) {
        visiblePage = c
      }

      if (id === this.state.selectedTabId && visible) {
        visiblePage = c
      }
    })

    let content = null

    if (visiblePage) {
      if (typeof visiblePage.props.render === 'function') {
        content = visiblePage.props.render(visiblePage.props)
      } else if (visiblePage.props.component) {
        content = React.createElement(visiblePage.props.component, visiblePage.props)
      }
    }

    return (
      <div className='TabContainer'>
        <TabBar tabs={tabs} tabClicked={this.tabClicked} selected={this.state.selectedTabId}/>
        <div className='TabsBody' >{content}</div>
      </div>
    );
  }
}

export function TabBar ({tabs, tabClicked, selected}) {
  return <div className='TabBar'>
    {tabs.map(t => <Tab key={t.id} id={t.id} text={t.text} tabClicked={tabClicked} selected={selected} />)}
  </div>
}

export function Tab ({id, text, tabClicked, selected}) {
  const props = {
    className: 'Tab' + (selected === id ? ' selected' : ''),
    onClick: () => tabClicked(id)
  }

  return <button {...props} >{text}</button>
}

export function TabPage () {
  return <div className='TabPage' >

  </div>
}
