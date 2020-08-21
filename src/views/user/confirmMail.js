import React, { Component } from 'react';
import { Row, Card, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';

import { Grid } from '@material-ui/core';

import { Colxx } from '../../components/common/CustomBootstrap';
import { confirmMail } from '../../api/auth';
import IntlMessages from '../../helpers/IntlMessages';

class ConfirmMail extends Component {
  state = {
    loading: true,
    mail: null,
    identificator: null
  };

  componentDidMount() {
    const queryString = require('query-string');

    const { identificator, token } = queryString.parse(
      this.props.location.search
    );

    if (!identificator || !token) window.location.href = '/';

    this.checkMail(identificator, token.split(' ').join('+'));
  }

  checkMail = async (identificator, token) => {
    try {
      const response = await confirmMail(identificator, token);
      if (response) {
        this.setState({
          loading: false
        });
      }
    } catch (err) {
      // window.location.href = '/';
    }
  };

  render() {
    const { loading, mail, identificator } = this.state;
    return (
      <Row className='h-100'>
        <Colxx xxs='12' md='5' className='mx-auto my-auto'>
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

              {loading ? (
                <div className='loading' />
              ) : (
                <div>
                  <div
                    style={{
                      minWidth: '30vw',
                      display: 'flex',
                      color: 'green',
                      fontSize: '20px',
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 10
                    }}
                  >
                    <Grid container>
                      <Grid item xs={12}>
                        YOUR EMAIL IS CONFIRMED
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          color='primary'
                          className={`btn-shadow btn-multiple-state ${
                            loading ? 'show-spinner' : ''
                          }`}
                          style={{ float: 'right' }}
                          size='lg'
                          onClick={() => {
                            window.location.href = '/user/login';
                          }}
                        >
                          <span className='label'>
                            <IntlMessages id='user.login-button' />
                          </span>
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}

export default ConfirmMail;

/* 

http://localhost:3002/user/confirm-mail?identificator=brojaza1&token=U2FsdGVkX1+q98j/073omNZuSJxzydRY3+OZBU3Kn6LF3Ur75ka4tQ==
*/
