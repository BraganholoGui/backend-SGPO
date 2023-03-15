import Person from '../models/person.js';
import content from './content.js';


class PersonController {

	async index(req, res) {
		const people = await Person.findAll({
			order: ['id'],
		});
		return res.json(
			content(people)
		);
	}

	async getById(req, res) {

		const person = await Person.findOne({ where: { id: req.params.id, active: true } });

		return res.status(200).json(
			content(person)
		);
	}

	async store(req, res) {
		let data = req.body;
        data.created_at = new Date();
        data.updated_at = new Date();
		return res.json(await Person.create(data));
	}

	async update(req, res) {
        const person = await Person.findByPk(req.params.id);
		if (!person) {
			return res.status(404).json({ error: 'Person not found!'});
		}
		return res.json(await person.update(req.body));
	}

	async delete(req, res) {

		const person = await Person.findOne({ where: { id: req.params.id } });

		if (!person)
			return res.status(400).json({ error: 'This Person does not exists!' });

		await person.update({ active: false });
		// await person.destroy();
		return res.status(200).json({ message: 'Person successfully deleted!' });
	}
}

export default new PersonController();
