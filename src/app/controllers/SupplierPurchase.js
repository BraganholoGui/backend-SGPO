import 'dotenv';
import database from '../../database/index.js';
import Person from '../models/person.js';
import SupplierPurchase from '../models/supplierPurchase.js';
import content from './content.js';
import Contact from '../models/contact.js';

const sequelize = database.connection;

class SupplierPurchaseController {
    async index(req, res) {
        try {
            const supplier_purchases = await SupplierPurchase.findAll({
                order: ['id'],
            });
            return res.json(
                content(supplier_purchases)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const supplier_purchase = await SupplierPurchase.findOne({
            where: {
                id: req.params.id,
            },
            include
        });

        return res.status(200).json({
            supplier_purchase,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let team_user_stored = await SupplierPurchase.create(data, {
                transaction
            });

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

        const supplier_purchase = await SupplierPurchase.findByPk(req.params.id);

        if (!supplier_purchase) {
            return res.status(404).json({
                error: 'SupplierPurchase not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let team_user_updated = await SupplierPurchase.update(data, { where: { id: supplier_purchase.id }, transaction })

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

        const supplier_purchase = await SupplierPurchase.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!supplier_purchase)
            return res.status(400).json({
                error: 'This SupplierPurchase does not exists!'
            });

        await supplier_purchase.destroy();
        return res.status(200).json({
            message: 'SupplierPurchase successfully deleted!'
        });
    }

}

export default new SupplierPurchaseController();
