import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { injectIntl } from 'react-intl';

import {
  Row,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Label,
  Input,
  CustomInput,
  Button
} from 'reactstrap';
import Select from 'react-select';

import { Grid } from '@material-ui/core';

import Breadcrumb from '../../../../containers/navs/Breadcrumb';

import {
  Separator,
  Colxx
} from '../../../../components/common/CustomBootstrap';

import CustomSelectInput from '../../../../components/common/CustomSelectInput';

import IntlMessages from '../../../../helpers/IntlMessages';

import { getUser, updateUser } from '../../../../api/users';

import Moment from 'moment';

import { objectEquals } from '../../helpers/data.helpers';

import { ROLES } from '../../constants/lists';

import { systemNotif } from '../../../../redux/actions';
import { actionsEnum, typesEnum } from '../../../../redux/notifications/enums';

import ResetPasswordForm from './reset.password.form';

import '../../styles/g.classes.css';

const filter = ['id', 'updatedAt', 'isActivated', 'partner', 'isMailConfirmed'];

class KnowledgeBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      User: undefined,
      exposedUser: undefined,
      modalOpen: false,
      errors: {},
      loading: true
    };
  }

  componentDidMount() {
    const { identificator } = this.props.match.params;

    if (identificator) {
      this.fetchUser(identificator);
    }
  }

  fetchUser = async identificator => {
    const { systemNotif } = this.props;

    try {
      const User = await getUser(identificator);
      this.setState({ User, exposedUser: User, loading: false });
    } catch ({ status, errMessage }) {
      systemNotif(actionsEnum.PUSH, typesEnum.ERROR, errMessage, status);
    }
  };

  handelChange = (value, tag, validateFunc = () => {}) => {
    let [error, validateValue] = validateFunc(value) || [undefined, value];

    this.setState({
      exposedUser: {
        ...this.state.exposedUser,
        [tag]: validateValue
      },
      errors: {
        ...this.state.errors,
        [tag]: error
      }
    });
  };

  lenghtValidator = (value, tag, min, max) => {
    let length = value.length;
    if (length < min)
      return [`Enter a ${tag} with at least ${min} characters`, value];
    if (length >= max)
      return [`Enter a ${tag} with at most ${max} characters`, this.state[tag]];

    return [undefined, value];
  };

  isInfosChanged = () => {
    const { User: originalOne, exposedUser, errors } = this.state;

    return (
      !objectEquals(exposedUser, originalOne) && JSON.stringify(errors) === '{}'
    );
  };

  selectedValue = value => {
    for (let cat of ROLES) {
      if (cat.value === value) return cat;
    }
    return undefined;
  };

  submitChange = async () => {
    if (!this.isInfosChanged()) return;

    const { exposedUser, User: originalOne } = this.state;

    const shouldUpdateURL =
      exposedUser.identificator !== originalOne.identificator;

    try {
      const User = await updateUser(originalOne.identificator, {
        ...exposedUser
      });
      this.setState({
        User,
        exposedUser: User
      });

      const message = `CLIENT - ${User.identificator} - has been successfully updated`;
      systemNotif(actionsEnum.PUSH, typesEnum.SUCCESS, message);

      if (shouldUpdateURL) {
        this.props.history.push(
          `/app/dashboard/users/account/${User.identificator}`
        );
      }
    } catch ({ status, errMessage }) {
      systemNotif(actionsEnum.PUSH, typesEnum.ERROR, errMessage, status);
    }
  };

  abondonChanges = () => {
    this.setState({
      exposedUser: this.state.User
    });
  };

  havePermission = action => {
    const { connectedUser = {} } = this.props;
    const { role } = connectedUser;

    if (
      action === 'reset.password' ||
      action === 'update.status' ||
      action === 'update.role'
    )
      return role === 'Admin';

    if (action === 'createdAt' || action === 'identificator') return false;

    return false;
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  render() {
    const { exposedUser: User, errors, loading, modalOpen } = this.state;

    const CHECK_BOXES = ['isMailConfirmed'];

    return (
      <Fragment>
        {this.havePermission('reset.password') && (
          <ResetPasswordForm
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            {...this.props}
          />
        )}
        <Row>
          <Colxx xxs='12'>
            <Breadcrumb heading='menu.account' match={this.props.match} />
            <Separator className='mb-4' />
          </Colxx>
        </Row>
        <Row>
          <Grid container justify='center'>
            <Colxx xxs='10'>
              <Card>
                <CardTitle>
                  <Grid container direction='row' spacing={2}>
                    <Grid item xs={7}>
                      <Grid
                        item
                        container
                        direction='row'
                        justify='flex-end'
                        alignItems='center'
                      >
                        <Grid item>
                          <div className='text-center'>
                            <i
                              style={{ fontSize: '40px', color: 'primary' }}
                              className={
                                'iconsminds-business-man color-theme-1'
                              }
                            />
                            <h5 className='color-theme-1 noselect'>
                              ACCOUNT {'  '}
                              {User && (
                                <label for='isActive'>
                                  <IntlMessages
                                    id={`item.isActive.${User['isActivated']}`}
                                  />
                                </label>
                              )}
                            </h5>
                          </div>
                        </Grid>
                        <Grid item>
                          {User && (
                            <React.Fragment>
                              <CustomInput
                                type='checkbox'
                                id='isActive'
                                name='isActive'
                                checked={User['isActivated']}
                                onClick={e => {
                                  this.handelChange(
                                    e.target.checked,
                                    'isActivated'
                                  );
                                }}
                                disabled={!this.havePermission('update.status')}
                              />
                            </React.Fragment>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      container
                      justify='flex-end'
                      alignItems='center'
                    >
                      {this.havePermission('reset.password') && (
                        <Button color='primary' onClick={this.toggleModal}>
                          <IntlMessages id='pages.password.rest' />
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container justify='center'>
                    <Separator className='col-10' />
                  </Grid>
                </CardTitle>
                <CardBody className='mb-5'>
                  {loading ? (
                    <div className='loading' />
                  ) : (
                    <Grid
                      container
                      direction='row'
                      justify='center'
                      spacing={8}
                    >
                      {User &&
                        Object.keys(User)
                          .filter(key => !filter.includes(key))
                          .map((key, index) => {
                            if (key === 'role')
                              return (
                                <Grid item xs={5}>
                                  <Label>
                                    <IntlMessages id='user.role' />
                                  </Label>
                                  {this.havePermission('update.role') ? (
                                    <Select
                                      components={{ Input: CustomSelectInput }}
                                      className='react-select'
                                      classNamePrefix='react-select'
                                      name='form-field-name'
                                      value={this.selectedValue(User['role'])}
                                      onChange={selected => {
                                        this.handelChange(
                                          selected.value,
                                          'role'
                                        );
                                      }}
                                      options={ROLES}
                                    />
                                  ) : (
                                    <Input
                                      value={User['role']}
                                      style={{
                                        backgroundColor: 'rgba(0,0,0,0)'
                                      }}
                                      disabled={true}
                                    />
                                  )}
                                </Grid>
                              );
                            return (
                              <React.Fragment>
                                <Grid key={index} item xs={5}>
                                  <Label>
                                    <IntlMessages id={`user.${key}`} />
                                  </Label>
                                  <Input
                                    value={
                                      key === 'createdAt'
                                        ? Moment(User[key]).format('DD-MM-YYYY')
                                        : User[key]
                                    }
                                    onChange={e => {
                                      this.handelChange(
                                        e.target.value,
                                        key,
                                        () =>
                                          this.lenghtValidator(
                                            e.target.value,
                                            key,
                                            1
                                          )
                                      );
                                    }}
                                    style={{ backgroundColor: 'rgba(0,0,0,0)' }}
                                    disabled={!this.havePermission(key)}
                                  />
                                </Grid>
                                {errors[key] && (
                                  <div className='invalid-feedback d-block'>
                                    {errors[key]}
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}
                      {User && (
                        <Label className='mt-4'>
                          <Grid item xs={12} style={{ minWidth: '15vw' }}>
                            <Grid container direction='row' spacing={4}>
                              {CHECK_BOXES.map((key, index) => (
                                <Grid item xs={12} key={index}>
                                  <Grid container direction='row' spacing={3}>
                                    <Grid item xs={1}>
                                      <CustomInput
                                        type='checkbox'
                                        id={key}
                                        name={key}
                                        checked={User[key]}
                                        onClick={e => {
                                          this.handelChange(
                                            e.target.checked,
                                            key
                                          );
                                        }}
                                        disabled={!this.havePermission(key)}
                                      />
                                    </Grid>
                                    <Grid item xs={9}>
                                      <label for={key}>
                                        <IntlMessages id={`user.${key}`} />
                                      </label>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                        </Label>
                      )}
                    </Grid>
                  )}
                </CardBody>
                {this.isInfosChanged() && (
                  <CardFooter>
                    <Grid
                      container
                      direction='row'
                      justify='center'
                      alignItems='center'
                      spacing={8}
                    >
                      <Grid item>
                        <Button
                          color='secondary'
                          outline
                          onClick={this.abondonChanges}
                        >
                          <IntlMessages id='pages.reset' />
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          color='primary'
                          disabled={!this.isInfosChanged()}
                          onClick={this.submitChange}
                        >
                          <IntlMessages id='pages.submit-change' />
                        </Button>{' '}
                      </Grid>
                    </Grid>
                  </CardFooter>
                )}
              </Card>
            </Colxx>
          </Grid>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user: connectedUser } = authUser;
  return { connectedUser };
};

export default connect(mapStateToProps, {
  systemNotif
})(injectIntl(KnowledgeBase));
