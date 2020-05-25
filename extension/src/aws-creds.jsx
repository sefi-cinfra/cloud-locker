import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';


export default class AwsCreds extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.state.awsUser = localStorage.getItem('awsUser') || null;
      this.state.awsSecret = localStorage.getItem('awsSecrert') || null;
      this.state.awsChangedState = props.stateChanged;
    }

    refreshCreds = () => {
      if(_.isEmpty(document.getElementById('awsUser').value) || _.isEmpty(document.getElementById('awsSecret').value))
      {
        alert("AccessKey or SecretKey are empty");
        return;
      }
        
        localStorage.setItem('awsUser', document.getElementById('awsUser').value);
        localStorage.setItem('awsSecrert', document.getElementById('awsSecret').value);
        this.setState({awsUser: localStorage.getItem('awsUser'), awsSecret: localStorage.getItem('awsSecrert')});
        this.state.awsChangedState();
        alert("Credentials updated successfully");
    }

    logout = () => {
        localStorage.removeItem('awsUser');
        localStorage.removeItem('awsSecrert');
        this.setState({awsUser: null, awsSecret: null});
        this.state.awsChangedState();
    }

    render() {
    if(!_.isEmpty(this.state.awsUser) && !_.isEmpty(this.state.awsSecret)){
        return(<div>
            <b>Configured with Access Key</b>: {this.state.awsUser}<br />
            <input type="button" name="logout" value="Log Out" onClick={this.logout} />
            </div>)
    }else{
      return (
        <div>
          <input type="text" id="awsUser" name="awsUser" placeholder="AWS AcessKey" value={this.state.awsUser} /><br />
          <input type="text" id="awsSecret" name="awsSecret" placeholder="AWS Secret" value={this.state.awsSecret} /><br />
          <input type="button" name="updateCreds" value="Log In" onClick={this.refreshCreds} />
        </div>
      );
    }

    }
  }
  
  ReactDOM.render(
    <AwsCreds />,
    document.getElementById('root')
  );