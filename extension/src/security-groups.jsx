import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class SecurityGroups extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.state.awsLoggedIn = props.awsLoggedIn;
      this.state.customerIp = props.customerIp;
    }

    static getDerivedStateFromProps(props, state) {
      if (props.awsLoggedIn === state.awsLoggedIn && props.customerIp == state.customerIp) {
        return null;
      }

      return {
        awsLoggedIn: props.awsLoggedIn,
        customerIp: props.customerIp
      };
    }

    render() {
      //This code will be called just if AWS configured
      if(this.state.awsLoggedIn){

        return(
          <ul>
              <li>{this.state.customerIp}</li>
              <li>bbb</li>
              <li>ccc</li>
              </ul>)
      }
      else{
          return(<div></div>)
      }
    }
  }
  
  
  ReactDOM.render(
    <SecurityGroups />,
    document.getElementById('root')
  );