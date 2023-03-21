import Contact from '../models/contact.js';
import content from './content.js';

class ContactController {

	async index(req, res) {
		const contact = await Contact.findAll({
			order: ['id'],
		});
		return res.json(
			content(contact)
		);
	}

	async getById(req, res) {

		const contact = await Contact.findOne({ where: { id: req.params.id,  } });

		return res.status(200).json({
			contact,
		});
	}

	async store(req, res) {
		let data = req.body
		data.active = true
		return res.json(await Contact.create(data));
	}


	async update(req, res) {

		const contact = await Contact.findByPk(req.params.id);

		if (!contact) {
			return res.status(404).json({ error: 'Contact not found!' });
		}

		return res.json(await contact.update(req.body));
	}

	async delete(req, res) {
		const contact = await Contact.findOne({ where: { id: req.params.id } });

		if (!contact)
			return res.status(400).json({ error: 'This Contact does not exists!' });

		await Contact.destroy({ where: { id: req.params.id } });

		return res.status(200).json({ message: 'Contact successfully deleted!' });

	}
}

export default new ContactController();
