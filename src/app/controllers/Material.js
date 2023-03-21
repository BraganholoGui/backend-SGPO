import 'dotenv';
import database from '../../database/index.js';
import Material from '../models/material.js';
import content from './content.js';

const sequelize = database.connection;

class MaterialController {
    async index(req, res) {
        try {
            const materials = await Material.findAll({
                order: ['id'],
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
          
            let task_updated = await Material.update(data, { where: { id: material.id }, transaction })

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

        const material = await Material.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!material)
            return res.status(400).json({
                error: 'This Material does not exists!'
            });

        await material.destroy();
        return res.status(200).json({
            message: 'Material successfully deleted!'
        });
    }

}

export default new MaterialController();
