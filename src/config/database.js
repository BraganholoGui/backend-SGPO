import dotenv from 'dotenv'
dotenv.config()
// module.exports = {
//   dialect: 'mysql',
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   // logging: false,
//   define: {
//     timestamp: true,
//     underscored: true,
//     underscoredAll: true,
//     dateStrings: true,
//     typeCast: true,
//     freezeTableName: true
//   },
//   //timezone: "-03:00"
// };

const databaseConfig = {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    logging: false,
    define: {
      timestamp: true,
      underscored: true,
      underscoredAll: true,
      dateStrings: true,
      typeCast: true,
      freezeTableName: true
    },
    //timezone: "-03:00"
  };

  export default databaseConfig;
