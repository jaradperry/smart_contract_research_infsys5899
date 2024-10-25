// vehicleFunctions.js
'use strict';

const { Contract } = require('fabric-contract-api');

async function _queryVehicle(ctx, vehicleNumber) {
    const vehicleAsBytes = await ctx.stub.getState(vehicleNumber); // get the vehicle from chaincode state
    if (!vehicleAsBytes || vehicleAsBytes.length === 0) {
        throw new Error(`The vehicle ${vehicleNumber} does not exist`);
    }
    return vehicleAsBytes.toString();
}
async function _modifyVehicle(ctx, vehicleNumber, newOwner, newMake, newModel, newColor, newYear, newPrice) {
    const vehicleAsBytes = await ctx.stub.getState(vehicleNumber); // get the vehicle from chaincode state
    if (!vehicleAsBytes || vehicleAsBytes.length === 0) {
        throw new Error(`The vehicle ${vehicleNumber} does not exist`);
    }

    const vehicle = JSON.parse(vehicleAsBytes.toString());

    // Update vehicle properties
    vehicle.owner = newOwner || vehicle.owner;
    vehicle.make = newMake || vehicle.make;
    vehicle.model = newModel || vehicle.model;
    vehicle.color = newColor || vehicle.color;
    vehicle.year = newYear || vehicle.year;
    vehicle.price = newPrice || vehicle.price;

    await ctx.stub.putState(vehicleNumber, Buffer.from(JSON.stringify(vehicle)));
    console.info(`Vehicle ${vehicleNumber} modified with new owner ${newOwner}, make ${newMake}, model ${newModel}, color ${newColor}, year ${newYear}, and price ${newPrice}`);
    return JSON.stringify(vehicle);
}

function _simulateVehicleInput(vehicleInfo) {
    // Simulate user input; you can adjust this according to your needs
    return vehicleInfo;
}

function _validateVehicleMake(make) {
    // Implement your make validation logic here
    const validMakes = ['Honda', 'Hyundai', 'Kia', 'Toyota'];
    if (!validMakes.includes(make)) {
        throw new Error(`Invalid vehicle make: ${make}`);
    }
}

function _createVehicleObject(vehicleNumber, owner, make, model, color, year, price) {
    return { vehicleNumber, owner, make, model, color, year, price, docType: 'vehicle' };
}

// Create a private function that only Org1MSP can use
async function _createVehicle(ctx, vehicleNumber, owner, make, model, color, year, price) {
    const clientIdentity = ctx.clientIdentity;
    const mspId = clientIdentity.getMSPID();

    // Ensure only Org1MSP can call this function
    if (mspId !== 'Org1MSP') {
        throw new Error('Unauthorized access: Only Org1MSP can create vehicles.');
    }

    console.info('============= START : Create ===========');

    const vehicleInfo = _simulateVehicleInput({ vehicleNumber, owner, make, model, color, year, price });

    _validateVehicleMake(vehicleInfo.make);

    const vehicle = _createVehicleObject(
        vehicleInfo.vehicleNumber,
        vehicleInfo.owner,
        vehicleInfo.make,
        vehicleInfo.model,
        vehicleInfo.color,
        vehicleInfo.year,
        vehicleInfo.price
    );

    await ctx.stub.putState(vehicle.vehicleNumber, Buffer.from(JSON.stringify(vehicle)));
    console.info(`Vehicle ${vehicleNumber} created with owner ${owner}, make ${make}, model ${model}, color ${color}, year ${year}, and price ${price}`);
    console.info('============= END : Create ===========');
    return JSON.stringify(vehicle);
}

// Export the functions you need
module.exports = {
    _queryVehicle,
    _createVehicle, // Only Org1MSP can call this
    _simulateVehicleInput,
    _validateVehicleMake,
    _createVehicleObject,
    _modifyVehicle
};
