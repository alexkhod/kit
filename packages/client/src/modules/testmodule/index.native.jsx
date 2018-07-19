import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import Testmodule from './containers/Testmodule';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  tabItem: {
    Testmodule: {
      screen: Testmodule,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { testmodule: reducers }
});
