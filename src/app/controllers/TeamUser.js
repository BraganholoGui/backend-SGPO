import 'dotenv';
import database from '../../database/index.js';
import Person from '../models/person.js';
import TeamUser from '../models/teamUser.js';
import content from './content.js';
import Contact from '../models/contact.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import utils from './utils.js';

const sequelize = database.connection;

let include = [
    utils.include(Team, {}, false, null, null, null),
    utils.include(User, {}, false, null, [
        utils.include(Person, {}, false, null, null, null),
    ], null),
];
class TeamUserController {
    async index(req, res) {
        try {
            const team_users = await TeamUser.findAll({
                order: ['id'],
            });
            return res.json(
                content(team_users)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const team_user = await TeamUser.findAll({
            where: {
                team: req.params.id,
            },
            include
        });

        return res.status(200).json({
            team_user,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let team_stored = await Team.create(data)
            let team_user_stored;
            data.userRelateds.map(async user => {
                let obj = {
                    team: team_stored.id,
                    user: user.id
                }
                team_user_stored = await TeamUser.create(obj);
            })

            await transaction.commit();
            return res.json(team_user_stored);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
            });
        }
    }

    async update(req, res) {

        const team_user = await TeamUser.findAll({
            where: {
                team: req.params.id,
            },
            include
        });

        if (!team_user) {
            return res.status(404).json({
                error: 'TeamUser not found!'
            });
        }


        let transaction = await sequelize.transaction();
        try {
            let data = req.body
            let userFound;
            let userNotFound;
            let team_user_updated

            team_user.map(teamUser => {
                TeamUser.destroy({
                    where: { team: teamUser.team }
                })
            })

            data.userRelateds.map(async user => {
                let obj = {
                    team: req.params.id,
                    user: user.user ? user.user : user.id
                }
                team_user_stored = await TeamUser.create(obj);
            })




            await transaction.commit();

            // await sendEmail(data.email, user_updated.id, res);

            return res.json(team_user_updated);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {

        const team_user = await TeamUser.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!team_user)
            return res.status(400).json({
                error: 'This TeamUser does not exists!'
            });

        await team_user.destroy();
        return res.status(200).json({
            message: 'TeamUser successfully deleted!'
        });
    }

}

export default new TeamUserController();
