import bcrypt from 'bcryptjs';
import 'dotenv';

import database from '../../database/index.js';
import Person from '../models/person.js';
import Supplier from '../models/supplier.js';
import content from './content.js';
import Role from '../models/role.js';
import Contact from '../models/contact.js';
import utils from './utils.js';
import { Op } from 'sequelize';

const sequelize = database.connection;

let include = [
   
];

class SupplierController {
    async index(req, res) {
        let cnpj = req.query.cnpj;
		let where = {}
		if (cnpj) {
			where.cnpj = {
				[Op.like]: `%${cnpj}%`
			}
		}

        let nameWhere = req.query.name;
        if (nameWhere) {
            include.push( utils.include(Person, { name:{
                [Op.like]: `%${nameWhere}%`
            } }, true, null, [
                utils.include(Contact, { }, true, null, null, null),
            ], null))
        }
        
        let emailWhere = req.query.email;
        if (emailWhere) {
            include.push( utils.include(Person, { }, true, null, [
                utils.include(Contact, {email: {
                    [Op.like]: `%${emailWhere}%`
                } }, true, null, null, null),
            ], null))
        }
        let phoneWhere = req.query.phone;
        if (phoneWhere) {
            include.push( utils.include(Person, { }, true, null, [
                utils.include(Contact, {phone: {
                    [Op.like]: `%${phoneWhere}%`
                } }, true, null, null, null),
            ], null))
        }

        if(!nameWhere && !emailWhere && !phoneWhere){
            include.push( utils.include(Person, { }, false, null, [
                utils.include(Contact, { }, false, null, null, null),
            ], null))
        }

        try {
            const suppliers = await Supplier.findAll({
                order: ['id'],
                include,
                where
            });
            return res.json(
                content(suppliers)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const supplier = await Supplier.findOne({
            where: {
                id: req.params.id,
            },
            include
        });

        return res.status(200).json({
            supplier,
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

            let user_obj = {
                cnpj: data.cnpj,
                person: person_stored.id,
            }

            let supplier_stored = await Supplier.create(user_obj, {
                transaction
            });

            await transaction.commit();
            return res.json(supplier_stored);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
            });
        }
    }

    async update(req, res) {

        const sup = await Supplier.findByPk(req.params.id);

        if (!sup) {
            return res.status(404).json({
                error: 'Supplier not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let contact_updated = await Contact.update(data.contact, { where: { id: data.contact.id }, transaction })

            let person_obj = {
                name: data.person.name,
                contact: contact_updated.id
            }

            let person_updated = await Person.update(person_obj, { where: { id: data.person.id }, transaction })

            let supplier_obj = {
                cnpj: data.cnpj,
                person: person_updated.id,
            }

            let supplier_updated = await Supplier.update(supplier_obj, { where: { id: sup.id }, transaction })

            await transaction.commit();

            return res.json(supplier_updated);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {

        const supplier = await Supplier.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!supplier)
            return res.status(400).json({
                error: 'This Supplier does not exists!'
            });

        await supplier.destroy();
        return res.status(200).json({
            message: 'Supplier successfully deleted!'
        });
    }

}

export default new SupplierController();
