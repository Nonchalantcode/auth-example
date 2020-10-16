const CONNECTION_URL = process.env.MONGO_URL
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true})
    .then(response => {
	console.log(`Connected to MongoDB`)
    })
    .catch(error => {
	console.log(error.message)
    })

const userSchema = new mongoose.Schema({
    username: {
	type: String,
	unique: true,
	required: true
    },
    passwordhash: {
	type: String,
	required: true
    }
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
	returnedObject.id = returnedObject._id.toString()
	delete returnedObject._id
	delete returnedObject.__v
	delete returnedObject.passwordHash
    }
})

// instances of models are 'documents'

const User = mongoose.model('User', userSchema)

module.exports = User
