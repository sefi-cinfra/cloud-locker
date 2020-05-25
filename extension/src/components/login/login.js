import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isValid, updateCreds, getCreds } from "../../redux/actions/awsActions";
import './login.scss';
import LoginForm from './loginForm';
import { withRouter } from 'react-router-dom';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isValid: null }
    }

    async componentDidMount() {
        let creds = await this.props.getCreds();
        let isValid = await this.props.isValid(creds.accessKey, creds.secretKey);
        this.setState({ isValid });
    }

    handleLoginSubmit = async (submittedInfo) => {
        const { accessKey, secretKey } = submittedInfo;
        if (this.props.isValid(accessKey, secretKey)) {
            this.props.updateCreds(accessKey, secretKey);
            this.props.history.push('/');
        }
    };


    render() {
        const { isValid } = this.state;

        if (isValid == true) {
            this.props.history.push('/');
        }

        return (
            <LoginForm onSubmit={this.handleLoginSubmit} />
        );
    }
}

const mapStateToProps = state => ({
    creds: state.aws.creds,
    validation: state.aws.validation
});

const mapDispatchToProps = {
    isValid,
    updateCreds,
    getCreds
};


Login = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(Login);

export default withRouter(Login);