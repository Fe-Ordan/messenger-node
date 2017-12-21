module.exports = {
  verifyWebhook,
  parseSenderId,
  parseEventType
}

function verifyWebhook(verify_token, qs) {
  const mode = qs['hub.mode'],
        token = qs['hub.verify_token'],
        challenge = qs['hub.challenge']

  console.log('Verifying webhook...');          

  // Check the mode and token sent are correct
  if (mode === 'subscribe' && token === verify_token) {      
    console.log('Webhook verification: SUCCESS');
    return true;
  }
  console.error('Webhook verification: FAILED. Check that your verify_token is set correctly.');
  return false; 
}

function parseSenderId(sender_info) {
  let sender_id = {'type': '', 'id': ''};
  if (sender_info.id) {
    sender_id.id = sender_info.id;
    sender_info.type = 'psid';
  } else if (sender_info.phone_number) {
    sender_id.id = sender_info.phone_number;
    sender_info.type = 'phone_number';
  } else if (sender_info.user_ref) {
    sender_id.id = sender_info.user_ref;
    sender_info.type = 'user_ref';
  }
  return sender_id;
}

function parseEventType (webhook_event) {
  let event = {
    'type': '',
    'subtype': ''
  }
  if (webhook_event.message) {
    if (webhook_event.message.is_echo) {    
      event.type = 'messaging_echoes';               
    } else {
      event.type = 'messages';     
      if (webhook_event.message.quick_reply) {
        event.subtype = 'quick_reply';
      } else {
        event.subtype = 'text';
      } 
    }
  } else if (webhook_event.postback) {
    event.type = 'messaging_postbacks';
  } else if (webhook_event.standby) {
    event.type = 'standby';
  } else if (webhook_event.delivery) {
    event.type = 'messaging_deliveries';
  } else if (webhook_event.read) {
    event.type = 'messaging_reads';    
  } else if (webhook_event.account_linking) {
    event.type = 'messaging_account_linking';
  } else if (webhook_event.optin) {
    event.type = 'messaging_optins';
  } else if (webhook_event.referral) {
    event.type = 'messaging_referrals';
    event.subtype = webhook_event.referral.source;
  } else if (webhook_event.pass_thread_control || webhook_event.take_thread_control) {
    event.type = 'messaging_handovers';
    if (webhook_event.pass_thread_control) {
      event.subtype = 'pass_thread_control';
    } else if (webhook_event.take_thread_control) {
      event.subtype = 'take_thread_control';
    } else if (webhook_event.app_roles) {
      event.subtype = 'app_roles';
    }
  } else if (webhook_event.policy-enforcement) {
    event.type = 'messaging_policy_enforcement';
  } else if (webhook_event.payment) {
    event.type = 'messaging_payments';
  } else if (webhook_event.pre_checkout) {
    event.type = 'messaging_pre_checkouts';
  } else if (webhook_event.checkout_update) {
    event.type = 'messaging_checkout_updates';
  } else if (webhook_event.game_play) {
    event.type = 'messaging_game_plays';
  } else {
    console.error("Webhook received unknown messagingEvent: ", webhook_event);
    event.type = 'unknown';
  }

  return event;
}
