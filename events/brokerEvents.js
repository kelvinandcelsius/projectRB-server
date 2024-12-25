import eventBus from './eventBus.js'
import Broker from '../models/Broker.model.js'

eventBus.on('companiesSelected', async ({ selectedCompanies, quoteId }) => {
    try {
        await Broker.updateMany(
            { insuranceCompany: { $in: selectedCompanies } },
            { $push: { incomingQuotes: quoteId } }
        )
        eventBus.emit('brokersUpdated', { quoteId })
    } catch (error) {
        console.error('Error updating brokers:', error)
    }
})