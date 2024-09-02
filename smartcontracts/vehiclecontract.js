'use strict';

const { Contract } = require('fabric-contract-api');

class VehicleContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const vehicles = [
            {
                vehicleNumber: 'MH-12-1234',
                owner: 'Raj',
                make: 'Maruti',
                model: 'Swift',
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
                make: 'Honda',
                model: 'City',
                color: 'White',
                year: '2017',
                price: '700000'
            },
            {
                vehicleNumber: 'MH-12-3456',
                owner: 'Rohan',
                make: 'Toyota',
                model: 'Innova',
                color: 'Black',
                year: '2016',
                price: '800000'
            },
            {
                vehicleNumber: 'MH-12-7890',
                owner: 'Rakesh',
                make: 'Ford',
                model: 'Ecosport',
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
    }
}