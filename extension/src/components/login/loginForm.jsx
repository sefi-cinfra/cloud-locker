import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { } from "../../redux/actions/awsActions";
import './login.scss';
import { Field, reduxForm } from 'redux-form';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WarningIcon from '@material-ui/icons/Warning';
import TextField from '../../shared/textField';
class LoginForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentDidMount() {
    }

    render() {
        const { handleSubmit, pristine, submitting, credsValidation } = this.props;
        return (
            <div className="login-form">
                <div className="form-box">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-input">
                            <Field
                                name="accessKey"
                                component={TextField}
                                type="text"
                                placeholder="AWS Access Key"
                            />
                        </div>

                        <div className="form-input">
                            <Field
                                name="secretKey"
                                component={TextField}
                                type="password"
                                placeholder="AWS Secret Key"
                            />
                        </div>

                        <div className="form-input form-button">
                            <Button type="submit" disabled={pristine || submitting}>Submit</Button>
                        </div>
                    </form>
                    {credsValidation.isValid == false ?
                        <div className="error-message-box">
                            <div className="icon"><WarningIcon /></div>
                            <div className="message">{credsValidation.reason}</div>
                        </div> : <div></div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    credsValidation: state.aws.validation
});

const mapDispatchToProps = {
};

LoginForm = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(LoginForm);

export default reduxForm({
    form: 'login-form',
})(LoginForm);