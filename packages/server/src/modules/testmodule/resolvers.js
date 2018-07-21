import { withFilter } from 'graphql-subscriptions';
import { createBatchResolver } from 'graphql-resolve-batch';

const ZVER_SUBSCRIPTION = 'zver_subscription';
const ZVERS_SUBSCRIPTION = 'zvers_subscription';
const BLOCK_SUBSCRIPTION = 'block_subscription';

export default pubsub => ({
  Query: {
    async zvers(obj, { limit, after }, context) {
      let edgesArray = [];
      let zvers = await context.Zver.zversPagination(limit, after);

      zvers.map((zver, index) => {
        edgesArray.push({
          cursor: after + index,
          node: zver
        });
      });
      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;
      const total = (await context.Zver.getTotal()).count;
      const hasNextPage = total > after + limit;
      return {
        totalCount: total,
        edges: edgesArray,
        pageInfo: {
          endCursor: endCursor,
          hasNextPage: hasNextPage
        }
      };
    },
    zver(obj, { id }, context) {
      return context.Zver.zver(id);
    }
  },
  Zver: {
    blocks: createBatchResolver((sources, args, context) => {
      return context.Zver.getBlocksForZverIds(sources.map(({ id }) => id));
    })
  },
  Mutation: {
    async addZver(obj, { input }, context) {
      const [id] = await context.Zver.addZver(input);
      const zver = await context.Zver.zver(id);
      // publish for zver list
      pubsub.publish(ZVERS_SUBSCRIPTION, {
        zversUpdated: {
          mutation: 'CREATED',
          id,
          node: zver
        }
      });
      return zver;
    },
    async deleteZver(obj, { id }, context) {
      const zver = await context.Zver.zver(id);
      const isDeleted = await context.Zver.deleteZver(id);
      if (isDeleted) {
        // publish for zver list
        pubsub.publish(ZVERS_SUBSCRIPTION, {
          zversUpdated: {
            mutation: 'DELETED',
            id,
            node: zver
          }
        });
        // publish for edit zver page
        pubsub.publish(ZVER_SUBSCRIPTION, {
          zverUpdated: {
            mutation: 'DELETED',
            id,
            node: zver
          }
        });
        return { id: zver.id };
      } else {
        return { id: null };
      }
    },
    async editZver(obj, { input }, context) {
      await context.Zver.editZver(input);
      const zver = await context.Zver.zver(input.id);
      // publish for zver list
      pubsub.publish(ZVERS_SUBSCRIPTION, {
        zversUpdated: {
          mutation: 'UPDATED',
          id: zver.id,
          node: zver
        }
      });
      // publish for edit zver page
      pubsub.publish(ZVER_SUBSCRIPTION, {
        zverUpdated: {
          mutation: 'UPDATED',
          id: zver.id,
          node: zver
        }
      });
      return zver;
    },
    async addBlock(obj, { input }, context) {
      const [id] = await context.Zver.addBlock(input);
      const block = await context.Zver.getBlock(id);
      // publish for edit zver page
      pubsub.publish(BLOCK_SUBSCRIPTION, {
        blockUpdated: {
          mutation: 'CREATED',
          id: block.id,
          zverId: input.zverId,
          node: block
        }
      });
      return block;
    },
    async deleteBlock(
      obj,
      {
        input: { id, zverId }
      },
      context
    ) {
      await context.Zver.deleteBlock(id);
      // publish for edit zver page
      pubsub.publish(BLOCK_SUBSCRIPTION, {
        blockUpdated: {
          mutation: 'DELETED',
          id,
          zverId,
          node: null
        }
      });
      return { id };
    },
    async editBlock(obj, { input }, context) {
      await context.Zver.editBlock(input);
      const block = await context.Zver.getBlock(input.id);
      // publish for edit zver page
      pubsub.publish(BLOCK_SUBSCRIPTION, {
        blockUpdated: {
          mutation: 'UPDATED',
          id: input.id,
          zverId: input.zverId,
          node: block
        }
      });
      return block;
    }
  },
  Subscription: {
    zverUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(ZVER_SUBSCRIPTION),
        (payload, variables) => {
          return payload.zverUpdated.id === variables.id;
        }
      )
    },
    zversUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(ZVERS_SUBSCRIPTION),
        (payload, variables) => {
          return variables.endCursor <= payload.zversUpdated.id;
        }
      )
    },
    blockUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(BLOCK_SUBSCRIPTION),
        (payload, variables) => {
          return payload.blockUpdated.zverId === variables.zverId;
        }
      )
    }
  }
});
