import Priority from '../models/priority.js';
import content from './content.js';

class PriorityController {

	async index(req, res) {
		const priority = await Priority.findAll();
		return res.json(
			content(priority)
		);

	}

	async getById(req, res) {

		const priority = await Priority.findOne({ where: { id: req.params.id,  } });

		return res.status(200).json({
			priority,
		});
	}

	async store(req, res) {
		return res.json(await Priority.create(req.body));
	}

	async update(req, res) {

		const priority = await Priority.findByPk(req.params.id);

		if (!priority) {

			return res.status(404).json({ error: 'Priority not found!' });

		}

		return res.json(await priority.update(req.body));

	}

	async delete(req, res) {

		const priority = await Priority.findOne({ where: { id: req.params.id } });

		if (!priority)
			return res.status(400).json({ error: 'This Priority does not exists!' });

		await priority.destroy();

		return res.status(200).json({ message: 'Priority successfully deleted!' });
	}
}

export default new PriorityController();
