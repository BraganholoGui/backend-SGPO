import Role from '../models/role.js';
import Status from '../models/status.js';
import content from './content.js';
import utils from './utils.js';

let include = [
    utils.include(Status, {}, false, null, null, null),
];

class RoleController {

	async index(req, res) {
		const role = await Role.findAll({
			order: ['id'],
			include
		});
		return res.json(
			content(role)
		);

	}

	async getById(req, res) {

		const role = await Role.findOne({ where: { id: req.params.id,  } });

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

		const role = await Role.findOne({ where: { id: req.params.id } });

		if (!role)
			return res.status(400).json({ error: 'This Role does not exists!' });

		await role.update({ active: false });

		return res.status(200).json({ message: 'Role successfully deleted!' });
	}
}

export default new RoleController();
