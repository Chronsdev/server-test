import express from 'express'
import cors from 'cors'

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

app.get('/', (req, res) =>{
	res.send('<h1>This is a app</h1>')
})

let persons = [
 {
	id: 1,
	name: "Arto Helias",
	number: "040-123456"
 },
 {
	id: 2,
	name: "Ada Lovelace",
	number: "39-44-5323523"
 },
 {
	id: 3,
	name: "Dan Abramov",
	number: "12-43-234345"
 },
 {
	id: 4,
	name: "Mary Poppondick",
	number: "39-23-6423122"
 }
]

app.get('/api/persons', (req, res) =>{
	res.json(persons)
})

app.get('/info', (req, res)=>{
	const pers = persons.length
	const date = new Date()
	res.send(`<h1>Phonebook has info for ${pers} peopke</h1>
		<h3>${date}</h3>`)
})

app.get('/api/persons/:id', (req, res)=>{
	const id = Number(req.params.id)
	const person = persons.find(n => n.id === id)

	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}	 
})

const numbRandom = () =>{
	const random = Math.round(Math.random()*100)
	return random
}

app.post('/api/persons', (req, res)=>{
	const body = req.body

	const person = {
		id: numbRandom(),
		name: body.name,
		number: body.number
	}

	const names = persons.find(p => p.name === person.name)

	if (person.name == false || person.number == false) {
		return res.status(400).json({
			error: "name or number missing"
		})
	} else if (names){
		return res.status(400).json({
			error: "name are equal"
		})
	} else{
		persons = persons.concat(person)
	    res.json(person)
	}

	
}) 
   
app.delete('/api/persons/:id', (req, res)=>{
	const id = Number(req.params.id)
	persons = persons.filter(n => n.id !== id)

	res.status(204).end()
})



const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
	console.log(`The server start running in port ${PORT}`)
})