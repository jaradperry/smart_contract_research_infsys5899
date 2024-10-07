'use strict';

const VehicleContract = require('./lib/vehiclecontract');

const _VehicleContract = VehicleContract;
module.exports.VehicleContract = _VehicleContract;
module.exports.contracts = [VehicleContract];