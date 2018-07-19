import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import Testmodule from './containers/Testmodule';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/testmodule" component={Testmodule} />,
  navItem: (
    <MenuItem key="/testmodule">
      <NavLink to="/testmodule" className="nav-link" activeClassName="active">
        Testmodule
      </NavLink>
    </MenuItem>
  ),
  reducer: { testmodule: reducers }
});
