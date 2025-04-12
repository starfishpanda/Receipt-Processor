import express from 'express'

const apiRouter = express.Router()

apiRouter.post('/receipts/process')

apiRouter.get('/receipts/{id}/points')


export default apiRouter