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

            let supplier_stored = await Supplier.create(data, {
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

        const supplier = await Supplier.findByPk(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                error: 'Supplier not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let supplier_updated = await Supplier.update(data, { where: { id: supplier.id }, transaction })

            await transaction.commit();

            // await sendEmail(data.email, user_updated.id, res);

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
