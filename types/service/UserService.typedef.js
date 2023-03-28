/**
 * @typedef {Object} DBUsers
 * @property {String} user_id_follower
 * @property {String} user_id_followed
 * @property {String} user_id
 * @property {String} human_id
 * @property {String} country_code
 * @property {String} username
 * @property {String} real_name
 * @property {String} created_at
 * @property {String} updated_at
 * @property {String} last_active_at
 * @property {String} status
 * @property {String} profile_pic_path
 * @property {String} profile_pic_asset_id
 * @property {String} profile_pic_public_id
 * @property {String} bio
 * @property {String} follow_action_id
 * @property {Number} [viewtype]
 */

/**
 * @typedef {Object} UserSearchChatApiResponse
 * @property {Boolean} success
 * @property {String} message
 * @property {DBUsers[]} followed
 * @property {DBUsers[]} moreUsers
 */

exports.unused = {};
