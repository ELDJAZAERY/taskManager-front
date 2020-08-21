import React from 'react';
import { connect } from 'react-redux';

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input
} from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';

import { updatePassword } from '../../../api/users';

import { systemNotif } from '../../../redux/actions';
import { actionsEnum, typesEnum } from '../../../redux/notifications/enums';

import '../styles/g.classes.css';

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      newPassword: '',
      confirmPassword: '',
      errors: {
        password: '',
        newPassword: '',
        confirmPassword: ''
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
    if (length < min)
      return [`Enter a ${tag} with at least ${min} characters`, value];
    if (length >= max)
      return [`Enter a ${tag} with at most ${max} characters`, this.state[tag]];

    return [undefined, value];
  };

  matchPasswordValidator = confirmPassword => {
    let errMessage =
      confirmPassword !== this.state.newPassword
        ? 'Password are not matching'
        : undefined;
    return [errMessage, confirmPassword];
  };

  submit = async () => {
    const { connectedUser = {} } = this.props;
    const { identificator } = connectedUser;

    if (!identificator) return;

    const { password, newPassword, confirmPassword, errors } = this.state;

    if (JSON.stringify(errors) !== '{}') return;

    try {
      await updatePassword(identificator, {
        password,
        newPassword,
        confirmPassword
      });

      const message = `Password has been successfully Changed`;
      this.props.systemNotif(actionsEnum.PUSH, typesEnum.SUCCESS, message);
      this.props.toggleModal();
    } catch ({ status, errMessage }) {
      this.props.systemNotif(actionsEnum.PUSH, typesEnum.ERROR, errMessage);
    }
  };

  render() {
    const { modalOpen, toggleModal } = this.props;
    const { password, newPassword, confirmPassword, errors } = this.state;

    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName='modal-right'
        backdrop='static'
      >
        <ModalHeader toggle={toggleModal}>
          <IntlMessages id='user.change.password' />
        </ModalHeader>
        <ModalBody>
          <Label>
            <IntlMessages id='user.password' />
          </Label>
          <Input
            type='password'
            value={password}
            onChange={e => {
              this.handelChange(e.target.value, 'password');
            }}
          />
          {errors.password && (
            <div className='invalid-feedback d-block'>{errors.password}</div>
          )}
          <Label className='mt-4'>
            <IntlMessages id='user.new.password' />
          </Label>
          <Input
            type='password'
            value={newPassword}
            onChange={e => {
              this.handelChange(e.target.value, 'newPassword', () =>
                this.lenghtValidator(e.target.value, 'newPassword', 10, 30)
              );
            }}
          />
          {errors.newPassword && (
            <div className='invalid-feedback d-block'>{errors.newPassword}</div>
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
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' outline onClick={toggleModal}>
            <IntlMessages id='pages.cancel' />
          </Button>
          <Button
            color='primary'
            disabled={!(JSON.stringify(errors) === '{}')}
            onClick={this.submit}
          >
            <IntlMessages id='pages.submit' />
          </Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(null, {
  systemNotif
})(ChangePasswordForm);
