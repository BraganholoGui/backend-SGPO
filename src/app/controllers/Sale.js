import 'dotenv';
import database from '../../database/index.js';
import Sale from '../models/sale.js';
import content from './content.js';

const sequelize = database.connection;

class SaleController {
    async index(req, res) {
        try {
            const sales = await Sale.findAll({
                order: ['id'],
            });
            return res.json(
                content(sales)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const sale = await Sale.findOne({
            where: {
                id: req.params.id,
            },
            include
        });

        return res.status(200).json({
            sale,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let purchase_stored = await Sale.create(data, {
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

        const sale = await Sale.findByPk(req.params.id);

        if (!sale) {
            return res.status(404).json({
                error: 'Sale not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let purchase_updated = await Sale.update(data, { where: { id: sale.id }, transaction })

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

        const sale = await Sale.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!sale)
            return res.status(400).json({
                error: 'This Sale does not exists!'
            });

        await sale.destroy();
        return res.status(200).json({
            message: 'Sale successfully deleted!'
        });
    }

}

export default new SaleController();
