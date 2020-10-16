require('dotenv').config()

const express = require('express')
const app = express()
const User = require('./mongo.js')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

app.use(express.json())

app.get('/', (_, res) => res.send('Bounjour bitches'))


/******************************
  Create a new user
******************************/

app.post('/api/user', async (req, res) => {
    const body = req.body
    const rounds = 10
    try {
	const hash = await bcrypt.hash(body.password, rounds)
	const user = await new User({username: body.username, passwordhash: hash}).save()
	res.json(user)
    } catch(error) {
	console.log(error.message)
	res.json({error: true, message: error.message})
    }
})

/******************************
 Authenticate the user
******************************/

app.post('/api/login', async (req, res) => {
    const body = req.body
    const user = await User.findOne({ username: body.username})
    if(user) {
	let match = await bcrypt.compare(body.password, user.passwordhash)
	if(match) {
	    const token = JWT.sign({username: user.username, id: user._id}, process.env.SECRET)
	    res.json({ token, username: user.username })
	}
    } else {
	res.status(401).send({error: 'wrong username or password'})
    }
    res.end()
})
    

app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`)
})
