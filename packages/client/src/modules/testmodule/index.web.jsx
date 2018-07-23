import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import translate from '../../i18n';
import { MenuItem } from '../../modules/common/components/web';
import Zver from './containers/Zver';
//import ZverEdit from './containers/ZverEdit';
//import ZverAdd from './containers/ZverAdd';
import resources from './locales';
import resolvers from './resolvers';
import Feature from '../connector';

const NavLinkWithI18n = translate()(({ t }) => (
  <NavLink to="/zvers" className="nav-link" activeClassName="active">
    {t('zver:navLink')}
  </NavLink>
));

export default new Feature({
  route: [<Route exact path="/zvers" component={Zver} />],
  navItem: (
    <MenuItem key="/zvers">
      <NavLinkWithI18n />
    </MenuItem>
  ),
  resolver: resolvers,
  localization: { ns: 'zver', resources }
});
