import { Op } from 'sequelize';
import Team from '../models/team.js';
import TeamUser from '../models/teamUser.js';
import content from './content.js';
import utils from './utils.js';
import database from '../../database/index.js';
const sequelize = database.connection;


let include = [

];
class TeamController {

	async index(req, res) {

		let team = req.query.team;
		let where = {}
		if (team) {
			where.name = {
				[Op.like]: `%${team}%`
			}
		}

		const teams = await Team.findAll({
			order: ['id'],
			where
		});
		return res.json(
			content(teams)
		);

	}

	async getById(req, res) {

		const team = await Team.findOne({ where: { id: req.params.id, } });

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
		let transaction = await sequelize.transaction();
		try {
			include.push(utils.include(TeamUser, { team: req.params.id }, false, null, null, null))
			const team = await Team.findOne({ where: { id: req.params.id }, include });

			if (!team)
				return res.s1tatus(400).json({ error: 'This Team does not exists!' });

			if (team.TeamUsers.length > 0) {
				team.TeamUsers.map(item => {
					item.destroy({ where: { id: item.id } });
				})
			}

			await team.destroy({ where: { id: req.params.id } });

			await transaction.commit();
			return res.status(200).json({ message: 'Team successfully deleted!' });
		} catch (err) {
			await transaction.rollback();
			console.log(err)
		}
	}
}

export default new TeamController();
