import { Op } from 'sequelize';
import Theme from '../models/theme.js';
import content from './content.js';
import database from '../../database/index.js';
import utils from './utils.js';
import Task from '../models/task.js';
const sequelize = database.connection;

class ThemeController {

	async index(req, res) {
		let theme = req.query.theme;
		let where = {}
		if (theme) {
			where.name = {
				[Op.like]: `%${theme}%`
			}
		}
		const themes = await Theme.findAll({
			order: ['id'],
			where
		});
		return res.json(
			content(themes)
		);


	}

	async getById(req, res) {

		const theme = await Theme.findOne({ where: { id: req.params.id, } });

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
		let include = [utils.include(Task, { theme: req.params.id }, false, null, null, null)]
		let transaction = await sequelize.transaction();
		try {
			const theme = await Theme.findOne({ where: { id: req.params.id }, include });

			if (!theme)
				return res.status(400).json({ error: 'This Theme does not exists!' });

			if (theme.Tasks.length > 0) {
				theme.Tasks.map(item => {
					item.destroy({ where: { id: item.id } });
				})
			}
			await theme.destroy();

			await transaction.commit();
			return res.status(200).json({ message: 'Theme successfully deleted!' });
		} catch (e) {
			await transaction.rollback();
			console.log(e)
		}
	}
}

export default new ThemeController();
