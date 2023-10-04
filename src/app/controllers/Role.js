import Role from '../models/role.js';
import Status from '../models/status.js';
import User from '../models/user.js';
import content from './content.js';
import utils from './utils.js';
import { Op } from "sequelize";

let include = [
	utils.include(User, {}, false, null, null, null),
];

class RoleController {

	async index(req, res) {
		let role = req.query.role;
		let where = {}
		if (role) {
			where.name = {
				[Op.like]: `%${role}%`
			}
		}
		let statusWhere = req.query.status;
		if (statusWhere) {
			include.push(utils.include(Status, { value: statusWhere }, true, null, null, null))
		} else {
			include.push(utils.include(Status, {}, false, null, null, null))
		}


		const roles = await Role.findAll({
			order: ['id'],
			include,
			where
		});
		return res.json(
			content(roles)
		);

	}

	async getById(req, res) {

		const role = await Role.findOne({ where: { id: req.params.id, }, include });

		return res.status(200).json({
			role,
		});
	}

	async store(req, res) {
		return res.json(await Role.create(req.body));
	}

	async update(req, res) {

		const role = await Role.findByPk(req.params.id);

		if (!role) {

			return res.status(404).json({ error: 'Role not found!' });

		}

		return res.json(await role.update(req.body));

	}

	async delete(req, res) {
		try {
			const role = await Role.findOne({ where: { id: req.params.id }, include });

			if (!role)
				return res.status(400).json({ error: 'This Role does not exists!' });

			if(role.Users?.length > 0){
				role.Users.map(item =>{
					
				})
			}

			await role.destroy();

			return res.status(200).json({ message: 'Role successfully deleted!' });
		} catch (e) {
			console.log(e)
		}

	}
}

export default new RoleController();
