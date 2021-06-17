//Ici pour la connexion à la base de données
//const config = require("../config/db.config")
require("dotenv").config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    operatorsAliases: false,

    pool: {
      max: 5, //nombre maximum de connexions autorisées
      min: 0, //nombre minimum de connexions autorisées
      acquire: 30000, //durée maximale, en millisecondes, pendant laquelle le pool cherche à établir la connexion avant qu'un message d'erreur n'apparaisse à l'écran
      idle: 10000, //durée maximale, en millisecondes, pendant laquelle une connexion peut être suspendue avant d'être libérée
    },
  }
);
sequelize
  .authenticate()
  .then(() => console.log('"Connexion à la base de donées réussie !'))
  .catch((error) => {
    console.error(error.message);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const user = (db.user = require("./auth.model")(sequelize, Sequelize));
const post = (db.post = require("./post")(sequelize, Sequelize));
const comment = (db.comment = require("./comment")(sequelize, Sequelize));

//Un usert peut avoir plusieurs post, et un post appartient à cet users la
user.hasMany(post, {
});
post.belongsTo(user, {
  foreignKey: "idUser",
  allowNull: false,
  // onDelete: "cascade", // Pour dire que si l'utilisateur est effacé, on va effacer tous les posts associé a l'id d'un user
});

//un User peut avoir plusieurs comments, et les comments appartients a cet users la
user.hasMany(comment, {
});
comment.belongsTo(user, {
  foreignKey: "idUser",
  allowNull: false,
  // onDelete: "cascade",
});

//Un post peut avoir plusieurs comments, et les comments appartiennent à l'id du post respectifs
post.hasMany(comment, {
  onDelete: 'CASCADE',
  hooks: true
});
comment.belongsTo(post, {
  foreignKey: "postId",//idUser
  allowNull: false,
  // delete: "cascade",
});

module.exports = db;
