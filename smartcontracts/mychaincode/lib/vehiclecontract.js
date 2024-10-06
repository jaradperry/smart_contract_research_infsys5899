'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class VehicleContract extends Contract {

    async InitLedger(ctx) {
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

        for (const vehicle of vehicles) {
            vehicle.docType = 'vehicle';
            await ctx.stub.putState(vehicle.vehicleNumber, Buffer.from(stringify(sortKeysRecursive(vehicle))));
        }
    }

    async CreateVehicle(ctx, vehicleNumber, owner, make, model, color, year, price) {
        const exists = await this.VehicleExists(ctx, vehicleNumber);
        if (exists) {
            throw new Error(`The vehicle ${vehicleNumber} already exists`);
        }

        const vehicle = {
            vehicleNumber,
            owner,
            make,
            model,
            color,
            year,
            price
        };
        await ctx.stub.putState(vehicleNumber, Buffer.from(stringify(sortKeysRecursive(vehicle))));
        return JSON.stringify(vehicle);
    }

    async ReadVehicle(ctx, vehicleNumber) {
        const vehicleJSON = await ctx.stub.getState(vehicleNumber);
        if (!vehicleJSON || vehicleJSON.length === 0) {
            throw new Error(`The vehicle ${vehicleNumber} does not exist`);
        }
        return vehicleJSON.toString();
    }

    async UpdateVehicle(ctx, vehicleNumber, owner, make, model, color, year, price) {
        const exists = await this.VehicleExists(ctx, vehicleNumber);
        if (!exists) {
            throw new Error(`The vehicle ${vehicleNumber} does not exist`);
        }

        const updatedVehicle = {
            vehicleNumber,
            owner,
            make,
            model,
            color,
            year,
            price
        };
        return ctx.stub.putState(vehicleNumber, Buffer.from(stringify(sortKeysRecursive(updatedVehicle))));
    }

    async DeleteVehicle(ctx, vehicleNumber) {
        const exists = await this.VehicleExists(ctx, vehicleNumber);
        if (!exists) {
            throw new Error(`The vehicle ${vehicleNumber} does not exist`);
        }
        return ctx.stub.deleteState(vehicleNumber);
    }

    async VehicleExists(ctx, vehicleNumber) {
        const vehicleJSON = await ctx.stub.getState(vehicleNumber);
        return vehicleJSON && vehicleJSON.length > 0;
    }

    async TransferVehicle(ctx, vehicleNumber, newOwner) {
        const vehicleString = await this.ReadVehicle(ctx, vehicleNumber);
        const vehicle = JSON.parse(vehicleString);
        const oldOwner = vehicle.owner;
        vehicle.owner = newOwner;
        await ctx.stub.putState(vehicleNumber, Buffer.from(stringify(sortKeysRecursive(vehicle))));
        return oldOwner;
    }

    async GetAllVehicles(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = VehicleContract;
