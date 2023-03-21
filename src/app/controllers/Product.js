import 'dotenv';
import database from '../../database/index.js';
import Product from '../models/product.js';
import content from './content.js';
import utils from './utils.js';

const sequelize = database.connection;


class ProductController {

    async index(req, res) {
        try {
            const products = await Product.findAll({
                order: ['id'],
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

            let product = await Product.create(data, {
                transaction
            });

            await transaction.commit();
            return res.json(product);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
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
          
            let task_updated = await Product.update(data, { where: { id: product.id }, transaction })

            await transaction.commit();

            return res.json(task_updated);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {

        const product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!product)
            return res.status(400).json({
                error: 'This Product does not exists!'
            });

        await product.destroy();
        return res.status(200).json({
            message: 'Product successfully deleted!'
        });
    }

}

export default new ProductController();
