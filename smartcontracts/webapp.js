const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

async function main() {
    try {
        // Load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Define routes
        app.get('/queryAllCars', async (req, res) => {
            const result = await contract.evaluateTransaction('queryAllCars');
            res.status(200).json(JSON.parse(result.toString()));
        });

        app.post('/createCar', async (req, res) => {
            const { carNumber, make, model, color, owner } = req.body;
            await contract.submitTransaction('createCar', carNumber, make, model, color, owner);
            res.status(200).send('Transaction has been submitted');
        });

        app.get('/queryCar/:carNumber', async (req, res) => {
            const result = await contract.evaluateTransaction('queryCar', req.params.carNumber);
            res.status(200).json(JSON.parse(result.toString()));
        });

        app.put('/changeCarOwner/:carNumber', async (req, res) => {
            const { owner } = req.body;
            await contract.submitTransaction('changeCarOwner', req.params.carNumber, owner);
            res.status(200).send('Transaction has been submitted');
        });

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// Ensure the main function is called and the server is started
main().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error(`Failed to start server: ${error}`);
    process.exit(1);
});