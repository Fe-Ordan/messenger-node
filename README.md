THe `messenger-node` module is a full-features server-side SDK for building bots on Facebook's [Messenger Platform](https://developers.facebook.com/docs/messenger-platform/). The SDK includes two base classes:

- [Webhook](#webhook): Creates an [express.js](expressjs.com) web server for receiving and processing [webhook events](https://developers.facebook.com/docs/messenger-platform/webhook) sent by the Messenger Platform.
- [Client](#creating-a-client-instance): Creates a client object that simplifies sending requests to the Messenger Platform's various APIs.

## Importing the SDK

To use the SDK, start by importing it into your project:

```js
const Messenger = require('messenger-node');
```

Once the SDK is imported, you can create instances of the `Webhook` and `Client` classes.