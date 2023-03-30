import bcrypt from 'bcryptjs';
import 'dotenv';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import path from 'path';
import database from '../../database/index.js';
import Person from '../models/person.js';
import User from '../models/user.js';
import content from './content.js';
import utils from './utils.js';
import {
    addDays
} from 'date-fns';
import {
    date
} from 'yup';
import { Op } from "sequelize";
import Role from '../models/role.js';
import Contact from '../models/contact.js';
import Team from '../models/team.js';

const sequelize = database.connection;




let include = [
    // utils.include(Person, { id: true }, true, null, null, null),
    // utils.include(Role, { id: true }, true, null, null, null),
    utils.include(Team, { id: true }, true, null, null, null),
];
class UserController {


    async index(req, res) {
        try {
            // let start = req.query.start ? req.query.start.replace(/T[0-9][0-9]/i, "T00") : null;
            // let end = req.query.end ? req.query.end.replace(/T[0-9][0-9]/i, "T23") : null;
            // let dateWhere = null;

            // if (start && end) {
            //     dateWhere = {
            //         [Op.between]: [start, end]
            //     };
            // } else if (start && !end) {
            //     dateWhere = {
            //         [Op.gte]: start
            //     };
            // } else if (!start && end) {
            //     dateWhere = {
            //         [Op.lte]: end
            //     }
            // }

            // let where = {
            //     
            // }

            // if (dateWhere) {
            //     where[Op.or] = [{
            //         created_at: dateWhere
            //     }]
            // }

            // let unitWhere = req.query.unit;
            // if (unitWhere) {
            //     include.push(utils.include(Unit, { , id: unitWhere }, true, null))
            // } else {
            //     include.push(utils.include(Unit, {  }, false, null))
            // }

            const users = await User.findAll({
                order: ['id'],
                include
            });
            return res.json(
                content(users)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const user = await User.findOne({
            where: {
                id: req.params.id,
                
            },
            include
        });

        return res.status(200).json({
            user,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            if (data.password) {
                data.password = await bcrypt.hash(data.password, 8);
            }

            let contact_stored;
            if (data.contact) {
                contact_stored = await Contact.create(data.contact, {
                    transaction
                });
            }

            let person_obj = {
                name: data.person.name,
                contact: contact_stored.id
            }

            let person_stored = await Person.create(person_obj, {
                transaction
            });

            let user_obj = {
                access_name: data.access_name,
                password_hash: data.password,
                person: person_stored.id,
                team: data.team,
                role: data.role,
            }

            let user_stored = await User.create(user_obj, {
                transaction
            });

            await transaction.commit();
            return res.json(user_stored);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
            });
        }
    }

    async update(req, res) {

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            if (!data.password_hash && data.password) {
                data.password = await bcrypt.hash(data.password, 8);
            }

            let role_updated;
            if (data.role.id) {
                role_updated = data.role;
            } else {
                role_updated = await Role.create(data.role, {
                    transaction
                });
            }

            data.address.cep = data.address.cep.toString().replace('.', '');
            data.address.cep = data.address.cep.toString().replace('-', '');
            data.physical_person.company = 1;

            let address_updated = await Address.update(data.address, { where: { id: data.pf.Person.address }, transaction })

            let contact_updated = await Contact.update(data.contact, { where: { id: data.pf.Person.contact }, transaction })

            let person_obj = {
                name: data.person.name,
                birth_date: data.person.birth_date,
                address: address_updated.id,
                contact: contact_updated.id
            }

            let person_updated = await Person.update(person_obj, { where: { id: data.pf.Person.id }, transaction })

            let physical_person_obj = {
                cpf: data.physical_person.cpf,
                rg: data.physical_person.rg,
                person: person_updated.id,
                company: 1
            }

            let physical_person_updated = await PhysicalPerson.update(physical_person_obj, { where: { id: data.pf.id }, transaction })

            let user_obj = {
                unit: data.unit.id,
                email: data.email,
                password_hash: data.password_hash,
                physical_person: physical_person_updated.id,
                company: 1,
                role: role_updated.id,
                hierarchy: data.hierarchy,
            }

            let user_updated = await User.update(user_obj, { where: { id: data.id }, transaction })

            if (data.menus) {
                await Promise.all(data.menus.map(async (element) => {
                    await Promise.all(element.children.map(async (children) => {
                        // children.permission_read = 1
                        // if (children.permission_read || children.permission_write || children.permission_delete) {
                        let user_menu = {
                            menu: children.menu,
                            user: data.id,
                            permission_read: children.permission_read,
                            permission_write: children.permission_write,
                            permission_delete: children.permission_delete
                        };
                        if (!children.id) {
                            await UserMenu.create(user_menu, { transaction });
                        } else {
                            await UserMenu.update(user_menu, { where: { id: children.id }, transaction });
                        }
                        // }
                    }));
                }));
            }


            await transaction.commit();

            // await sendEmail(data.email, user_updated.id, res);

            return res.json(user_updated);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {

        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user)
            return res.status(400).json({
                error: 'This User does not exists!'
            });

        await user.destroy();
        return res.status(200).json({
            message: 'User successfully deleted!'
        });
    }

    async reenviarSenha(req, res) {
        let email = req.body.email;

        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            let obj = {}

            if (!user) {
                return res.status(400).json({
                    error: 'Erro ao carregar usuario, favor entrar em contato com nosso suporte'
                })
            }

            let id = user.dataValues.id;
            obj.email = user.dataValues.email;
            obj.physical_person = user.dataValues.physical_person;
            obj.password_hash = user.dataValues.password_hash;
            obj.company = user.dataValues.company;
            obj.active = user.dataValues.active;
            obj.createdAt = user.dataValues.createdAt;
            obj.updatedAt = user.dataValues.updatedAt;

            await sendEmail(email, id, res);

            // return "";
            return res.json(content("Email para definição de senha enviado com sucesso para ", email))
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                error: 'Erro ao enviar email para definição de senha, entre em contato com nosso suporte!'
            })
        }
    }

    async CadastroEmail(req, res) {
        let email = req.body.email;
        let name = req.body.name;
        let authSecret = 'redefinicaoSenha'
        try {
            let obj = {
                email: email,
                name: name
            }

            let token = jwt.sign({
                obj
            }, authSecret, {
                expiresIn: 86400, // expires 24 horas
            });
            let linkTag = `<a href="http://localhost:6001/cadastrar/senha?token=${token}"> Redefinir senha</a>`;
            let msg = `Por favor clique no link a seguir para criar sua senha <br><br>${linkTag}`;

            try {
                console.log(path.resolve(__dirname, "email.html"));
                await fs.readFile(path.resolve(__dirname, "email.html"), "utf8", function (err, contents) {
                    if (err) throw err;

                    let msgContent = contents.replace("[CONTENT VALUE]", msg);

                    const mailOptions = {
                        from: "cleandev.contato@gmail.com",
                        to: email,
                        subject: "Cadastro de senha",
                        html: msgContent
                    };
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("email enviado: " + info.response);
                            return res.json(content("Email enviado com sucesso para ", email))
                        }
                    })
                })
            } catch (error) {
                console.log(error)
                return res.status(400).json({
                    error: 'Erro ao cadastrar senha, entre em contato com nosso suporte!'
                })
            }
            // return "";
            return res.json(content("Email enviado com sucesso para ", email))
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                error: 'Erro ao cadastrar senha, entre em contato com nosso suporte!'
            })
        }
    }

    async atualizarSenha(req, res) {
        let authSecret = 'redefinicaoSenha'
        let token = req.body.token
        let password = req.body.password

        let tokenInvalido = {
            success: false,
            userMessage: "Faça o login novamente!",
            message: "Token inválido!",
            status: 403
        };

        try {
            let transaction = await sequelize.transaction();
            let tokenAberto = await jwt.verify(token, authSecret);

            let user = await User.findOne({
                where: {
                    id: tokenAberto.id
                }
            });

            let obj = {}
            obj.id = user.dataValues.id;
            obj.email = user.dataValues.email;
            obj.physical_person = user.dataValues.physical_person;
            obj.password_hash = password;
            obj.company = user.dataValues.company;
            obj.active = user.dataValues.active;
            obj.createdAt = user.dataValues.createdAt;
            obj.updatedAt = user.dataValues.updatedAt;

            obj.password_hash = await bcrypt.hash(obj.password_hash, 8);

            obj.updatedAt = new Date();

            let user_updated = await User.update(obj, {
                where: {
                    id: obj.id
                },
                transaction
            });;
            transaction.commit();

            return res.json(content("senha atualizada com sucesso", user_updated))
        } catch (err) {
            transaction.rollback();
            throw tokenInvalido;
        }
    }

    async CadastroSenha(req, res) {
        let authSecret = 'redefinicaoSenha'
        let token = req.body.token
        let password = req.body.password

        let tokenInvalido = {
            success: false,
            userMessage: "Faça o login novamente!",
            message: "Token inválido!",
            status: 403
        };

        try {
            let transaction = await sequelize.transaction();
            let tokenAberto = await jwt.verify(token, authSecret);

            let obj = {
                name: tokenAberto.name,
                email: tokenAberto.obj.email,
                password_hash: password,
                company: '1',
                pf: '1',
                created_at: new Date,
                updated_at: new Date
            }

            obj.password_hash = await bcrypt.hash(obj.password_hash, 8);

            let user = await User.create(obj, {
                transaction
            });

            let user_menu = {
                menu: '2',
                usuario: user.id,
                permission_read: '1',
                permission_write: '1',
            };
            await UserMenu.create(user_menu, {
                transaction
            });


            transaction.commit();

            return res.json(content("senha criada com sucesso", user))
        } catch (err) {
            transaction.rollback();
            throw tokenInvalido;
        }
    }
}

export default new UserController();
