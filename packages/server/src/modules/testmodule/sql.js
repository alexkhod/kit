import { returnId, orderedFor } from '../../sql/helpers';
import knex from '../../sql/connector';

export default class Zver {
  zversPagination(limit, after) {
    return knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at')
      .from('zvers')
      .orderBy('id', 'asc')
      .limit(limit)
      .offset(after);
  }

  async getBlocksForZverIds(zverIds) {
    const res = await knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at', 'zver_id AS zverId')
      .from('blocks')
      .whereIn('zver_id', zverIds);

    return orderedFor(res, zverIds, 'zverId', false);
  }

  async getModulesForBlockIds(blockIds) {
    const res = await knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at', 'block_id AS blockId')
      .from('modules')
      .whereIn('block_id', blockIds);

    return orderedFor(res, blockIds, 'blockId', false);
  }

  async getCommentsForZverIds(zverIds) {
    const res = await knex
      .select('id', 'content', 'created_at', 'updated_at', 'zver_id AS zverId')
      .from('comments')
      .whereIn('zver_id', zverIds);

    return orderedFor(res, zverIds, 'zverId', false);
  }

  async getCommentsForBlockIds(blockIds) {
    const res = await knex
      .select('id', 'content', 'created_at', 'updated_at', 'block_id AS blockId')
      .from('comments')
      .whereIn('block_id', blockIds);

    return orderedFor(res, blockIds, 'blockId', false);
  }

  async getCommentsForModuleIds(moduleIds) {
    const res = await knex
      .select('id', 'content', 'created_at', 'updated_at', 'module_id AS moduleId')
      .from('comments')
      .whereIn('module_id', moduleIds);

    return orderedFor(res, moduleIds, 'moduleId', false);
  }

  getTotal() {
    return knex('zvers')
      .countDistinct('id as count')
      .first();
  }

  zvers(id) {
    return knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at')
      .from('zvers')
      .where('id', '=', id)
      .first();
  }

  addZver({ inv, isWork }) {
    return returnId(knex('zvers')).insert({ inv, isWork });
  }

  deleteZver(id) {
    return knex('zvers')
      .where('id', '=', id)
      .del();
  }

  editZver({ id, inv, isWork }) {
    return knex('zvers')
      .where('id', '=', id)
      .update({
        inv: inv,
        isWork: isWork
      });
  }

  addBlock({ inv, isWork, zverId }) {
    return returnId(knex('blocks')).insert({ inv, isWork, zver_id: zverId });
  }

  getBlock(id) {
    return knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at')
      .from('blocks')
      .where('id', '=', id)
      .first();
  }

  deleteBlock(id) {
    return knex('blocks')
      .where('id', '=', id)
      .del();
  }

  editBlock({ id, inv, isWork }) {
    return knex('blocks')
      .where('id', '=', id)
      .update({
        inv: inv,
        isWork: isWork
      });
  }

  addModule({ inv, isWork, blockId }) {
    return returnId(knex('modules')).insert({ inv, isWork, block_id: blockId });
  }

  getModule(id) {
    return knex
      .select('id', 'inv', 'isWork', 'created_at', 'updated_at')
      .from('modules')
      .where('id', '=', id)
      .first();
  }

  deleteModule(id) {
    return knex('modules')
      .where('id', '=', id)
      .del();
  }

  editModule({ id, inv, isWork }) {
    return knex('modules')
      .where('id', '=', id)
      .update({
        inv: inv,
        isWork: isWork
      });
  }

  addCommentsOnZver({ content, zverId }) {
    return returnId(knex('comments')).insert({ content, zver_id: zverId });
  }

  addCommentsOnBlock({ content, blockId }) {
    return returnId(knex('comments')).insert({ content, block_id: blockId });
  }

  addCommentsOnModule({ content, moduleId }) {
    return returnId(knex('comments')).insert({ content, module_id: moduleId });
  }

  getComments(id) {
    return knex
      .select('id', 'content', 'created_at', 'updated_at')
      .from('comments')
      .where('id', '=', id)
      .first();
  }

  deleteComments(id) {
    return knex('comments')
      .where('id', '=', id)
      .del();
  }

  editComments({ id, content }) {
    return knex('comments')
      .where('id', '=', id)
      .update({
        content: content
      });
  }
}
