import React from 'react';
import store from './store';
import { Provider } from 'react-redux';
import './app.scss';
import MainWrapper from './mainWrapper';
export default class App extends React.Component {
  
  render() {
    return (
      <Provider store={store}>
        <div className="body-container">
          <div className="header-container">
            <div className="icon-container">
              <img
                src="images/logo.png" alt="logo" />
            </div>
            <div className="header-cl">Cloud Locker</div>
            <div className="settings-cl">
              <img src="images/more_vert-24px.svg" alt="settings" />
            </div>
          </div>

          <div className="layout">
            <div className="layout-box">
              <MainWrapper />
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}
