import sequelize from 'db/models/database';

// Tables
import Experiment from 'db/models/experiment';
import Patient from 'db/models/patient';
import Recording from 'db/models/recording';
import Data from 'db/models/data';

// Database relations
Experiment.hasMany(Patient);
Patient.belongsTo(Experiment);

Patient.hasMany(Recording);
Recording.belongsTo(Patient);

Recording.hasMany(Data);
Data.belongsTo(Recording);

// DB export
const db = {
  sequelize,
  Experiment,
  Patient,
  Recording,
  Data,
};

module.exports = db;

export { Experiment, Patient, Recording, Data, sequelize };
export default db;
