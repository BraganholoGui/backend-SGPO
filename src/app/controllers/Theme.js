import Theme from '../models/theme.js';
import content from './content.js';

class ThemeController {

	async index(req, res) {
		const theme = await Theme.findAll();
		return res.json(
			content(theme)
		);

	}

	async getById(req, res) {

		const theme = await Theme.findOne({ where: { id: req.params.id,  } });

		return res.status(200).json({
			theme,
		});
	}

	async store(req, res) {
		return res.json(await Theme.create(req.body));
	}

	async update(req, res) {

		const theme = await Theme.findByPk(req.params.id);

		if (!theme) {

			return res.status(404).json({ error: 'Theme not found!' });

		}

		return res.json(await theme.update(req.body));

	}

	async delete(req, res) {

		const theme = await Theme.findOne({ where: { id: req.params.id } });

		if (!theme)
			return res.status(400).json({ error: 'This Theme does not exists!' });

		await theme.update({ active: false });

		return res.status(200).json({ message: 'Theme successfully deleted!' });
	}
}

export default new ThemeController();