import bcrypt from 'bcryptjs';
import 'dotenv';

import database from '../../database/index.js';
import Person from '../models/person.js';
import Buyer from '../models/buyer.js';
import content from './content.js';
import Role from '../models/role.js';
import Contact from '../models/contact.js';
import utils from './utils.js';
import { Op } from 'sequelize';
import Sale from '../models/sale.js';

const sequelize = database.connection;

let include = [

];
class BuyerController {
    async index(req, res) {
        let cnpj = req.query.cnpj;
        let where = {}
        if (cnpj) {
            where.cpf_cnpj = {
                [Op.like]: `%${cnpj}%`
            }
        }

        let nameWhere = req.query.name;
        if (nameWhere) {
            include.push(utils.include(Person, {
                name: {
                    [Op.like]: `%${nameWhere}%`
                }
            }, true, null, [
                utils.include(Contact, {}, true, null, null, null),
            ], null))
        }

        let emailWhere = req.query.email;
        if (emailWhere) {
            include.push(utils.include(Person, {}, true, null, [
                utils.include(Contact, {
                    email: {
                        [Op.like]: `%${emailWhere}%`
                    }
                }, true, null, null, null),
            ], null))
        }
        let phoneWhere = req.query.phone;
        if (phoneWhere) {
            include.push(utils.include(Person, {}, true, null, [
                utils.include(Contact, {
                    phone: {
                        [Op.like]: `%${phoneWhere}%`
                    }
                }, true, null, null, null),
            ], null))
        }

        if (!nameWhere && !emailWhere && !phoneWhere) {
            include.push(utils.include(Person, {}, false, null, [
                utils.include(Contact, {}, false, null, null, null),
            ], null))
        }

        try {
            const buyers = await Buyer.findAll({
                order: ['id'],
                include,
                where
            }); 5
            return res.json(
                content(buyers)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const buyer = await Buyer.findOne({
            where: {
                id: req.params.id,
            },
            include
        });

        return res.status(200).json({
            buyer,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let contact_stored;
            if (data.contact) {
                contact_stored = await Contact.create(data.contact, {
                    transaction
                });
            }

            let person_obj = {
                name: data.person.name,
                contact: contact_stored.id
            }

            let person_stored = await Person.create(person_obj, {
                transaction
            });

            let buyer_obj = {
                person: person_stored.id,
                cpf_cnpj: data.cpf_cnpj,
                is_cnpj: data.is_cnpj
            }

            let buyer_stored = await Buyer.create(buyer_obj, {
                transaction
            });

            await transaction.commit();
            return res.json(buyer_stored);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
            });
        }
    }

    async update(req, res) {

        const buyer = await Buyer.findByPk(req.params.id);

        if (!buyer) {
            return res.status(404).json({
                error: 'Buyer not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let contact_updated = await Contact.update(data.contact, { where: { id: data.contact.id }, transaction })

            let person_obj = {
                name: data.person.name,
                contact: data.contact.id
            }

            let person_updated = await Person.update(person_obj, { where: { id: data.person.id }, transaction })

            let buyer_obj = {
                cpf_cnpj: data.cpf_cnpj,
                person: person_updated.id,
            }

            let buyer_updated = await Buyer.update(buyer_obj, { where: { id: buyer.id }, transaction })
            await transaction.commit();

            return res.json(buyer_updated);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {
        let include = [utils.include(Sale, { buyer: req.params.id }, false, null, null, null)]
        let transaction = await sequelize.transaction();
        try {
            const buyer = await Buyer.findOne({
                where: {
                    id: req.params.id
                }, include
            });

            if (!buyer)
                return res.status(400).json({
                    error: 'This Buyer does not exists!'
                });

            if (buyer.Sales.length > 0) {
                buyer.Sales.map(item => {
                    item.destroy({ where: { id: item.id } });
                })
            }

            await buyer.destroy();
            return res.status(200).json({
                message: 'Buyer successfully deleted!'
            });

        } catch (err) {
            await transaction.rollback();
            console.log(err)
        }
    }

}

export default new BuyerController();
