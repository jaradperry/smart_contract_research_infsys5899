'use strict';

const { Contract } = require('fabric-contract-api');
const vehicleFunctions = require('./vehicleFunctions');

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
        return await vehicleFunctions._queryVehicle(ctx, vehicleNumber);
    }

    async createVehicle(ctx, vehicleNumber, owner, make, model, color, year, price) {
        return await vehicleFunctions._createVehicle(ctx, vehicleNumber, owner, make, model, color, year, price);
    }

    async modifyVehicle(ctx, vehicleNumber, newOwner, newMake, newModel, newColor, newYear, newPrice) {
        return await vehicleFunctions._modifyVehicle(ctx, vehicleNumber, newOwner, newMake, newModel, newColor, newYear, newPrice);
    }

}

module.exports = VehicleContract;

