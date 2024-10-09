'use strict';

const VehicleContract = require('./vehicleContract');

// Import the Fabric Contract API start function
require('fabric-contract-api');

// This will allow the contract to be properly recognized and executed in the Fabric network.
module.exports.VehicleContract = VehicleContract;

module.exports.contracts = [VehicleContract];
