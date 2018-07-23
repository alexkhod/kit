import COMMENTS_QUERY_CLIENT from '../graphql/CommentsQuery.client.graphql';

const TYPE_NAME = 'CommentsState';
const TYPE_NAME_COMMENTS = 'Comments';

const defaults = {
  comments: {
    id: null,
    content: '',
    __typename: TYPE_NAME_COMMENTS
  },
  __typename: TYPE_NAME
};

const resolvers = {
  Query: {
    commentsState: (_, args, { cache }) => {
      const {
        comments: { comments }
      } = cache.readQuery({ query: COMMENTS_QUERY_CLIENT });
      return {
        comments: {
          ...comments,
          __typename: TYPE_NAME_COMMENTS
        },
        __typename: TYPE_NAME
      };
    }
  },
  Mutation: {
    onCommentsSelect: async (_, { comments }, { cache }) => {
      await cache.writeData({
        data: {
          comments: {
            ...comments,
            __typename: TYPE_NAME_COMMENTS
          },
          __typename: TYPE_NAME
        }
      });

      return null;
    }
  }
};

export default {
  defaults,
  resolvers
};
