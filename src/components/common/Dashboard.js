import React, { Component } from 'react';
import './common.css';

// import Resps from '../resps/Resps'
import RespsPage from '../resps/RespsPage'
//import ToDoPage from '../todo/ToDoPage'

class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard">
        <div className='Dashboard-pages'>
          {/*<div className='Page' style={{background: '_red'}} >Resps </div>*/}
          {/*<div className='Page' style={{background: '_green'}} ><ToDoPage /></div>*/}
          <div className='Page' style={{background: '_blue'}} ><RespsPage /></div>
          {/*<div className='Page' style={{background: '_orange'}} >orange</div>*/}
        </div>
      </div>
    );
  }
}

export default Dashboard
