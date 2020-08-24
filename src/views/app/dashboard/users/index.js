import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { connect } from 'react-redux';

import RowView from './rowView';
import Pagination from '../../../../containers/pages/Pagination';
import ContextMenuContainer from '../../../../containers/pages/ContextMenuContainer';
import ListPageHeading from './list-page';
import { fetchUsers } from '../../../../api/users';
import {
  Separator,
  Colxx
} from '../../../../components/common/CustomBootstrap';
import HeaderList from './header-list';

import { systemNotif } from '../../../../redux/actions';
import { actionsEnum, typesEnum } from '../../../../redux/notifications/enums';

function collect(props) {
  return { data: props.data };
}

class DataListPages extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require('mousetrap');

    this.state = {
      selectedPageSize: 10,
      orderOptions: [
        { column: 'identificator', label: ' Identificator', order: 'ASC' }
      ],
      pageSizes: [5, 10, 15, 20, 30],

      categories: [],

      selectedOrderOption: {
        column: 'identificator',
        label: ' Identificator'
      },
      dropdownSplitOpen: false,
      modalOpen: false,
      currentPage: 1,
      totalItemCount: 2,
      totalPage: 1,
      search: '',
      lastChecked: null,
      loading: true,
      items: props.items
    };
  }

  componentDidMount() {
    this.dataListRender();
    this.mouseTrap.bind(['ctrl+a', 'command+a'], () =>
      this.handleChangeSelectAll(false)
    );
    this.mouseTrap.bind(['ctrl+d', 'command+d'], () => {
      this.setState({
        connectedPartner: null
      });
      return false;
    });
  }

  componentWillUnmount() {
    this.mouseTrap.unbind('ctrl+a');
    this.mouseTrap.unbind('command+a');
    this.mouseTrap.unbind('ctrl+d');
    this.mouseTrap.unbind('command+d');
  }

  async dataListRender() {
    const {
      selectedPageSize,
      currentPage,
      search,
      selectedOrderOption
    } = this.state;

    try {
      const { totalItems, totalPage, items } = await fetchUsers(
        selectedPageSize,
        currentPage,
        search,
        selectedOrderOption.column,
        selectedOrderOption.order
      );

      this.setState({
        totalPage: totalPage === 1 ? 0 : totalPage,
        items,
        totalItemCount: totalItems,
        loading: false
      });
    } catch ({ status, errMessage }) {
      this.props.systemNotif(
        actionsEnum.PUSH,
        typesEnum.ERROR,
        errMessage,
        status
      );
    }
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  changeOrderBy = column => {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          x => x.column === column
        )
      },
      () => this.dataListRender()
    );
  };

  changePageSize = size => {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1
      },
      () => this.dataListRender()
    );
  };

  onChangePage = page => {
    this.setState(
      {
        currentPage: page
      },
      () => this.dataListRender()
    );
  };

  onSearchKey = e => {
    this.setState(
      {
        search: e.target.value
      },
      () => this.dataListRender()
    );
  };

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }

  handleChangeSelectAll = isToggle => {
    if (isToggle) {
      this.props.disconnectPartner();
    }
    document.activeElement.blur();
    return false;
  };

  onContextMenuClick = (e, data, target) => {};

  onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    const items = this.state.items;
    const index = this.getIndex(clickedProductId, items, 'id');
    if (index !== -1 && !this.props.connectedPartner.id === clickedProductId) {
      this.props.connectPartner(items[index]);
    }
    return true;
  };

  havePermission = action => {
    if (action === 'add') return false;
    const { connectedUser = {} } = this.props;
    const { role } = connectedUser;

    return role === 'admin';
  };

  render() {
    const { match, connectedUser } = this.props;

    const {
      currentPage,
      selectedPageSize,
      totalItemCount,
      selectedOrderOption,
      orderOptions,
      pageSizes,
      items,
      loading
    } = this.state;

    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * selectedPageSize;

    return (
      <Fragment>
        <div className='disable-text-selection'>
          <ListPageHeading
            heading='menu.users'
            displayMode='list'
            changeDisplayMode={() => {}}
            handleChangeSelectAll={this.handleChangeSelectAll}
            changeOrderBy={this.changeOrderBy}
            changePageSize={this.changePageSize}
            selectedPageSize={selectedPageSize}
            totalItemCount={totalItemCount}
            selectedOrderOption={selectedOrderOption}
            match={match}
            startIndex={startIndex}
            endIndex={endIndex}
            itemsLength={items ? items.length : 0}
            onSearchKey={this.onSearchKey}
            orderOptions={orderOptions}
            pageSizes={pageSizes}
            toggleModal={this.toggleModal}
            havePermission={this.havePermission()}
          />
          {loading ? (
            <div className='loading' />
          ) : (
            <React.Fragment>
              <Colxx xxs='12'>
                <Row>
                  <HeaderList
                    title={'Identificator'}
                    item={{
                      2: 'Role',
                      3: 'Email status',
                      4: 'Status',
                      5: 'Created At'
                    }}
                  />
                </Row>
                <Separator className='mb-5' />
              </Colxx>
              <Row>
                {items
                  .filter(
                    value => value.identificator !== connectedUser.identificator
                  )
                  .map((item, index) => (
                    <RowView
                      key={index}
                      title={item.identificator}
                      item={item}
                      filter={[
                        'id',
                        'identificator',
                        'isActivated',
                        'updatedAt',
                        'createdAt'
                      ]}
                      createdAt={item.createdAt}
                      isActive={item['isActivated']}
                      onCheckItem={this.onCheckItem}
                      collect={collect}
                    />
                  ))}{' '}
                <Pagination
                  currentPage={this.state.currentPage}
                  totalPage={this.state.totalPage}
                  onChangePage={i => this.onChangePage(i)}
                />
                <ContextMenuContainer
                  onContextMenuClick={this.onContextMenuClick}
                  onContextMenu={this.onContextMenu}
                />
              </Row>
            </React.Fragment>
          )}
        </div>
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
})(DataListPages);
