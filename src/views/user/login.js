import React, { Component } from 'react';
import { Row, Card, CardTitle, Label, FormGroup, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { NotificationManager } from '../../components/common/react-notifications';
import { Formik, Form, Field } from 'formik';

import { loginUser } from '../../redux/actions';
import { Colxx } from '../../components/common/CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Identificator: props.identificator,
      password: ''
    };
  }

  onUserLogin = values => {
    if (!this.props.loading) {
      if (values.Identificator !== '' && values.password !== '') {
        this.props.loginUser(values, this.props.history);
      }
    }
  };

  validateEmail = value => {
    let error;

    if (!value) {
      error = 'Please enter your email address';
    }

    return error;
  };

  validatePassword = value => {
    let error;
    if (!value) {
      error = 'Please enter your password';
    } else if (value.length < 4) {
      error = 'Value must be longer than 3 characters';
    }
    return error;
  };

  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.warning(
        this.props.error,
        'Login Error',
        3000,
        null,
        null,
        ''
      );
    }
  }

  render() {
    return (
      <Row className='h-100'>
        <Colxx xxs='12' md='7' className='mx-auto my-auto'>
          <Card className='auth-card'>
            <div className='position-relative image-side '>
              <NavLink to={`/`} className='white'>
                <span className='logo-single' />
              </NavLink>
            </div>
            <div className='form-side'>
              <CardTitle className='mb-4' style={{ fontSize: '30px' }}>
                <IntlMessages id='user.login-title' />
              </CardTitle>
              <Formik onSubmit={this.onUserLogin} initialValues={this.state}>
                {({ errors, touched }) => (
                  <Form className='av-tooltip tooltip-label-bottom'>
                    <FormGroup className='form-group has-float-label'>
                      <Label>
                        <IntlMessages id='user.login.email' />
                      </Label>
                      <Field
                        className='form-control'
                        spellcheck="false"
                        name='Identificator'
                        validate={this.validateEmail}
                      />
                      {errors.email && touched.email && (
                        <div className='invalid-feedback d-block'>
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className='form-group has-float-label'>
                      <Label>
                        <IntlMessages id='user.password' />
                      </Label>
                      <Field
                        className='form-control'
                        type='password'
                        name='password'
                        validate={this.validatePassword}
                      />
                      {errors.password && touched.password && (
                        <div className='invalid-feedback d-block'>
                          {errors.password}
                        </div>
                      )}
                    </FormGroup>
                    <div className='d-flex justify-content-between align-items-center'>
                      <NavLink to={`/user/forgot-password`}>
                        <IntlMessages id='user.forgot-password-question' />
                      </NavLink>
                      <Button
                        type='submit'
                        color='primary'
                        className={`btn-shadow btn-multiple-state ${
                          this.props.loading ? 'show-spinner' : ''
                        }`}
                        size='lg'
                      >
                        <span className='spinner d-inline-block'>
                          <span className='bounce1' />
                          <span className='bounce2' />
                          <span className='bounce3' />
                        </span>
                        <span className='label'>
                          <IntlMessages id='user.login-button' />
                        </span>
                      </Button>
                    </div>
                    <NavLink to={`/user/register`}>
                      <IntlMessages id='user.dont-registred-questoin' />
                    </NavLink>
                  </Form>
                )}
              </Formik>
              <NavLink to={`/user/send-mail`}>
                <IntlMessages id='user.resend-confirmation-mail-questoin' />
              </NavLink>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading, error } = authUser;
  const { identificator } = user || {};
  return { identificator, user, loading, error };
};

export default connect(mapStateToProps, {
  loginUser
})(Login);
