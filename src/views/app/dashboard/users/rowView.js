import React from 'react';
import { Card, Badge } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../../../components/common/CustomBootstrap';

import Moment from 'moment';

const RowView = ({ item, createdAt, isActive, filter = ['id', 'name'] }) => {
  return (
    <Colxx xxs='12' className='mb-3'>
      <ContextMenuTrigger id='menu_id' data={item.id}>
        <Card className='d-flex flex-row' style={{ borderRadius: '15px' }}>
          <div className='pl-2 d-flex flex-grow-1 min-width-zero'>
            <div className='card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center'>
              <NavLink
                to={`/app/dashboard/users/account/${item.identificator}`}
                className='w-25 w-sm-75'
              >
                <p className='list-item-heading mb-1 truncate'>
                  {item.identificator}
                </p>
              </NavLink>
              {Object.keys(item)
                .filter(k => !filter.includes(k))
                .map((key, index) => (
                  <p
                    key={index}
                    className='mb-1 text-muted text-small w-15 w-sm-75'
                  >
                    {item[key]}
                  </p>
                ))}
              <div className='mb-1 text-muted text-small w-15 w-sm-75'>
                {
                  <Badge
                    color={item.isMailConfirmed ? 'primary' : 'danger'}
                    pill
                  >
                    {item.isMailConfirmed ? 'Active' : 'Inactive'}
                  </Badge>
                }
              </div>
              <div className='mb-1 text-muted w-15 w-sm-75'>
                {
                  <Badge color={isActive ? 'primary' : 'danger'} pill>
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                }
              </div>

              {createdAt && (
                <p className='mb-1 text-muted text-small w-15 w-sm-100'>
                  {Moment(createdAt).format('DD-MM-YYYY')}
                </p>
              )}
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(RowView);
