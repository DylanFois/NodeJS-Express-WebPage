const Pool = require('pg').Pool
const pool = new Pool({
  user: 'webAccess',
  host: 'localhost',
  database: 'loginInfo',
  password: 'test',
  port: 5432,
})
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { id, firstname, lastname, email, passhash, salt } = request.body

  pool.query('INSERT INTO users (id, firstname, lastname, email, passhash, salt) VALUES ($1, $2, $3, $4, $5, $6)', [id, firstname, lastname, email, passhash, salt], (error, results) => {
    if (error) {
      throw error
    }
    console.log("Added user with ID: " + id)
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { firstname, email } = request.body

  pool.query(
    'UPDATE users SET firstname = $1, email = $2 WHERE id = $3',
    [firstname, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}