import sequelize from 'db/models/database';

console.log(sequelize);

import Experiment from 'db/models/experiment';
import Patient from 'db/models/patient';
import Recording from 'db/models/recording';

Experiment.hasMany(Patient);
Patient.belongsTo(Experiment);

Patient.hasMany(Recording);
Recording.belongsTo(Patient);

console.log(Experiment);
console.log(Patient);
console.log(Recording);

const db = {
  sequelize,
  Experiment,
  Patient,
  Recording,
};

module.exports = db;

export { Experiment, Patient, Recording, sequelize };
