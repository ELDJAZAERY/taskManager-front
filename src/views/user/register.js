import React, { Component } from 'react';
import { Row, Card, CardTitle, Label, Input, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import IntlMessages from '../../helpers/IntlMessages';
import { Colxx } from '../../components/common/CustomBootstrap';
import { fetchRegister } from '../../api/auth';

import { systemNotif } from '../../redux/actions';
import { actionsEnum, typesEnum } from '../../redux/notifications/enums';

const initialState = {
  identificator: '',
  email: '',
  password: '',
  confirmPassword: '',
  success: false,
  errors: {
    identificator: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handelChange = (value, tag, validateFunc = () => {}) => {
    let [error, validateValue] = validateFunc(value) || [undefined, value];

    this.setState({
      success: false,
      [tag]: validateValue,
      errors: {
        ...this.state.errors,
        [tag]: error
      }
    });
  };

  lenghtValidator = (value, tag, min, max) => {
    let length = value.length;
    if (length === 0) return [undefined, value];
    if (length < min)
      return [`Enter a ${tag} with at least ${min} characters`, value];
    if (length >= max)
      return [`Enter a ${tag} with at most ${max} characters`, this.state[tag]];

    return [undefined, value];
  };

  mailValidator = email => {
    if (!email || email.length === 0) return [undefined, ''];
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const validate = re.test(String(email).toLowerCase());
    return [validate ? undefined : 'Invalid email format', email];
  };

  matchPasswordValidator = confirmPassword => {
    let errMessage =
      confirmPassword !== this.state.password
        ? 'Password are not matching'
        : undefined;
    return [errMessage, confirmPassword];
  };

  submitUser = async () => {
    const {
      errors,
      identificator,
      email,
      password,
      confirmPassword
    } = this.state;

    if (JSON.stringify(errors) !== '{}') return;

    const user = {
      identificator,
      email,
      password,
      confirmPassword
    };

    try {
      const response = await fetchRegister(user);

      const message = `User ${response.identificator} has been successfully registred`;
      this.props.systemNotif(actionsEnum.PUSH, typesEnum.SUCCESS, message);
      this.setState({
        ...initialState,
        success: true
      });
    } catch ({ status, errMessage }) {
      this.props.systemNotif(actionsEnum.PUSH, typesEnum.ERROR, errMessage);
    }
  };

  render() {
    const {
      identificator,
      email,
      password,
      confirmPassword,
      errors,
      success
    } = this.state;
    return (
      <Row className='h-100'>
        <Colxx xxs='12' md='8' className='mx-auto my-auto'>
          <Card className='auth-card'>
            <div className='position-relative image-side '>
              <NavLink to={`/`} className='white'>
                <span className='logo-single' />
              </NavLink>
              <div
                style={{
                  color: 'white',
                  fontSize: '15px',
                  marginBottom: '15px'
                }}
              >
                {' Login here '}
                <Button
                  to={`/user/login`}
                  className='white'
                  onClick={() => this.props.history.push('/user/login')}
                >
                  <IntlMessages id='user.login-button' />
                </Button>
              </div>
              <div style={success ? { display: 'block' } : { display: 'none' }}>
                <div style={{ color: 'green', fontSize: '18px' }}>
                  <IntlMessages id='user.email-validation-message' />
                </div>
                <p
                  style={{
                    fontSize: '15px',
                    marginTop: '15px'
                  }}
                >
                  <IntlMessages id='user.admin-validation-message' />
                </p>
              </div>
            </div>
            <div className='form-side'>
              <CardTitle className='mb-4'>
                <IntlMessages id='user.register' />
              </CardTitle>
              <Label>
                <IntlMessages id='user.identificator' />
              </Label>
              <Input
                value={identificator}
                onChange={e => {
                  this.handelChange(
                    e.target.value.replace(/\s/g, ''),
                    'identificator',
                    () =>
                      this.lenghtValidator(
                        e.target.value.replace(/\s/g, ''),
                        'identificator',
                        8,
                        20
                      )
                  );
                }}
              />
              {errors.identificator && (
                <div className='invalid-feedback d-block'>
                  {errors.identificator}
                </div>
              )}
              <Label className='mt-4'>
                <IntlMessages id='user.email' />
              </Label>
              <Input
                value={email}
                onChange={e => {
                  this.handelChange(e.target.value, 'email', () =>
                    this.mailValidator(e.target.value)
                  );
                }}
              />
              {errors.email && (
                <div className='invalid-feedback d-block'>{errors.email}</div>
              )}
              <Label className='mt-4'>
                <IntlMessages id='user.password' />
              </Label>
              <Input
                type='password'
                value={password}
                onChange={e => {
                  this.handelChange(e.target.value, 'password', () =>
                    this.lenghtValidator(e.target.value, 'password', 10, 30)
                  );
                }}
              />
              {errors.password && (
                <div className='invalid-feedback d-block'>
                  {errors.password}
                </div>
              )}
              <Label className='mt-4'>
                <IntlMessages id='user.confirmPassword' />
              </Label>
              <Input
                type='password'
                value={confirmPassword}
                onChange={e => {
                  this.handelChange(e.target.value, 'confirmPassword', () =>
                    this.matchPasswordValidator(e.target.value)
                  );
                }}
              />
              {errors.confirmPassword && (
                <div className='invalid-feedback d-block'>
                  {errors.confirmPassword}
                </div>
              )}
              <div
                className='d-flex justify-content-end align-items-center'
                style={{ marginTop: 15 }}
              >
                <Button
                  color='primary'
                  className='btn-shadow'
                  size='lg'
                  onClick={() => this.submitUser()}
                >
                  <IntlMessages id='user.register-button' />
                </Button>
              </div>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(mapStateToProps, {
  systemNotif
})(Register);
