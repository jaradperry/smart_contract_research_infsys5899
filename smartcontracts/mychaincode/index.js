'use strict';

const VehicleContract = require('./lib/vehicleContract');

const _VehicleContract = VehicleContract;
module.exports.VehicleContract = _VehicleContract;
module.exports.contracts = [VehicleContract];