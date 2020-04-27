const { Pool } = require('pg');

const pool = new Pool();

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

/**
 * Retrieves a row from a table in database
 *
 * @param {string} table
 * @param {array/string} keys - string if there is only one
 * @param {array/string} values - string if there is only one
 * @param {int} numConditions [1]
 *
 */

retrieve = async (table, keys, values, numConditions = 1) => {
  const client = await pool.connect();

  try {
    let text = `SELECT * FROM ${table} WHERE `;

    if (numConditions === 1) {
      text += `${keys} = $1`;
      values = [values];
    } else {
      text += '(';
      keys.forEach((key, index) => {
        text = `${text} ${key} = $${index+1}`;

        if (index !== keys.length - 1){
          text = `${text} AND `;
        }
      });
      text += ')';
    }
    const res = await client.query(text, values);

    return res.rows;
  } catch(err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}

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

    await client.query(text, values);
  } catch(err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}

exports.insert = insert;
exports.remove = remove;
exports.retrieve = retrieve;
