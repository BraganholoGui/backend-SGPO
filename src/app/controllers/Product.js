import 'dotenv';
import database from '../../database/index.js';
import Product from '../models/product.js';
import content from './content.js';
import utils from './utils.js';
import Stock from '../models/stock.js';
import Purchase from '../models/purchase.js';
import SupplierPurchase from '../models/supplierPurchase.js';
import Sale from '../models/sale.js';
import { Op } from 'sequelize';

const sequelize = database.connection;


class ProductController {

    async index(req, res) {
        try {
            let name = req.query.name;
            let description = req.query.description;
            let price = req.query.price;
            let quantityMin = req.query.quantityMin;

            let where = {

            }

            if (name) {
                where.name = {
                    [Op.like]: `%${name}%`
                }
            }
            if (description) {
                where.description = {
                    [Op.like]: `%${description}%`
                }
            }
            if (price) {
                where.price = {
                    [Op.lte]: Number(price)
                }
            }
            if (quantityMin) {
                where.quantity_min = {
                    [Op.lte]: Number(quantityMin)
                }
            }
            const products = await Product.findAll({
                order: ['id'],
                where
            });
            return res.json(
                content(products)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const product = await Product.findOne({
            where: {
                id: req.params.id,

            },
            // include
        });

        return res.status(200).json({
            product,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            const productStored = await Product.findOne({
                where: {
                    name: data.name,
                },
            });

            if (productStored) throw new Error("Nome do produto já cadastrado!");

            let product = await Product.create(data, {
                transaction
            });

            let dataStock = {
                product: product.id,
                total_price: product.price
            }
            await Stock.create(dataStock, {
                transaction
            });

            await transaction.commit();
            return res.json(product);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: error.message || 'Erro ao salvar registro'
            });
        }
    }

    async update(req, res) {

        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: 'Product not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body
            const productStored = await Product.findOne({
                where: {
                    name: data.name,
                },
            });

            if (productStored)
                if (product.name != productStored.name)
                    throw new Error("Nome do produto já cadastrado!");

            let productUpdate = await Product.update(data, { where: { id: product.id }, transaction })

            let dataStock = {
                product: product.id,
                total_price: data.price
            }
            await Stock.update(dataStock, {
                where: { product: product.id }, transaction
            });

            await transaction.commit();

            return res.json(productUpdate);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: error.message || 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {
        let include = [utils.include(Stock, { product: req.params.id }, false, null, null, null)]
        let transaction = await sequelize.transaction();
        try {

            const product = await Product.findOne({
                where: {
                    id: req.params.id
                }, include
            });

            if (!product)
                return res.status(400).json({
                    error: 'This Product does not exists!'
                });

            if (product.Stocks.length > 0) {
                product.Stocks.map(item => {
                    item.destroy({ where: { id: item.id } });
                })
            }

            const purchases = await Purchase.findAll({
                where: {
                    product: req.params.id
                }
            });
            purchases.map(item => {
                SupplierPurchase.destroy({ where: { purchase: item.id } });
            })

            await Purchase.destroy({ where: { product: req.params.id } });

            const sales = await Sale.findAll({
                where: {
                    product: req.params.id
                }
            });
            sales.map(item => {
                Sale.destroy({ where: { product: item.product } });
            })

            await Product.destroy({ where: { id: req.params.id } });
            await transaction.commit();
            return res.status(200).json({
                message: 'Product successfully deleted!'
            });
        } catch (e) {
            console.log(e)
        }
    }

}

export default new ProductController();
