import Company from '../models/InsuranceCompany.model.js'
import Client from '../models/Client.model.js'
import eventBus from '../events/eventBus.js'

const createCompany = (req, res, next) => {

    if (!req.file) {
        return res.status(500).json({ errorMessage: 'Error uploading company' });
    }

    const { name } = req.body
    const logo = req.file?.path

    Company
        .create({ name, logo })
        .then(
            (createdCompany) => {
                res.status(201).json({
                    company: createdCompany,
                    cloudinary_url: logo
                })
            })
        .catch(err => res.status(500).json({ errorMessage: 'Error creating company', err }))
}

const getAllCompanies = (req, res, next) => {

    Company
        .find()
        .sort({ name: 1 })
        .then(response => res.json(response))
        .catch(err => res.status(500).json({ errorMessage: 'Error getting companies', err }))
}

const addSelectedCompanies = async (req, res, next) => {

    const { clientId, selectedCompanies, quoteId } = req.body
    try {
        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            { $set: { prospectCompanies: selectedCompanies } },
            { new: true }
        )
        eventBus.emit('companiesSelected', { selectedCompanies, quoteId })
        res.json(updatedClient)
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'Error updating client', err })
    }
}

export {
    createCompany,
    getAllCompanies,
    addSelectedCompanies
}