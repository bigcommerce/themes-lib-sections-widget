const { Pool } = require('pg');

const pool = new Pool();

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

/**
 * Inserts row into a table in database
 *
 * @param {string} table
 * @param {array} keys
 * @param {array} values
 *
 */
insert = async (table, keys, values) => {
  const client = await pool.connect();
  const valueParams = [];
  for (var i = 0; i < values.length; i++) {
    valueParams.push(`$${i+1}`);
  }

  try {
    const text =
      `INSERT INTO ${table}(${keys.toString()}) VALUES(${valueParams.toString()}) RETURNING *`;

    const res = await client.query(text, values);
    return res.rows[0];
  } catch(err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}

/**
 * Removes row from a table in database
 * Note: For these purposes we are working with a simple condition
 *
 * @param {string} table
 * @param {string} key
 * @param {string} value
 *
 */
remove = async (table, key, value) => {
  const client = await pool.connect();

  try {
    const text = `DELETE FROM ${table} WHERE ${key} = $1`;
    const values = [value];

    await client.query(text, valuess);
  } catch(err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}

exports.insert = insert;
exports.remove = remove;
