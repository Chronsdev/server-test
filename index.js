require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./Models/person')

const app = express()

app.use(express.json())
app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
 
app.use(requestLogger)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.get('/', (req, res) =>{
	res.send('<h1>This is a app</h1>')
})

app.get('/api/persons', (req, res) =>{
	Person.find({}).then(pers =>{
		res.json(pers)
	})
})

app.get('/info', (req, res)=>{
	const pers = Person.length
	const date = new Date()
	res.send(`<h1>Phonebook has info for ${pers} peopke</h1>
		<h3>${date}</h3>`)
})

app.get('/api/persons/:id', (req, res, next)=>{
	Person.findById(req.params.id)
	.then(note =>{
      if (note) {
        res.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next)=>{
	const body = req.body

	const person = new Person({
			content: body.name,
			date: new Date(),
			important: body.important || false,
		})

	person.save().then(personSaved =>{
		res.json(personSaved)
		console.log(personSaved)
	})
	.catch(error => next(error))
	
}) 
   
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
      Person.filter(fill => fill.id !== result)
    })
    .catch(error => next(error))
})


const PORT = process.env.PORT
app.listen(PORT, ()=>{
	console.log(`The server start running in port ${PORT}`)
})