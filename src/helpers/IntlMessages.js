import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import '../views/app/styles/g.classes.css';

const InjectMassage = props => (
  <span className='noselect'>
    <FormattedMessage {...props} />
  </span>
);

export default injectIntl(InjectMassage, {
  withRef: false
});
