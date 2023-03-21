import bcrypt from 'bcryptjs';
import 'dotenv';

import database from '../../database/index.js';
import Person from '../models/person.js';
import Supplier from '../models/supplier.js';
import content from './content.js';
import Role from '../models/role.js';
import Contact from '../models/contact.js';

const sequelize = database.connection;

class SupplierController {
    async index(req, res) {
        try {
            const suppliers = await Supplier.findAll({
                order: ['id'],
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

            let buyer_obj = {
                access_name: data.access_name,
                password_hash: data.password,
                person: person_stored.id,
                team: data.team,
                role: data.role,
            }

            let buyer_stored = await Supplier.create(buyer_obj, {
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

        const supplier = await Supplier.findByPk(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                error: 'Supplier not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let contact_updated = await Contact.update(data.contact, { where: { id: data.pf.Person.contact }, transaction })

            let person_obj = {
                name: data.person.name,
                birth_date: data.person.birth_date,
                address: address_updated.id,
                contact: contact_updated.id
            }

            let person_updated = await Person.update(person_obj, { where: { id: data.pf.Person.id }, transaction })

            let physical_person_obj = {
                cpf: data.physical_person.cpf,
                rg: data.physical_person.rg,
                person: person_updated.id,
                company: 1
            }

            let physical_person_updated = await PhysicalPerson.update(physical_person_obj, { where: { id: data.pf.id }, transaction })

            let user_obj = {
                unit: data.unit.id,
                email: data.email,
                password_hash: data.password_hash,
                physical_person: physical_person_updated.id,
                company: 1,
                role: role_updated.id,
                hierarchy: data.hierarchy,
            }

            let user_updated = await Supplier.update(user_obj, { where: { id: data.id }, transaction })

            if (data.menus) {
                await Promise.all(data.menus.map(async (element) => {
                    await Promise.all(element.children.map(async (children) => {
                        // children.permission_read = 1
                        // if (children.permission_read || children.permission_write || children.permission_delete) {
                        let user_menu = {
                            menu: children.menu,
                            supplier: data.id,
                            permission_read: children.permission_read,
                            permission_write: children.permission_write,
                            permission_delete: children.permission_delete
                        };
                        if (!children.id) {
                            await UserMenu.create(user_menu, { transaction });
                        } else {
                            await UserMenu.update(user_menu, { where: { id: children.id }, transaction });
                        }
                        // }
                    }));
                }));
            }


            await transaction.commit();

            // await sendEmail(data.email, user_updated.id, res);

            return res.json(user_updated);

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
