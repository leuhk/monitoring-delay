# monitoring delay time for an order request

### How to start

**Note** that this seed project requires **node >=v6.9.0 and npm >=3**.

In order to start the project import or open this project in IDE:

```bash
# git clone the repository
# cd into the root directory and install the project's dependencies
$ npm install
# Start the Program by `npm start`.
$ npm start

```

# Project overview

This project purpose is to monitor the `executionReport` delay after submitting an order to binance

### Application break down in steps
1. send a API post request to create and retrieve a listen key for web socket
2. create a new web socket connection to listen to User Data Streams
3. submit an order through api while web socket is opened
4. websocket return `executionReport` Event time if an order is matched
5. the execution data is saved as a new JSON file.

### Please note
- If parameters is not entered, default value will be used where symbol = LTCBTC, side = SELL, type = LIMIT, timeInForce = GTC, quantity = 0.1, price =0.004
- enter 'e' to exit program anytime
- the return data will be display on screen and save as a new JSON file.
