const axios = require("axios");
const crypto = require("crypto");
const WebSocket = require('ws')
const prompt = require('prompt-sync')();
const fs = require('fs');


async function greet() {
    console.log('\n\n\n***********************************************************************************');
    console.log(new Date().toDateString());
    console.log('---------------------------Monitoring order delay----------------------------------\n');

    console.log('Please enter the input as they are asked, if left empty default values are used');

    console.log("type 'e' to exit any time");
    console.log('***********************************************************************************\n\n\n');
}

async function create_order() {
    const final_data = {

        'date': new Date().toUTCString(),
        "orderInfo": {},
        "executionReport": '',

    };
    let symbol = '';
    let side = '';
    let type = '';
    let timeinforce = '';
    let quantity = '';
    let price = '';
    let recvWindow = '';
    const apiKey = "3mlL812V0wRDUjrU2T6y9Y6h40hHVtjej57PEYDfu4QhGwAzHOnERjhYuL2ZGowM"
    const apiSecret = "wbA3hCx9yztZRMxuIhqsl9242FtZwkhAaut4W2XORtpy9rHFou9Eefn3VmxUJpGC"

    const filename = 'saved_data__' + new Date().toUTCString() + '.json';

    try {
        //get listen key for websocket
        const listen = await axios.request({
                url: "https://testnet.binance.vision/api/v3/userDataStream",
                method: "POST",
                headers: {
                    "X-MBX-APIKEY": apiKey
                }
            })
            //new connection to web socket
        const url = "wss://testnet.binance.vision/ws/" + listen.data.listenKey;
        const ws = new WebSocket(url);

        ws.on('open', async function open() {

            try {
                //symbol input
                symbol = prompt('Enter the Symbol(Default: LTCBTC) : ') || '';
                symbol = symbol.trim();
                symbol = symbol.toUpperCase()
                if (symbol == '') {
                    symbol = 'LTCBTC';
                }
                if (symbol == "E") {
                    console.log("BYE BYE!")
                    process.exit()
                }
                console.log(symbol, '.....................ok');

                //side input
                side = prompt('Enter the side(Default: SELL) : ') || '';
                side = side.trim();
                side = side.toUpperCase()
                if (side == '') {
                    side = 'SELL';
                }
                if (side == "E") {
                    console.log("BYE BYE!")
                    process.exit()
                }
                console.log(side, '.....................ok');

                //type input
                type = prompt('Enter the type(Default: LIMIT) : ') || '';
                type = type.trim();
                type = type.toUpperCase()
                if (type == '') {
                    type = 'LIMIT';
                }
                if (type == "E") {
                    console.log("BYE BYE!")
                    process.exit()
                }
                console.log(type, '.....................ok');

                //TimeInForce
                timeinforce = prompt('Enter the timeinforce(Default: GTC) : ') || '';
                timeinforce = timeinforce.trim();
                timeinforce = timeinforce.toUpperCase()
                if (timeinforce == '') {
                    timeinforce = 'GTC';
                }
                if (timeinforce == "E") {
                    console.log("BYE BYE!")
                    process.exit()
                }
                console.log(timeinforce, '.....................ok');

                //Quantity
                quantity = prompt('Enter the quantity(Default: 0.1) : ') || '';
                quantity = quantity.trim();
                if (quantity == '') {
                    quantity = '0.1';
                }
                if (timeinforce == "e") {
                    console.log("BYE BYE!")
                    process.exit()
                }
                console.log(quantity, '.....................ok');

                //price
                price = prompt('Enter the price(Default: 0.004) : ') || '';
                price = price.trim();
                if (price == '') {
                    price = '0.004';
                }
                if (price == "e") {
                    console.log("BYE BYE!")
                    process.exit()
                }
                console.log(price, '.....................ok');

                //recvWindow
                recvWindow = prompt('Enter the recvWindow(Default: 5000) : ') || '';
                recvWindow = recvWindow.trim();
                if (recvWindow == '') {
                    recvWindow = '5000';
                }
                if (recvWindow == 'e') {
                    console.log("BYE BYE!")
                    process.exit();
                }
                console.log(recvWindow, '.....................ok');


                const querystring = `symbol=${symbol}&side=${side}&type=${type}&timeInForce=${timeinforce}&quantity=${quantity}&price=${price}&recvWindow=${recvWindow}&timestamp=` + Date.now();

                // //hashing the query string for api's signature
                const signature = crypto.createHmac("sha256", apiSecret)
                    .update(querystring.toString())
                    .digest('hex')
                    // api post request to create a new order
                const result = await axios.request({
                    url: "https://testnet.binance.vision/api/v3/order?" + querystring + "&signature=" + signature,
                    method: "POST",
                    headers: {
                        "X-MBX-APIKEY": apiKey
                    }
                });
                final_data['orderInfo'] = result.data;
            } catch (err) {
                console.log(err.response.data)
                ws.close()
                return err.response.data
            }


        });

        ws.on('message', function incoming(data) {
            //listen for account's order update

            ws.close()
            final_data['executionReport'] = JSON.parse(data)['E'] || '';

            fs.writeFileSync(filename, JSON.stringify(final_data));
            console.log(final_data)
            console.log('data saved');
            return data;
        });
    } catch (err) {
        return err
    }
}



(async() => {
    await greet();

    try {

        await create_order();
        return;

    } catch (err) {
        // Deal with the fact the chain failed
        console.log(err);
        return err;
    }




})();