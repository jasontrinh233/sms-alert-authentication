const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

// create a sequelize instance with local mysql db info
const sequelize = new Sequelize({
   dialect: "mysql",
   host: "localhost",
   port: 8889,
   username: "root",
   password: "root",
   database: "cs576_users"
});

// setup User model
const User = sequelize.define(
   "users",
   {
      id: {
         type: Sequelize.INTEGER(11).UNSIGNED,
         primaryKey: true,
         autoIncrement: true
      },
      email: {
         type: Sequelize.STRING(128),
         unique: true,
         allowNull: false
      },
      password: {
         type: Sequelize.STRING(128),
         allowNull: false
      },
      phone: {
         type: Sequelize.STRING(10),
         allowNull: false
      },
      createdAt: {
         type: Sequelize.DATE
      },
      updatedAt: {
         type: Sequelize.DATE
      }
   },
   {
      hooks: {
         beforeCreate: user => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
         }
      },
      instanceMethods: {
         validPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
         }
      }
   }
);

// create all the defined tables in the specified database.
sequelize
   .sync()
   .then(() =>
      console.log(
         "users table has been successfully created, if one doesn't exist"
      )
   )
   .catch(error => console.log("This error occured", error));

module.exports = User;
