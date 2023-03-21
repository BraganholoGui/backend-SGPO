import Status from '../models/status.js';
import content from './content.js';

class StatusController {

	async index(req, res) {
		const status = await Status.findAll();
		return res.json(
			content(status)
		);

	}

	async getById(req, res) {

		const status = await Status.findOne({ where: { id: req.params.id,  } });

		return res.status(200).json({
			status,
		});
	}

	async store(req, res) {
		return res.json(await Status.create(req.body));
	}

	async update(req, res) {

		const status = await Status.findByPk(req.params.id);

		if (!status) {

			return res.status(404).json({ error: 'Status not found!' });

		}

		return res.json(await status.update(req.body));

	}

	async delete(req, res) {

		const status = await Status.findOne({ where: { id: req.params.id } });

		if (!status)
			return res.status(400).json({ error: 'This Status does not exists!' });

		await status.update({ active: false });

		return res.status(200).json({ message: 'Status successfully deleted!' });
	}
}

export default new StatusController();
