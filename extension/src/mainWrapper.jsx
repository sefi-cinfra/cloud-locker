import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isValid, getCreds } from "./redux/actions/awsActions";
import _ from 'lodash';

import { BrowserRouter as Router, Route} from "react-router-dom";

import Login from './components/login/login';
import Main from './components/main/main';


class MainWrapper extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { isValid: null }
    }

    async componentDidMount() {
        this.isCredsValid.bind(this);

        const isValid = await this.isCredsValid();
        this.setState({ isValid });
    }

    isCredsValid = async () => {
        const creds = await this.props.getCreds();
        const isValid = await this.props.isValid(creds.accessKey, creds.secretKey);
        return isValid;
    }

    render() {
        const {isValid} = this.state;

        return (
            <Router>
                <Route path="/login">
                    <Login />
                </Route>

                {isValid == true ?

                    <Route exact path="/">
                        <Main />
                </Route>

                    : <div></div>}
            </Router>
        )
    }
}

const mapStateToProps = state => ({
    creds: state.aws.creds
});

const mapDispatchToProps = {
    isValid,
    getCreds
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(MainWrapper);