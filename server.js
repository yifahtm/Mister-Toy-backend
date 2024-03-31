import path from 'path'
import cors from 'cors'

import express from 'express'

import { loggerService } from './services/logger.service.js'
import { toyService } from './services/toy.service.js'

const app = express()

app.use(express.json())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:3030',
            'http://localhost:3030',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ],
        credentials: true,
    }
    app.use(cors(corsOptions))
}

// GET TOYS
app.get('/api/toy', (req, res) => {
    const { filterBy: receivedFilter, sortBy } = req.query

    const filterBy = {
        name: receivedFilter?.name || '',
        inStock: receivedFilter?.inStock || null,
        labels: receivedFilter?.labels || [],
        maxPrice: +receivedFilter?.maxPrice || 0,
    }

    toyService
        .query(filterBy, sortBy)
        .then(toys => {
            res.send(toys)
        })
        .catch(err => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

// GET TOY
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params

    toyService
        .getById(toyId)
        .then(toy => {
            toy.msgs = ['Hello', `I\'m ${toy.name}`, 'How are you?']

            toyService.save(toy).then(savedToy => res.send(savedToy))
        })
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

// REMOVE TOY
app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params

    toyService
        .remove(toyId)
        .then(() => {
            loggerService.info(`Toy ${toyId} removed`)
            res.send('Removed!')
        })
        .catch(err => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })
})

// CREATE TOY
app.post('/api/toy', (req, res) => {
    const toy = {
        name: req.body.name,
        price: +req.body.price,
        inStock: req.body.inStock,
    }

    toyService
        .save(toy)
        .then(savedToy => {
            res.send(savedToy)
        })
        .catch(err => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

// UPDATE TOY
app.put('/api/toy', (req, res) => {
    const car = {
        _id: req.body._id,
        name: req.body.name,
        price: +req.body.price,
        inStock: req.body.inStock,
    }

    toyService
        .save(car)
        .then(savedToy => {
            res.send(savedToy)
        })
        .catch(err => {
            loggerService.error('Cannot update car', err)
            res.status(400).send('Cannot update car')
        })
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))





// import express from 'express'
// import cookieParser from 'cookie-parser'
// import cors from 'cors'
// import path, { dirname } from 'path'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// import { logger } from './services/logger.service.js'
// logger.info('server.js loaded...')

// const app = express()

// // Express App Config
// app.use(cookieParser())
// app.use(express.json())
// app.use(express.static('public'))

// if (process.env.NODE_ENV === 'production') {
//     // Express serve static files on production environment
//     app.use(express.static(path.resolve(__dirname, 'public')))
//     console.log('__dirname: ', __dirname)
// } else {
//     // Configuring CORS
//     const corsOptions = {
//         // Make sure origin contains the url your frontend is running on
//         origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:3030', 'http://localhost:3030'],
//         credentials: true
//     }
//     app.use(cors(corsOptions))
// }

// import { authRoutes } from './api/auth/auth.routes.js'
// import { userRoutes } from './api/user/user.routes.js'
// import { toyRoutes } from './api/toy/toy.routes.js'

// // routes
// app.use('/api/auth', authRoutes)
// app.use('/api/user', userRoutes)
// app.use('/api/toy', toyRoutes)

// // Make every unmatched server-side-route fall back to index.html
// // So when requesting http://localhost:3030/index.html/car/123 it will still respond with
// // our SPA (single page app) (the index.html file) and allow vue-router to take it from there

// app.get('/**', (req, res) => {
//     res.sendFile(path.resolve('public/index.html'))
// })

// const port = process.env.PORT || 3030

// app.listen(port, () => {
//     logger.info(`Server is running on port:  http://127.0.0.1:${port}/`)
// })