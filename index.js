const axios = require("axios");
const crypto = require("crypto");
const WebSocket = require('ws')
const prompt = require('prompt-sync')();


async function create_order() {

    try {
        //get listen key for websocket
        const listen = await axios.request({
                url: "https://testnet.binance.vision/api/v3/userDataStream",
                method: "POST",
                headers: {
                    "X-MBX-APIKEY": "3mlL812V0wRDUjrU2T6y9Y6h40hHVtjej57PEYDfu4QhGwAzHOnERjhYuL2ZGowM"
                }
            })
            //new connection to web socket
        const url = "wss://testnet.binance.vision/ws/" + listen.data.listenKey
        const ws = new WebSocket(url);

        ws.on('open', async function open() {
            try {

                var recvWindow = prompt('Enter the recvWindow Here : ');

                if (!recvWindow || Number(recvWindow) >= 60000 || Number(recvWindow) <= 800) {
                    recvWindow = '5000'
                }
                const querystring = "symbol=LTCBTC&side=SELL&type=LIMIT&timeInForce=GTC&quantity=0.1&price=0.004&recvWindow=" + recvWindow + "&timestamp=" + Date.now()
                    // const querystring = 'symbol=' + symbol.toUpperCase() + '&side=' + side.toUpperCase() + '&type=' + type.toUpperCase() + '&timeInForce=GTC&quantity=' + quantity + '&price=' + price + '&recvWindow=' + recvWindow + '&timestamp=' + Date.now()
                const hash = crypto.createHmac("sha256", 'wbA3hCx9yztZRMxuIhqsl9242FtZwkhAaut4W2XORtpy9rHFou9Eefn3VmxUJpGC')
                    .update(querystring.toString())
                    .digest('hex')
                    // api post request to create a new order
                const result = await axios.request({
                    url: "https://testnet.binance.vision/api/v3/order?" + querystring + "&signature=" + hash,
                    method: "POST",
                    headers: {
                        "X-MBX-APIKEY": "3mlL812V0wRDUjrU2T6y9Y6h40hHVtjej57PEYDfu4QhGwAzHOnERjhYuL2ZGowM"
                    }
                })
                console.log(result.data)
            } catch (err) {
                console.log(err)
            }

        });

        ws.on('message', function incoming(data) {
            //listen for account's order update
            const json = JSON.parse(data)
            console.log({ event: json.e, eventTime: json.E });
            ws.close()
        });

    } catch (err) {
        console.log(err)
    }
}




create_order();