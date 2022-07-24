const Pool = require('pg').Pool

const pool = new Pool({
  user: 'webAccess',
  host: 'localhost',
  database: 'loginInfo',
  password: 'test',
  port: 5432,
})

module.exports = pool