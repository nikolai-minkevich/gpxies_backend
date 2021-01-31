const { escape } = require('mysql2');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
//const Role = require('../utils/userRoles.utils');
const Type = require('../utils/trackTypes.utils');

class TrackModel {
  tableName = 'track';

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    // return back the first row
    return result[0];
  };
  // 	id	user	hashString	title	type	distance	created
  create = async ({ user, hashString, title, type = Type.Other, distance = 0, description = '', isPrivate = false }) => {
    const sql = `INSERT INTO ${this.tableName}
        (user, hashString, title, type, distance, description, isPrivate ) VALUES (?,?,?,?,?,?,?)`;

    const result = await query(sql, [user, hashString, title, type, distance, description, isPrivate]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  deleteMultiple = async (records) => {
    const result = await query(
      `DELETE FROM ${this.tableName}
    WHERE id IN (${records.join(',')})`
    );

    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new TrackModel();
