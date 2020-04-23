const { Pool } = require('pg');

const pool = new Pool();

insertStores = async (hash, access_token, scope) => {
  const client = await pool.connect();

  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  try {
    const text = 'INSERT INTO stores(hash, access_token, scope) VALUES($1, $2, $3) RETURNING *';
    const values = [hash, access_token, scope];

    const res = await client.query(text, values)
    console.log(res.rows[0])
  } catch(err) {
    console.log(err.stack);
  } finally {
    client.release(); //todo: this goes in new file
  }
}

exports.insertStores = insertStores;
