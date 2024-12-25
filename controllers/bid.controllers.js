import mongoose from 'mongoose'
import Bid from '../models/Bid.model.js'
import Broker from '../models/Broker.model.js'
import QuoteRequest from '../models/QuoteRequest.model.js'
import eventBus from '../events/eventBus.js'

const createBid = async (req, res) => {

    const session = await mongoose.startSession()
    const { owner, lead, offerPrice, message, quoteRequestId } = req.body

    try {
        session.startTransaction()
        const createdBid = await Bid.create({ owner, lead, offerPrice, message })

        await Broker.findByIdAndUpdate(owner, { $push: { bids: createdBid._id } }, { session })

        await QuoteRequest.findByIdAndUpdate(quoteRequestId, { $push: { receivedBids: createdBid._id } }, { session })

        await session.commitTransaction()

        //Add notifications
        // eventBus.emit('bidCreated', { bidId: createdBid._id, /* etc */ })

        res.status(201).json({ message: 'Bid created and associated successfully' })

    } catch (err) {
        await session.abortTransaction()
        console.error('Error creating bid:', err)
        res.status(500).json({ errorMessage: 'Error creating bid', error: err.message })
    } finally {
        session.endSession()
    }
}

export {
    createBid
}