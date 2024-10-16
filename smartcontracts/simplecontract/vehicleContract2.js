'use strict';

const { Contract } = require('fabric-contract-api');

class VehicleContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const vehicles = [
            {
                vehicleNumber: 'MH-12-1234',
                owner: 'Jenny',
                make: 'Honda',
                model: 'Accord',
                color: 'Red',
                year: '2019',
                price: '500000'
            },
            {
                vehicleNumber: 'MH-12-5678',
                owner: 'Rahul',
                make: 'Hyundai',
                model: 'i20',
                color: 'Blue',
                year: '2018',
                price: '600000'
            },
            {
                vehicleNumber: 'MH-12-9012',
                owner: 'Ravi',
                make: 'Kia',
                model: 'Sorento',
                color: 'White',
                year: '2017',
                price: '700000'
            },
            {
                vehicleNumber: 'MH-12-3456',
                owner: 'Margiory',
                make: 'Toyota',
                model: 'Corolla',
                color: 'Black',
                year: '2023',
                price: '800000'
            },
            {
                vehicleNumber: 'MH-12-7890',
                owner: 'Rakesh',
                make: 'Toyota',
                model: 'Corolla',
                color: 'Silver',
                year: '2015',
                price: '900000'
            },
        ];

        for (let i = 0; i < vehicles.length; i++) {
            vehicles[i].docType = 'vehicle';
            await ctx.stub.putState(vehicles[i].vehicleNumber, Buffer.from(JSON.stringify(vehicles[i])));
            console.info('Added <--> ', vehicles[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryVehicle(ctx, vehicleNumber) {
        const vehicleAsBytes = await ctx.stub.getState(vehicleNumber); // get the vehicle from chaincode state
        if (!vehicleAsBytes || vehicleAsBytes.length === 0) {
            throw new Error(`${vehicleNumber} does not exist`);
        }
        console.log(vehicleAsBytes.toString());
        return vehicleAsBytes.toString();
    }

    async createVehicle(ctx, vehicleNumber, owner, make, model, color, year, price) {
        console.info('============= START : Create ===========');

        // Simulate user input for vehicle information
        const vehicleInfo = {
            vehicleNumber: vehicleNumber || prompt('Enter vehicle number: '),
            owner: owner || prompt('Enter owner name: '),
            make: make || prompt('Enter vehicle make: '),
            model: model || prompt('Enter vehicle model: '),
            color: color || prompt('Enter vehicle color: '),
            year: year || prompt('Enter vehicle year: '),
            price: price || prompt('Enter vehicle price: ')
        };

        vehicleNumber = vehicleInfo.vehicleNumber;
        owner = vehicleInfo.owner;
        make = vehicleInfo.make;
        model = vehicleInfo.model;
        color = vehicleInfo.color;
        year = vehicleInfo.year;
        price = vehicleInfo.price;
        const allowedMakes = ['Honda', 'Hyundai', 'Kia', 'Toyota'];
        if (!allowedMakes.includes(make)) {
            throw new Error('Invalid vehicle: Only Honda, Hyundai, Kia, or Toyota allowed.');
        }

        const vehicle = {
            vehicleNumber,
            owner,
            make,
            model,
            color,
            year,
            price,
            docType: 'vehicle'
        };

        await ctx.stub.putState(vehicleNumber, Buffer.from(JSON.stringify(vehicle)));
        console.info(`Vehicle ${vehicleNumber} created with owner ${owner}, make ${make}, model ${model}, color ${color}, year ${year}, and price ${price}`);
        console.info('============= END : Create ===========');
        return JSON.stringify(vehicle);
    }
}

// Export the VehicleContract class
module.exports = VehicleContract;
