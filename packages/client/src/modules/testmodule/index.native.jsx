import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import translate from '../../i18n';
import { Button, HeaderTitle, IconButton, primary } from '../common/components/native';

import Zver from './containers/Zver';
import ZverEdit from './containers/ZverEdit';
import ZverAdd from './containers/ZverAdd';

import resources from './locales';
import resolvers from './resolvers';

import Feature from '../connector';

const withI18N = (Component, props) => {
  const WithI18N = translate('zver')(Component);
  return <WithI18N {...props} />;
};

const ZverListHeaderRight = ({ navigation, t }) => {
  return (
    <View style={styles.addButtonContainer}>
      <Button style={styles.addButton} size="small" type={primary} onPress={() => navigation.navigate('ZverAdd')}>
        {t('list.btn.add')}
      </Button>
    </View>
  );
};
ZverListHeaderRight.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

class ZverListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(HeaderTitle, { style: 'subTitle', i18nKey: 'list.subTitle' }),
    headerRight: withI18N(ZverListHeaderRight, { navigation }),
    headerLeft: (
      <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
    ),
    headerStyle: styles.header
  });

  render() {
    return <Zver navigation={this.props.navigation} />;
  }
}

ZverListScreen.propTypes = {
  navigation: PropTypes.object
};

const ZverEditTitle = ({ t }) => (
  <Text style={styles.subTitle}>
    {t(`zver.label.edit`)} {t('zver.label.zver')}
  </Text>
);
ZverEditTitle.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

const ZverAddTitle = ({ t }) => (
  <Text style={styles.subTitle}>
    {t('zver.label.create')} {t('zver.label.zver')}
  </Text>
);
ZverAddTitle.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

class ZverEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(ZverEditTitle, { navigation }),
    headerStyle: styles.header
  });

  render() {
    return <ZverEdit navigation={this.props.navigation} />;
  }
}
ZverEditScreen.propTypes = {
  navigation: PropTypes.object
};

class ZverAddScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(ZverAddTitle, { navigation }),
    headerStyle: styles.header
  });

  render() {
    return <ZverAdd navigation={this.props.navigation} />;
  }
}

ZverAddScreen.propTypes = {
  navigation: PropTypes.object
};

const ZverNavigator = createStackNavigator({
  ZverList: { screen: ZverListScreen },
  ZverEdit: { screen: ZverEditScreen },
  ZverAdd: { screen: ZverAddScreen }
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff'
  },
  subTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  addButton: {
    height: 32,
    width: 60
  }
});

export default new Feature({
  drawerItem: {
    Zver: {
      screen: ZverNavigator,
      navigationOptions: {
        drawerLabel: withI18N(HeaderTitle, { i18nKey: 'list.title' })
      }
    }
  },
  resolver: resolvers,
  localization: { ns: 'zver', resources }
});
