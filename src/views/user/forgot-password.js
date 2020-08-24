import React, { Component } from 'react';
import { Row, Card, CardTitle, Label, Input, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../redux/actions';

import IntlMessages from '../../helpers/IntlMessages';
import { Colxx } from '../../components/common/CustomBootstrap';
import { sendResetPass } from '../../api/auth';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false,
      success: undefined,
      errors: {
        email: ''
      }
    };
  }

  handelChange = (value, tag, validateFunc = () => {}) => {
    let [error, validateValue] = validateFunc(value) || [undefined, value];

    this.setState({
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

  submit = async () => {
    const { errors, email } = this.state;

    this.setState({
      loading: true
    });

    if (JSON.stringify(errors) !== '{}' || email === '') return;

    try {
      await sendResetPass(email);
      this.setState({
        loading: false,
        success: email,
        email: '',
        error: {
          email: ''
        }
      });
    } catch ({ status, errMessage }) {
      this.setState({
        loading: false,
        success: undefined,
        errors: {
          ...this.state.errors,
          email: errMessage
        }
      });
    }
  };

  render() {
    const { email, errors, loading, success = false } = this.state;
    return (
      <Row className='h-100'>
        <Colxx xxs='12' md='7' className='mx-auto my-auto'>
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
                <IntlMessages id='user.forgetPassport' />
              </CardTitle>
              <Label className='mt-4'>
                <IntlMessages id='user.email' />
              </Label>
              <Input
                value={email}
                spellcheck="false"
                onChange={e => {
                  !loading &&
                    this.handelChange(e.target.value, 'email', () =>
                      this.mailValidator(e.target.value)
                    );
                }}
              />
              {errors.email && (
                <div className='invalid-feedback d-block'>{errors.email}</div>
              )}
              <div
                className='d-flex justify-content-end align-items-center'
                style={{ marginTop: 15 }}
              >
                <Button
                  color='primary'
                  className={`btn-shadow btn-multiple-state ${
                    loading ? 'show-spinner' : ''
                  }`}
                  size='lg'
                  onClick={() => this.submit()}
                >
                  {loading ? (
                    <div> Loading ... </div>
                  ) : (
                    <IntlMessages id='general.send' />
                  )}
                </Button>
              </div>
              {success && (
                <div
                  style={{
                    color: 'green',
                    fontSize: '15px',
                    marginTop: '10px'
                  }}
                >
                  <IntlMessages id='user.reset.password.sent' />
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
  registerUser
})(ForgotPassword);
