import 'dotenv';
import database from '../../database/index.js';
import Material from '../models/material.js';
import content from './content.js';
import Stock from '../models/stock.js';
import Purchase from '../models/purchase.js';
import SupplierPurchase from '../models/supplierPurchase.js';
import { Op } from 'sequelize';

const sequelize = database.connection;

class MaterialController {
    async index(req, res) {
        try {
            let name = req.query.name;
            let description = req.query.description;
            let price = req.query.price;
            let quantityMin = req.query.quantityMin;
            
            let where = {
                
            }
            
            if(name){
                where.name= {
                    [Op.like]:`%${name}%`
                  }
            }
            if(description){
                where.description= {
                    [Op.like]:`%${description}%`
                  }
            }
            if(price){
                where.price= {
                    [Op.lte]:Number(price)
                  }
            }
            if(quantityMin){
                where.quantity_min= {
                    [Op.lte]:Number(quantityMin)
                  }
            }
          
            const materials = await Material.findAll({
                order: ['id'],
                where
            });
            return res.json(
                content(materials)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const material = await Material.findOne({
            where: {
                id: req.params.id,
                
            },
            // include
        });

        return res.status(200).json({
            material,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let material = await Material.create(data, {
                transaction
            });

            let dataStock = {
                material: material.id,
                total_price: material.price
            }
            await Stock.create(dataStock, {
                transaction
            });

            await transaction.commit();
            return res.json(material);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
            });
        }
    }

    async update(req, res) {

        const material = await Material.findByPk(req.params.id);

        if (!material) {
            return res.status(404).json({
                error: 'Material not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body
          
            let material_updated = await Material.update(data, { where: { id: material.id }, transaction })

            let dataStock = {
                material:material.id,
                total_price:data.price
            }
            await Stock.update(dataStock, {
                where: { material: material.id }, transaction
            });

            await transaction.commit();

            return res.json(material_updated);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {
        try{

            const material = await Material.findOne({
                where: {
                id: req.params.id
            }
        });

        if (!material)
            return res.status(400).json({
                error: 'This Material does not exists!'
            });

        const purchases = await Purchase.findAll({
            where:{
                material: req.params.id 
            }
        });
        purchases.map(item =>{
             SupplierPurchase.destroy({ where: { purchase: item.id } });
        })

        await Purchase.destroy({ where: { material: req.params.id } });
        await Material.destroy({ where: { id: req.params.id } });
        return res.status(200).json({
            message: 'Material successfully deleted!'
        });
        } catch(e){
            console.log(e)
        }
    }

}

export default new MaterialController();
