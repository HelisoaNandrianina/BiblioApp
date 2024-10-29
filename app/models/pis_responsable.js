const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pis_responsable', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: "pis_responsable_email_key"
    },
    motdepasse: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    etat: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "0"
    },
    datecreation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    datesuppression: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pis_responsable',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pis_responsable_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "pis_responsable_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
