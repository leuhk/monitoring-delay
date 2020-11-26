const axios = require("axios");
/**
 * To DO
 * 1. set up api to POST /api/v3/order
 * 2. set up websocket to listen to excutionReport 
 * 3. set up terminal user's input for recvWindow
 */

async function create_order() {
    const result = await axios.get("https://testnet.binance.vision/api/v3/exchangeInfo")
    console.log(result.data)
    return result;
}

create_order();