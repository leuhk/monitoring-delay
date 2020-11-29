const axios = require("axios");
const crypto = require("crypto");
const WebSocket = require('ws')
const readline = require("readline");
/**
 * To DO
 * 1. set up api to POST /api/v3/order
 * 2. set up websocket to listen to excutionReport 
 * 3. set up terminal user's input for recvWindow
 */

async function create_order() {

    const querystring = 'symbol=LTCBTC&side=SELL&type=LIMIT&timeInForce=GTC&quantity=0.1&price=0.004&recvWindow=5000&timestamp=' + Date.now()

    const hash = crypto.createHmac("sha256", 'wbA3hCx9yztZRMxuIhqsl9242FtZwkhAaut4W2XORtpy9rHFou9Eefn3VmxUJpGC')
        .update(querystring.toString())
        .digest('hex')
    try {
        const listen = await axios.request({
            url: "https://testnet.binance.vision/api/v3/userDataStream",
            method: "POST",
            headers: {
                "X-MBX-APIKEY": "3mlL812V0wRDUjrU2T6y9Y6h40hHVtjej57PEYDfu4QhGwAzHOnERjhYuL2ZGowM"
            }
        })
        console.log(listen.data)
        const url = "wss://testnet.binance.vision/ws/" + listen.data.listenKey
        const ws = new WebSocket(url);
        ws.on('open', async function open() {
            const result = await axios.request({
                url: "https://testnet.binance.vision/api/v3/order?" + querystring + "&signature=" + hash,
                method: "POST",
                headers: {
                    "X-MBX-APIKEY": "3mlL812V0wRDUjrU2T6y9Y6h40hHVtjej57PEYDfu4QhGwAzHOnERjhYuL2ZGowM"
                }
            })
            console.log(result.data)
        });

        ws.on('message', function incoming(data) {
            console.log(data);
        });


    } catch (err) {
        console.log(err)
    }


}


// create_order();