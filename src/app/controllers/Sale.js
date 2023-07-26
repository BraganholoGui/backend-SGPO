import 'dotenv';
import database from '../../database/index.js';
import Sale from '../models/sale.js';
import content from './content.js';
import utils from './utils.js';
import Product from '../models/product.js';
import Buyer from '../models/buyer.js';
import Person from '../models/person.js';
import Stock from '../models/stock.js';
import Status from '../models/status.js';

const sequelize = database.connection;

let include = [
    utils.include(Status, {}, false, null, null, null),
    utils.include(Product, {}, false, null, null, null),
    utils.include(Buyer, {}, false, null, [
        utils.include(Person, {}, false, null, null, null),
    ], null),
];
class SaleController {
    async index(req, res) {
        try {
            const sales = await Sale.findAll({
                order: ['id'],
                include
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
            if (!data.status) data.status = 1

            let sale_stored = await Sale.create(data, {
                transaction
            });
            let qtd = 0;
            if (data.product) {
                const product = await Stock.findOne({
                    where: {
                        product: data.product,
                    },
                });
                qtd = parseInt(product.quantity || 0) - parseInt(data.quantity)
                if (data.status == 3) {
                    if (qtd < 0) qtd = 0

                    let dataStock = {
                        product: product.product,
                        total_price: data.price * data.quantity,
                        quantity: qtd
                    }
                    await Stock.update(dataStock, {
                        where: { product: product.product }, transaction
                    });

                    let dataProduct = {
                        product: product.id,
                        total_price: data.price,
                        quantity: qtd
                    }
                    await Product.update(dataProduct, {
                        where: { id: product.product }, transaction
                    });
                }
            }

            await transaction.commit();
            return res.json(sale_stored);

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
            if (data.quantity) parseInt(data.quantity)

            let sale_updated = await Sale.update(data, { where: { id: sale.id }, transaction })

            if (sale.quantity < data.quantity) {
                data.quantity -= sale.quantity
            } else if (sale.quantity > data.quantity) {
                data.quantity = sale.quantity - data.quantity
            }

            let qtd = 0;
            if (data.product) {
                if (data.status == 3) {
                    const product = await Stock.findOne({
                        where: {
                            product: data.product,
                        },
                    });
                    qtd = parseInt(product.quantity || 0) - data.quantity
                    if (qtd < 0) qtd = 0

                    let dataStock = {
                        product: product.product,
                        total_price: data.price * data.quantity,
                        quantity: qtd
                    }
                    await Stock.update(dataStock, {
                        where: { product: product.product }, transaction
                    });

                    let dataProduct = {
                        product: product.id,
                        total_price: data.price,
                        quantity: qtd
                    }
                    await Product.update(dataProduct, {
                        where: { id: product.product }, transaction
                    });
                }
            }

            await transaction.commit();

            // await sendEmail(data.email, user_updated.id, res);

            return res.json(sale_updated);

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
