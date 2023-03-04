import Address from '../models/Address.js';
import content from './content.js';

class AddressController {

	async index(req, res) {
		const address = await Address.findAll({
			order: ['id'],
			where: { active: true }
		});
		return res.json(
			content(address)
		);
}

	async getById(req, res) {

		const address = await Address.findOne({ where: { id: req.params.id, active: true } });

		return res.status(200).json({
			address,
		});
	}

	async store(req, res) {
		let data = req.body
		data.active = true
		return res.json(await Address.create(data));
	}


	async update(req, res) {

		const address = await Address.findByPk(req.params.id);

		if (!address) {
			return res.status(404).json({ error: 'Address not found!' });
		}

		return res.json(await address.update(req.body));
	}

	async delete(req, res) {

		const address = await Address.findOne({ where: { id: req.params.id } });

		if (!address)
		return res.status(400).json({ error: 'This Address does not exists!' });

		await address.update({ active: false });

		return res.status(200).json({ message: 'Address successfully deleted!' });
	}
}

export default new AddressController();
