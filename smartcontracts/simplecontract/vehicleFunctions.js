
// Private function to validate vehicle make
function _validateVehicleMake(make) {
    const allowedMakes = ['Honda', 'Hyundai', 'Kia', 'Toyota'];
    if (!allowedMakes.includes(make)) {
        throw new Error('Invalid vehicle: Only Honda, Hyundai, Kia, or Toyota allowed.');
    }
}

// Private function to create vehicle object
function _createVehicleObject(vehicleNumber, owner, make, model, color, year, price) {
    return {
        vehicleNumber,
        owner,
        make,
        model,
        color,
        year,
        price,
        docType: 'vehicle'
    };
}

// Private function to simulate user input or vehicle data processing (can be customized)
function _simulateVehicleInput(vehicleInfo) {
    return {
        vehicleNumber: vehicleInfo.vehicleNumber,
        owner: vehicleInfo.owner,
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        color: vehicleInfo.color,
        year: vehicleInfo.year,
        price: vehicleInfo.price
    };
}

// Private function to query a vehicle from the ledger
async function _queryVehicle(ctx, vehicleNumber) {
    const vehicleAsBytes = await ctx.stub.getState(vehicleNumber); // get the vehicle from chaincode state
    if (!vehicleAsBytes || vehicleAsBytes.length === 0) {
        throw new Error(`${vehicleNumber} does not exist`);
    }
    console.log(vehicleAsBytes.toString());
    return vehicleAsBytes.toString();
}

// Export only the necessary functions, keeping others private
module.exports = {
    _validateVehicleMake,
    _createVehicleObject,
    _simulateVehicleInput,
    _queryVehicle
};
