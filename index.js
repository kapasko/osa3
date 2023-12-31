const express = require("express")
const app = express()
const morgan = require("morgan")

morgan.token("body", (request, response) => {
    return JSON.stringify(request.body)
})

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(express.static("build"))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
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
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get("/info", (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</br></br>${date.toString()}</p>`)
})

app.delete("/api/persons/:id", (request, response) => {
    //console.log(response.params.id)
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    const names = persons.map(person => person.name)

    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })
    } else if (names.includes(body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: Math.floor(Math.random() * 9999),
        name: body.name,
        number: body.number
    }

    persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})