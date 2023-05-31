import 'dotenv';
import database from '../../database/index.js';
import Purchase from '../models/purchase.js';
import content from './content.js';
import Material from '../models/material.js';
import Product from '../models/product.js';
import utils from './utils.js';
import Person from '../models/person.js';
import Supplier from '../models/supplier.js';
import SupplierPurchase from '../models/supplierPurchase.js';

const sequelize = database.connection;

let include = [
    utils.include(Product, { }, false, null, null, null),
    utils.include(Material, { }, false, null, null, null),
    utils.include(SupplierPurchase, { }, false, null, [
        utils.include(Supplier, { }, false, null, [
            utils.include(Person, { }, false, null, null, null),
        ], null),
    ], null),
];

class PurchaseController {
    async index(req, res) {
        try {
            const purchases = await Purchase.findAll({
                order: ['id'],
                include
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

            let objSupplierPurchase = {
                purchase: purchase_stored.id,
                supplier:data.supplier
            }

            await SupplierPurchase.create(objSupplierPurchase, {
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

        const hasSupplierPurchase = await SupplierPurchase.findOne({
            where: {
                purchase: purchase.id
            },
        });

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let purchase_updated = await Purchase.update(data, { where: { id: purchase.id }, transaction })

            let objSupplierPurchase = {
                purchase: purchase.id,
                supplier:data.supplier
            }

            if(hasSupplierPurchase){
                await SupplierPurchase.update(objSupplierPurchase, { where: { purchase: purchase.id }, transaction });
            }else{
                await SupplierPurchase.create(objSupplierPurchase, { transaction });

            }

            await transaction.commit();
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
