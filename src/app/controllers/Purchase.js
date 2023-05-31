import 'dotenv';
import database from '../../database/index.js';
import Purchase from '../models/purchase.js';
import content from './content.js';

const sequelize = database.connection;

let include = [
    utils.include(Product, { }, false, null, null, null),
    utils.include(Buyer, { }, false, null, [
        utils.include(Person, { }, false, null, null, null),
    ], null),
];

class PurchaseController {
    async index(req, res) {
        try {
            const purchases = await Purchase.findAll({
                order: ['id'],
            });
            return res.json(
                content(purchases)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const purchase = await Purchase.findOne({
            where: {
                id: req.params.id,
            },
            include
        });

        return res.status(200).json({
            purchase,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let purchase_stored = await Purchase.create(data, {
                transaction
            });

            await transaction.commit();
            return res.json(purchase_stored);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
            });
        }
    }

    async update(req, res) {

        const purchase = await Purchase.findByPk(req.params.id);

        if (!purchase) {
            return res.status(404).json({
                error: 'Purchase not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let purchase_updated = await Purchase.update(data, { where: { id: purchase.id }, transaction })

            await transaction.commit();

            // await sendEmail(data.email, user_updated.id, res);

            return res.json(purchase_updated);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {

        const purchase = await Purchase.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!purchase)
            return res.status(400).json({
                error: 'This Purchase does not exists!'
            });

        await purchase.destroy();
        return res.status(200).json({
            message: 'Purchase successfully deleted!'
        });
    }

}

export default new PurchaseController();
