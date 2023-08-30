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
import Stock from '../models/stock.js';
import Status from '../models/status.js';
import Contact from '../models/contact.js';
import { Op } from 'sequelize';

const sequelize = database.connection;

let include = [
    // utils.include(Status, {}, false, null, null, null),
    // utils.include(Product, {}, false, null, null, null),
    // utils.include(Material, {}, false, null, null, null),
    // utils.include(SupplierPurchase, {}, false, null, [
    //     utils.include(Supplier, {}, false, null, [
    //         utils.include(Person, {}, false, null, [utils.include(Contact, {}, false, null, null, null),], null),
    //     ], null),
    // ], null),
];

class PurchaseController {
    async index(req, res) {
        try {
            let start = req.query.start ? req.query.start : null;
            let end = req.query.end ? req.query.end : null;
            let supplier = req.query.supplier;
            let status = req.query.status;
            let name = req.query.name;
            let checked = req.query.name;
            let endD = req.query.endD;
            let where = {}

            // if (endD) {
            //     where.end = {
            //         [Op.between]: [start, end]
            //     }
            // }

            if (supplier) {
                include.push(utils.include(SupplierPurchase, { supplier: supplier }, true, null, [
                    utils.include(Supplier, {}, false, null, [
                        utils.include(Person, {}, false, null, [utils.include(Contact, {}, false, null, null, null),], null),
                    ], null),
                ], null),)
            } else {
                include.push(utils.include(SupplierPurchase, {}, false, null, [
                    utils.include(Supplier, {}, false, null, [
                        utils.include(Person, {}, false, null, [utils.include(Contact, {}, false, null, null, null),], null),
                    ], null),
                ], null),)
            }


            if (status) {
                include.push(utils.include(Status, { id: status }, true, null, null, null),)
            } else {
                include.push(utils.include(Status, {}, false, null, null, null),)
            }

            if (name) {
                if (checked) {
                    include.push(utils.include(Product, { id: name }, true, null, null, null))
                } else {
                    include.push(utils.include(Material, { id: name }, true, null, null, null))
                }
            } else {
                include.push(utils.include(Product, {}, false, null, null, null), utils.include(Material, {}, false, null, null, null))
            }

            if (!supplier && !status && !name) {
                include.push(utils.include(Status, {}, false, null, null, null),
                    utils.include(Product, {}, false, null, null, null),
                    utils.include(Material, {}, false, null, null, null),
                    utils.include(SupplierPurchase, {}, false, null, [
                        utils.include(Supplier, {}, false, null, [
                            utils.include(Person, {}, false, null, [utils.include(Contact, {}, false, null, null, null),], null),
                        ], null),
                    ], null),)
            }
            const purchases = await Purchase.findAll({
                order: ['id'],
                include,
                where
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
            let data = req.body;
            if (!data.status) data.status = 1

            let purchase_stored = await Purchase.create(data, {
                transaction
            });

            let objSupplierPurchase = {
                purchase: purchase_stored.id,
                supplier: data.supplier
            }

            await SupplierPurchase.create(objSupplierPurchase, {
                transaction
            });

            let qtd = 0;
            if (data.status == 3) {

                if (data.product) {
                    const product = await Stock.findOne({
                        where: {
                            product: data.product,
                        },
                    });
                    qtd = parseInt(product.quantity || 0) + parseInt(data.quantity)


                    let dataStock = {
                        product: product.product,
                        total_price: data.price * data.quantity,
                        quantity: qtd
                    }
                    await Stock.update(dataStock, {
                        where: { product: product.product }, transaction
                    });

                    let dataProduct = {
                        product: product.product,
                        total_price: data.price,
                        quantity: qtd
                    }
                    await Product.update(dataProduct, {
                        where: { id: product.product }, transaction
                    });

                } else {
                    const material = await Stock.findOne({
                        where: {
                            material: data.material,
                        },
                    });
                    qtd = parseInt(material.quantity || 0) + parseInt(data.quantity)


                    let dataStock = {
                        material: material.material,
                        total_price: data.price * data.quantity,
                        quantity: qtd
                    }
                    await Stock.update(dataStock, {
                        where: { material: material.material }, transaction
                    });

                    let dataMaterial = {
                        material: material.material,
                        total_price: data.price,
                        quantity: qtd
                    }
                    await Material.update(dataMaterial, {
                        where: { id: material.material }, transaction
                    });
                }
            }



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

            if (data.quantity) data.quantity = parseInt(data.quantity)

            if (purchase.quantity < data.quantity) {
                data.quantity -= purchase.quantity
            } else if (purchase.quantity > data.quantity) {
                data.quantity = data.quantity - purchase.quantity
            }

            let purchase_updated = await Purchase.update(data, { where: { id: purchase.id }, transaction })

            let objSupplierPurchase = {
                purchase: purchase.id,
                supplier: data.supplier
            }

            if (hasSupplierPurchase) {
                await SupplierPurchase.update(objSupplierPurchase, { where: { purchase: purchase.id }, transaction });
            } else {
                await SupplierPurchase.create(objSupplierPurchase, { transaction });

            }

            let qtd = 0;
            if (data.product) {
                const product = await Stock.findOne({
                    where: {
                        product: data.product,
                    },
                });
                if (data.status == 3) {

                    qtd = parseInt(product.quantity || 0) + parseInt(data.quantity)


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

            } else {
                const material = await Stock.findOne({
                    where: {
                        material: data.material,
                    },
                });
                qtd = parseInt(material.quantity || 0) + parseInt(data.quantity)

                if (data.status == 3) {
                    let dataStock = {
                        material: material.material,
                        total_price: data.price * data.quantity,
                        quantity: qtd
                    }
                    await Stock.update(dataStock, {
                        where: { material: material.material }, transaction
                    });

                    let dataMaterial = {
                        material: material.material,
                        total_price: data.price,
                        quantity: qtd
                    }
                    await Material.update(dataMaterial, {
                        where: { id: material.material }, transaction
                    });
                }
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
        try {

            const purchase = await Purchase.findOne({
                where: {
                    id: req.params.id
                }
            });

            if (!purchase)
                return res.status(400).json({
                    error: 'This Purchase does not exists!'
                });

            await SupplierPurchase.destroy({ where: { purchase: req.params.id } });
            await purchase.destroy({ where: { id: req.params.id } });
            return res.status(200).json({
                message: 'Purchase successfully deleted!'
            });
        } catch (e) {
            console.log(e)
        }
    }

}

export default new PurchaseController();
