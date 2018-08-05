import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import ModuleEditView from '../components/ModuleEditView';

import MODULE_QUERY from '../graphql/ModuleQuery.graphql';
import EDIT_MODULE from '../graphql/EditModule.graphql';
import MODULE_SUBSCRIPTION from '../graphql/ModuleSubscription.graphql';

class ModuleEdit extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    module: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired,
    history: PropTypes.object,
    navigation: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.initModuleEditSubscription();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      let prevModuleId = prevProps.module ? prevProps.module.id : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevModuleId !== this.props.module.id) {
        this.subscription();
        this.subscription = null;
      }
      this.initModuleEditSubscription();
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initModuleEditSubscription() {
    if (!this.subscription && this.props.module) {
      this.subscribeToModuleEdit(this.props.module.id);
    }
  }

  subscribeToModuleEdit = moduleId => {
    const { subscribeToMore, history, navigation } = this.props;

    this.subscription = subscribeToMore({
      document: MODULE_SUBSCRIPTION,
      variables: { id: moduleId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              moduleUpdated: { mutation }
            }
          }
        }
      ) => {
        if (mutation === 'DELETED') {
          if (history) {
            return history.push('/modules');
          } else if (navigation) {
            return navigation.goBack();
          }
        }
        return prev;
      }
    });
  };

  render() {
    return <ModuleEditView {...this.props} />;
  }
}

export default compose(
  graphql(MODULE_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id }
      };
    },
    props({ data: { loading, error, module, subscribeToMore } }) {
      if (error) throw new Error(error);
      return { loading, module, subscribeToMore };
    }
  }),
  graphql(EDIT_MODULE, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      editModule: async (id, title, content) => {
        await mutate({
          variables: { input: { id, title: title.trim(), content: content.trim() } }
        });
        if (history) {
          return history.push('/modules');
        }
        if (navigation) {
          return navigation.navigate('ModuleList');
        }
      }
    })
  })
)(ModuleEdit);
