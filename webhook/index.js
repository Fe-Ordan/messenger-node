const express = require('express'),
      body_parser = require('body-parser'),      
      util = require('./util');

/**
 * 
 * @constructor
 * @class Webhook
 * @param {Object} options  Configuration options for your webhook. All options may also be set as environment variables.
 * @param {string} options.verify_token  May also be set as `MESSENGER_VERIFY_TOKEN` in environment variables.
 * @param {string} options.endpoint  _Optional._ Defaults to `/webhook`. May also be set as `MESSENGER_APP_ENDPOINT` in environment variables.
 * @param {string} options.app_secret  _Optional._ Your app secret. Required for `validateSignedRequest()`. May also be set as `MESSENGER_APP_SECRET` in environment variables.
 * @param {string} options.port    _Optional._ Defaults to `1337`. May also be set as `MESSENGER_PORT` in environment variables.
 * @returns {Webhook}
 */
function Webhook (options) {
  let app,
      server,
      port = options.port || process.env.MESSENGER_PORT || 1337,
      endpoint = options.endpoint || process.env.MESSENGER_ENDPOINT || '/webhook',
      app_secret = options.app_secret || process.env.MESSENGER_APP_SECRET,
      verify_token = options.verify_token || process.env.MESSENGER_VERIFY_TOKEN;
  
  if (!verify_token) throw 'VERIFY_TOKEN required to create webhook!';
  if (endpoint.indexOf('/') !== 0) endpoint = '/' + endpoint;

  app = express().use(body_parser.json());  
  addWebhookEndpoint(endpoint, app);
  addVerifyEndpoint(verify_token, endpoint, app);
  
  server = app.listen(port, () => {    
    console.log('webhook is listening on port ' + port);
  });

  this.on = app.on.bind(app);
  this.once = app.once.bind(app);
  this.emit = app.emit;
  this.getInstance = () => { return app };
  this.stopInstance = (callback) => server.close(callback);
  this.getPort = () => { return port };
  this.getEndpoint = () => { return endpoint };
  this.getVerifyToken = () => { return verify_token };
  this.setAppSecret = (secret) => { 
    app_secret = secret;
    return app_secret;
  };
  this.validateSignedRequest = validateSignedRequest;
}

/**
 * Verifies a signed request received by calling [`getcontext()`](https://developers.facebook.com/docs/messenger-platform/webview/context) in the Messenger webview.
 * @param {Object} signed_request  The signed request.
 * @returns {Object} The decrypted signed request.
 * @memberof  Webhook
 */
function validateSignedRequest (signed_request) {
  if (!app_secret) {
    console.error('Cannot validate signed request: app_secret not set');
    return;
  }
  return util.validateSignedRequest(app_secret, signed_request);
}

function addVerifyEndpoint (verify_token, endpoint, app) {
  app.get(endpoint, (req, res) => {
    // Parse params from the verification request
    let verification = util.verifyWebhook(verify_token, req.query);
    if (!verification) {
      res.sendStatus(403);
    }
    res.status(200).send(req.query['hub.challenge']);
  });

  return;
}

function addWebhookEndpoint (endpoint, app) {
  
  app.post(endpoint, (req, res) => {  
    let body = req.body;
    // Check the webhook event is from a Page subscription
    if (body.object === 'page' && body.entry) {

      body.entry.forEach(entry => {
        let webhook_event = entry.messaging[0];        
        let sender_id = util.parseSenderId(webhook_event.sender);
        let event_type = util.parseEventType(webhook_event);
        app.emit(event_type.type, event_type, sender_id, webhook_event)
      });

      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
      
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  });

  return;
}

module.exports = Webhook;