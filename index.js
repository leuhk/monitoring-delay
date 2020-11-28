const axios = require("axios");
const crypto = require("crypto");
const fs = require('fs')
    /**
     * To DO
     * 1. set up api to POST /api/v3/order
     * 2. set up websocket to listen to excutionReport 
     * 3. set up terminal user's input for recvWindow
     */

async function create_order() {
    const pk = fs.readFileSync('./test-prv-key.pem', 'utf8')


    const querystring = 'symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.003&recvWindow=5000&timestamp=' + Date.now()

    const hash = crypto.createHmac("sha256", 'wbA3hCx9yztZRMxuIhqsl9242FtZwkhAaut4W2XORtpy9rHFou9Eefn3VmxUJpGC')
        .update(querystring.toString())
        .digest('hex')
    console.log({ hash: hash })
    try {
        const result = await axios.request({
            url: "https://testnet.binance.vision/api/v3/order?" + querystring + "&signature=" + hash,
            method: "POST",
            headers: {
                "X-MBX-APIKEY": "3mlL812V0wRDUjrU2T6y9Y6h40hHVtjej57PEYDfu4QhGwAzHOnERjhYuL2ZGowM"
            }
        })
        console.log(result)
        return result;
    } catch (err) {
        console.log(err)
    }

}


create_order();