import Team from '../models/team.js';
import content from './content.js';

class TeamController {

	async index(req, res) {
		const team = await Team.findAll();
		return res.json(
			content(team)
		);

	}

	async getById(req, res) {

		const team = await Team.findOne({ where: { id: req.params.id, active: true } });

		return res.status(200).json({
			team,
		});
	}

	async store(req, res) {
		return res.json(await Team.create(req.body));
	}

	async update(req, res) {

		const team = await Team.findByPk(req.params.id);

		if (!team) {

			return res.status(404).json({ error: 'Team not found!' });

		}

		return res.json(await team.update(req.body));

	}

	async delete(req, res) {

		const team = await Team.findOne({ where: { id: req.params.id } });

		if (!team)
			return res.status(400).json({ error: 'This Team does not exists!' });

		await team.update({ active: false });

		return res.status(200).json({ message: 'Team successfully deleted!' });
	}
}

export default new TeamController();
