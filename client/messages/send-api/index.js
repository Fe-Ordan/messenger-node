const util = require('./util'),
      payload = {};

/**
 * @name  SendMessages
 */
function SendAPI (GraphRequest) {
  this.sendQuickReplies = sendQuickReplies;
  this.sendText = sendText;
  this.sendAttachment = sendAttachment;
  this.sendTemplate = sendTemplate;
  this.sendSenderAction = sendSenderAction;
  this.callSendApi = callSendApi.bind(GraphRequest);
}

/**
 * Sends a text message
 * @param  {Object}  recipient
 * @param  {String}  text
 * @return {Promise<Object>}  The API response
 * @function  Client.sendText
 * @memberof  SendMessages#
 */
function sendText (recipient, text) {
  return new Promise (async (resolve, reject) => {
    if (!text) {
      reject('text required');
    }
    
    let payload = {'text': text};

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Sends a text message
 * @param  {Object}  recipient
 * @param  {Object}  quick_replies
 * @param  {String}  text   _Optional._
 * @return {Promise<Object>}  The API response
 * @function  Client.sendQuickReplies
 * @memberof  SendMessages#
 */
function sendQuickReplies (recipient, quick_replies, text) {  
  return new Promise (async (resolve, reject) => {
    if (!quick_replies || !Array.isArray(quick_replies)) {
      reject('quick_replies array required');    
    }

    let payload = {
      'quick_replies': quick_replies
    }

    if (text) payload.text = text;

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Sends a standalone attachment, including images, audio, video, and files
 * @param  {Object}  recipient
 * @param  {Object}  attachment
 * @return {Promise<Object>}  The API response
 * @function  Client.sendAttachment
 * @memberof  SendMessages#
 */
function sendAttachment (recipient, attachment) {
  return new Promise (async (resolve, reject) => {
    if (!attachment) {
      reject('attachment object required');      
    }
    
    let payload = {
      'attachment': attachment
    }

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Sends a template message
 * @param  {Object}  recipient
 * @param  {Object}  template
 * @return {Promise<Object>}  The API response
 * @function  Client.sendTemplate
 * @memberof  SendMessages#
 */
function sendTemplate (recipient, template) {
  return new Promise (async (resolve, reject) => {
    if (!template) {
      reject('template object required');
      return;
    }

    let payload = template;

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Sends a sender action
 * @param  {Object}  recipient
 * @param  {Object}  sender_action
 * @return {Promise<Object>}  The API response
 * @function  Client.sendSenderAction
 * @memberof  SendMessages#
 */
function sendSenderAction (recipient, sender_action) {
  return new Promise (async (resolve, reject) => {
    if (!sender_action) {
      reject('sender_action required');      
    }

    let payload = {
      'sender_action': sender_action
    }

    try {
      let response = await this.callSendApi(recipient, payload);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/* API Request */
function callSendApi (recipient, payload) {  
  return new Promise (async (resolve, reject) => {
    if (!recipient) {
      reject('recipient object required');
    }

    if (!payload) {
      reject('payload required');      
    }

    let request_options = {
      'path': '/me/messages',
      'payload': new util.RequestPayload(recipient, payload)
    }

    if (!request_options.payload) {
      reject('error creating request payload');
    }

    try {    
      let response = await this.sendGraphRequest(request_options);  
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = SendAPI;