import { returnId, truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['zvers', 'blocks', 'modules', 'comments']);

  await Promise.all(
    [...Array(3).keys()].map(async ii => {
      const zvers = await returnId(knex('zvers')).insert({
        inv: `${ii + 1}`,
        isWork: true
      });
      await returnId(knex('comments')).insert({
        zver_id: `${zvers[0]}`,
        content: 'Работает'
      });

      await Promise.all(
        [...Array(16).keys()].map(async jj => {
          const blocks = await returnId(knex('blocks')).insert({
            zver_id: zvers[0],
            inv: `${ii + 1}-${jj + 1}`,
            isWork: true
          });
          await returnId(knex('comments')).insert({
            block_id: `${blocks[0]}`,
            content: 'Работает'
          });

          await Promise.all(
            [...Array(3).keys()].map(async kk => {
              const modules = await returnId(knex('modules')).insert({
                block_id: blocks[0],
                inv: `${ii + 1}-${jj + 1}-${kk + 1}`,
                isWork: true
              });
              return returnId(knex('comments')).insert({
                module_id: `${modules[0]}`,
                content: 'Работает'
              });
            })
          );
        })
      );
    })
  );
}
