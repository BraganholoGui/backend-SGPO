import Goal from '../models/goal.js';
import content from './content.js';


class GoalController {

	async index(req, res) {
		const goal = await Goal.findAll({
			order: ['id'],
		});
		return res.json(
			content(goal)
		);
	}

	async getById(req, res) {

		const goal = await Goal.findOne({ where: { id: req.params.id, active: true } });

		return res.status(200).json(
			content(goal)
		);
	}

	async store(req, res) {
		let data = req.body;
        data.created_at = new Date();
        data.updated_at = new Date();
		return res.json(await Goal.create(data));
	}

	async update(req, res) {
        const goal = await Goal.findByPk(req.params.id);
		if (!goal) {
			return res.status(404).json({ error: 'Goal not found!'});
		}
		return res.json(await goal.update(req.body));
	}

	async delete(req, res) {

		const goal = await Goal.findOne({ where: { id: req.params.id } });

		if (!goal)
			return res.status(400).json({ error: 'This Goal does not exists!' });

		await goal.update({ active: false });
		// await goal.destroy();
		return res.status(200).json({ message: 'Goal successfully deleted!' });
	}
}

export default new GoalController();
