'use strict';

// Import the contract class from your vehicle contract file
const VehicleContract = require('./vehicleContract');

// Import the Fabric Contract API
const { Contract } = require('fabric-contract-api');

// Create a new instance of the VehicleContract
module.exports.VehicleContract = VehicleContract;
module.exports.contracts = [VehicleContract];
