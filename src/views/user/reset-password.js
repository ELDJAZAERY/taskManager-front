import React, { Component } from 'react';
import { Row, Card, CardTitle, Label, Input, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import IntlMessages from '../../helpers/IntlMessages';
import { Colxx } from '../../components/common/CustomBootstrap';
import { resetPasswordWithOobCode } from '../../api/auth';

import { systemNotif } from '../../redux/actions';
import { actionsEnum, typesEnum } from '../../redux/notifications/enums';

const initialState = {
  password: '',
  confirmPassword: '',
  success: false,
  errors: {
    password: '',
    confirmPassword: ''
  }
};

class ResetPassowrd extends Component {
  constructor(props) {
    super(props);

    const queryString = require('query-string');

    const { identificator, oobCode } = queryString.parse(
      this.props.location.search
    );

    if (!identificator || !oobCode) window.location.href = '/';

    this.state = {
      ...initialState,
      oobCode: oobCode.split(' ').join('+'),
      identificator
    };
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

  matchPasswordValidator = confirmPassword => {
    let errMessage =
      confirmPassword !== this.state.password
        ? 'Password are not matching'
        : undefined;
    return [errMessage, confirmPassword];
  };

  submit = async () => {
    const {
      errors,
      password,
      confirmPassword,
      oobCode,
      identificator
    } = this.state;

    if (JSON.stringify(errors) !== '{}') return;
    const resetOrder = {
      identificator,
      oobCode,
      password,
      confirmPassword
    };
    try {
      const response = await resetPasswordWithOobCode(resetOrder);
      const message = `Your password has been reset`;
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
    const { password, confirmPassword, errors, success } = this.state;
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
            </div>
            <div className='form-side'>
              <CardTitle className='mb-4'>
                <IntlMessages id='user.reset.password' />
              </CardTitle>
              <Label>
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
                  onClick={() => this.submit()}
                >
                  <IntlMessages id='user.reset-password-button' />
                </Button>
              </div>
              {success && (
                <div
                  style={{ color: 'green', fontSize: '18px', marginTop: 20 }}
                >
                  <IntlMessages id='user.reset-password-success' />
                </div>
              )}
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
})(ResetPassowrd);

/*

http://localhost:3002/user/reset-password?identificator=brojaza1&oobCode=U2FsdGVkX1+oReBRuvMGMh+Ta2Ngnt3yWKD/4PWBdZG/Z6CUwHejmQ==

U2FsdGVkX1+1mQnltw6fR2TtdLFzwx8wpyjI+X54m1zGfDmshv1k0A==

*/
