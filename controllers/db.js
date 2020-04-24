const { Pool } = require('pg');

const pool = new Pool();

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

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

exports.insert = insert;
