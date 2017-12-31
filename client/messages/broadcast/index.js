function sendBroadcast (options) {
  return new Promise (async (resolve, reject) => {
    if (!options.message_creative_id) {
      reject('Valid message_creative_id required');
      
    }

    let request_options = options;    
    let response = this.callBroadcastApi(options);
    resolve(response);
  });
}

function startBroadcastReachEstimation (label_id) {
  return new Promise (async (resolve, reject) => {
    let options = {
      'custom_label_id': label_id || true
    }    
    let response = this.callBroadcastApi(options);
    resolve(response);
  });
}

function getBroadcastReachEstimation (reach_estimation_id) {
  return new Promise (async (resolve, reject) => {
    if (!reach_estimation_id) {
      reject('Valid reach_estimation_id required');
      
    }
    let options = {
      'reach_estimation_id': reach_estimation_id
    }
    let response = this.callBroadcastApi(options);
    resolve(response);
  });
}

async function callBroadcastApi (options) {
  return new Promise (async (resolve, reject) => {
    let request_options = {'api_version': 'v2.11'};

    if (options.message_creative_id) {
      request_options.path = '/me/broadcast_messages';
      request_options.payload = options;
    } else if (options.custom_label_id) {
      request_options.path = '/me/broadcast_reach_estimations';
      request_options.payload = {};
      if (typeof options.custom_label_id === 'string') {
        request_options.payload = options;        
      }
    } else if (options.reach_estimation_id) {
      request_options.path = `/${options.reach_estimation_id}`;
    }

    let response = await this.sendGraphRequest(request_options);
    return response;
  });
}

module.exports = {
  sendBroadcast,
  startBroadcastReachEstimation,
  getBroadcastReachEstimation
};