# Messenger Platform Node SDK

## Creating a webhook

```js
const Messenger = require('./index');
const Instance = new Messenger();
const Webhook = Instance.Webhook({'verify_token':'<YOUR VERIFY TOKEN'});
```

## Subscribing to events

```js
Webhook.event.on('<EVENT NAME>', (event, sender, webhook_event) => {
  // do something
});
```

For a list of available webhook events, see the [list in the Messenger Platform docs](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/).

### Callback Arguments
| **Name** | **Type** | **Description** | **Example** |
|------|------|-------------|--------|
| event | Object | Contains the event type and subtype. If the webhook has no subtype, then `subtype` will be `null` | `{'type': 'messaging_handovers', 'subtype': 'pass_thread_control}` |
| sender | Object | Contains the ID and ID type. | `{'id': '84736289974242', 'type': 'PSID'}` |
| webhook_event | Object | The complete webhook event parsed from the `messaging` array of the received `POST` request. | For webhook event formats and details, see the [webhook event reference](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/) in the Messenger Platform docs. |
