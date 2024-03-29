import React, { Component } from 'react';
import {
  Row,
  Button,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Collapse
} from 'reactstrap';
import { injectIntl } from 'react-intl';

import {
  Colxx,
  Separator
} from '../../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../../containers/navs/Breadcrumb';
import IntlMessages from '../../../../helpers/IntlMessages';

class ListPageHeading extends Component {
  constructor(props) {
    super();
    this.state = {
      dropdownSplitOpen: false,
      displayOptionsIsOpen: false
    };
  }

  toggleDisplayOptions = () => {
    this.setState(prevState => ({
      displayOptionsIsOpen: !prevState.displayOptionsIsOpen
    }));
  };

  toggleSplit = () => {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  };

  render() {
    const { messages } = this.props.intl;
    const {
      changeOrderBy,
      changePageSize,
      selectedPageSize,
      totalItemCount,
      selectedOrderOption,
      match,
      startIndex,
      endIndex,
      onSearchKey,
      orderOptions,
      pageSizes,
      toggleModal,
      heading,
      havePermission
    } = this.props;

    const { displayOptionsIsOpen } = this.state;
    return (
      <Row>
        <Colxx xxs='12'>
          {/*  */}
          <div className='mb-2'>
            <h1>
              <IntlMessages id={heading} />
            </h1>

            {havePermission && (
              <div className='text-zero top-right-button-container'>
                <Button
                  color='primary'
                  size='lg'
                  className='top-right-button'
                  onClick={() => toggleModal()}
                >
                  <IntlMessages id='pages.add-new' />
                </Button>
                {'  '}
              </div>
            )}
            <Breadcrumb match={match} />
          </div>
          {/* Page size, search and order list */}
          <div className='mb-2'>
            <Button
              color='empty'
              className='pt-0 pl-0 d-inline-block d-md-none'
              onClick={this.toggleDisplayOptions}
            >
              <IntlMessages id='pages.display-options' />{' '}
              <i className='simple-icon-arrow-down align-middle' />
            </Button>
            <Collapse
              isOpen={displayOptionsIsOpen}
              className='d-md-block'
              id='displayOptions'
            >
              <div className='d-block d-md-inline-block pt-1'>
                <UncontrolledDropdown className='mr-1 float-md-left btn-group mb-1'>
                  <DropdownToggle caret color='outline-dark' size='xs'>
                    <IntlMessages id='pages.orderby' />
                    {selectedOrderOption.label}
                  </DropdownToggle>
                  <DropdownMenu>
                    {orderOptions.map((order, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => changeOrderBy(order.column)}
                        >
                          {order.label}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <div className='search-sm d-inline-block float-md-left mr-1 mb-1 align-top'>
                  <input
                    type='text'
                    name='keyword'
                    id='search'
                    placeholder={messages['menu.search']}
                    onChange={e => onSearchKey(e)}
                    onKeyPress={e => onSearchKey(e)}
                  />
                </div>
              </div>
              <div className='float-md-right pt-1'>
                <span className='text-muted text-small mr-1'>{`${startIndex}-${endIndex} of ${totalItemCount} `}</span>
                <UncontrolledDropdown className='d-inline-block'>
                  <DropdownToggle caret color='outline-dark' size='xs'>
                    {selectedPageSize}
                  </DropdownToggle>
                  <DropdownMenu right>
                    {pageSizes.map((size, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => changePageSize(size)}
                        >
                          {size}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </Collapse>
          </div>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
    );
  }
}

export default injectIntl(ListPageHeading);
