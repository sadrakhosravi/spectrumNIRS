const { Model } = require('sequelize');
module.exports = (sequelize: any, DataTypes: any) => {
  class Experiment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models: any) {
      // define association here
    }
  }
  Experiment.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Experiment',
    }
  );
  return Experiment;
};
