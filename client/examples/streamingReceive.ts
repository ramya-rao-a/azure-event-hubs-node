// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
  EventHubClient, EventPosition, OnMessage, OnError, MessagingError, ReceiveOptions, delay
} from "../lib";

const str = "Endpoint=sb://playground-event-hubs.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=W9xHs9lsNo6bfl1oGXPNbxdVX1RsT7QIxQPFtJ+jo0g=";
const path = "ramya-event-hub";


async function main(): Promise<void> {
  const client = EventHubClient.createFromConnectionString(str, path);
  const partitionIds = await client.getPartitionIds();
  const onMessage: OnMessage = async (eventData: any) => {
    console.log("### Actual message:", eventData.body);
  };
  const onError: OnError = (err: MessagingError | Error) => {
    console.log(">>>>> Error occurred: ", err);
  };
  const options: ReceiveOptions = {
    // Receive messages starting from the start.
    eventPosition: EventPosition.fromStart(),
    enableReceiverRuntimeMetric: true
  };
  const rcvHandler = client.receive(partitionIds[0], onMessage, onError, options);
  
  await delay(100);
  console.log("Stopping rcvHandler: ", rcvHandler.name);
  await rcvHandler.stop();
  console.log("Closing client after 100 milliseconds.");
  await client.close();
}

main().catch((err) => {
  console.log("error: ", err);
});
