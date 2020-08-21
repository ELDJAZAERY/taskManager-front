import React from 'react';
import { Card } from 'reactstrap';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../../../components/common/CustomBootstrap';

const HeaderList = ({ title = '', item = {} }) => {
  return (
    <Colxx xxs='12' className='mb-3'>
      <ContextMenuTrigger id='menu_id' data={item.id}>
        <Card className='d-flex flex-row' style={{ borderRadius: '15px' }}>
          <div className='pl-2 d-flex flex-grow-1 min-width-zero'>
            <div className='card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center'>
              <p className='list-item-heading mb-1 truncate w-20 w-sm-75'>
                {title}
              </p>
              <p className='list-item-heading mb-1 truncate w-15 w-sm-100'>
                E-mail
              </p>
              {Object.keys(item).map((key, index) => (
                <p
                  key={index}
                  className='w-10 w-sm-100 truncate list-item-heading'
                >
                  {item[key]}
                </p>
              ))}
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(HeaderList);
