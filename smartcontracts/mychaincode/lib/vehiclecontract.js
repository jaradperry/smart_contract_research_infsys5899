'use strict';

const { Contract } = require('fabric-contract-api');

class VehicleContract extends Contract {

    async InitLedger(ctx) {
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
                make: 'Ford',
                model: 'Ecosport',
                color: 'Silver',
                year: '2015',
                price: '900000'
            },
        ];

        for (let i = 0; i < vehicles.length; i++) {
            vehicles[i].docType = 'vehicle';
            try {
                await ctx.stub.putState(vehicles[i].vehicleNumber, Buffer.from(JSON.stringify(vehicles[i])));
                console.info('Added <--> ', vehicles[i]);
            } catch (error) {
                console.error(`Failed to put state for vehicle ${vehicles[i].vehicleNumber}: ${error}`);
            }
        }

        console.info('============= END : Initialize Ledger ===========');
    }
}

// Export the contract class
module.exports = VehicleContract;
