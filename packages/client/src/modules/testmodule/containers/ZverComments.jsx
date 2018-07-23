import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import ZverCommentsView from '../components/ZverCommentsView';

import ADD_COMMENT from '../graphql/AddComment.graphql';
import EDIT_COMMENT from '../graphql/EditComment.graphql';
import DELETE_COMMENT from '../graphql/DeleteComment.graphql';
import COMMENT_SUBSCRIPTION from '../graphql/CommentSubscription.graphql';
import ADD_COMMENT_CLIENT from '../graphql/AddComment.client.graphql';
import COMMENT_QUERY_CLIENT from '../graphql/CommentQuery.client.graphql';

function AddComment(prev, node) {
  // ignore if duplicate
  if (prev.zver.comments.some(comment => comment.id === node.id)) {
    return prev;
  }

  const filteredComments = prev.zver.comments.filter(comment => comment.id);
  return update(prev, {
    zver: {
      comments: {
        $set: [...filteredComments, node]
      }
    }
  });
}

function DeleteComment(prev, id) {
  const index = prev.zver.comments.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    zver: {
      comments: {
        $splice: [[index, 1]]
      }
    }
  });
}

class ZverComments extends React.Component {
  static propTypes = {
    zverId: PropTypes.number.isRequired,
    comments: PropTypes.array.isRequired,
    comment: PropTypes.object.isRequired,
    onCommentSelect: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    this.initCommentListSubscription();
  }

  componentDidUpdate(prevProps) {
    let prevZverId = prevProps.zverId || null;
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.zverId !== prevZverId) {
      this.subscription();
      this.subscription = null;
    }
    this.initCommentListSubscription();
  }

  componentWillUnmount() {
    this.props.onCommentSelect({ id: null, content: '' });

    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initCommentListSubscription() {
    if (!this.subscription) {
      this.subscribeToCommentList(this.props.zverId);
    }
  }

  subscribeToCommentList = zverId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: COMMENT_SUBSCRIPTION,
      variables: { zverId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              commentUpdated: { mutation, id, node }
            }
          }
        }
      ) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddComment(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteComment(prev, id);
        }

        return newResult;
      }
    });
  };

  render() {
    return <ZverCommentsView {...this.props} />;
  }
}

const ZverCommentsWithApollo = compose(
  graphql(ADD_COMMENT, {
    props: ({ mutate }) => ({
      addComment: (content, zverId) =>
        mutate({
          variables: { input: { content, zverId } },
          optimisticResponse: {
            __typename: 'Mutation',
            addComment: {
              __typename: 'Comment',
              id: null,
              content: content
            }
          },
          updateQueries: {
            zver: (
              prev,
              {
                mutationResult: {
                  data: { addComment }
                }
              }
            ) => {
              if (prev.zver) {
                return AddComment(prev, addComment);
              }
            }
          }
        })
    })
  }),
  graphql(EDIT_COMMENT, {
    props: ({ ownProps: { zverId }, mutate }) => ({
      editComment: (id, content) =>
        mutate({
          variables: { input: { id, zverId, content } },
          optimisticResponse: {
            __typename: 'Mutation',
            editComment: {
              __typename: 'Comment',
              id: id,
              content: content
            }
          }
        })
    })
  }),
  graphql(DELETE_COMMENT, {
    props: ({ ownProps: { zverId }, mutate }) => ({
      deleteComment: id =>
        mutate({
          variables: { input: { id, zverId } },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteComment: {
              __typename: 'Comment',
              id: id
            }
          },
          updateQueries: {
            zver: (
              prev,
              {
                mutationResult: {
                  data: { deleteComment }
                }
              }
            ) => {
              if (prev.zver) {
                return DeleteComment(prev, deleteComment.id);
              }
            }
          }
        })
    })
  }),
  graphql(ADD_COMMENT_CLIENT, {
    props: ({ mutate }) => ({
      onCommentSelect: comment => {
        mutate({ variables: { comment: comment } });
      }
    })
  }),
  graphql(COMMENT_QUERY_CLIENT, {
    props: ({ data: { comment } }) => ({ comment })
  })
)(ZverComments);

export default ZverCommentsWithApollo;
