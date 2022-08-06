const { v4: uuidv4 } = require('uuid')

let user = class User {
    
    constructor(){
        this.created = Date.now(),
        this.id = uuidv4(),
        this.name = {
            firstname: null,
            lastname: null
        }
        this.email = null
        this.passwordHash = null
    }
}

module.exports = user