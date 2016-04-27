# Service-Oriented Architecture

![](http://imgh.us/soa.xml-5.svg)

## Service Communication

Services communicate by placing idempotent `Command` and `Query` messages into the target service's queue. `Command` messages are used to mutate data (if validation succeeds), while `Query` messages return data and are always immutable. Following any successful `Command` message, a corresponding `Event` is published so that asynchronous subscribers may take additional action.

`Query` messages must include a `reply-to` subject for sending the response data to. If the response data set is over 1MB then a URL pointing to the data should be returned instead. If `Command` messages wish to be notified on failure then they should also include a `reply-to` subject.

### Authentication & Authorization

Any external requests received by the Web API must have the scope of their token validated by Auth+ **before** it sends a `Command` or `Query` request to Core or Resolver. Additionally, the receiving service may still reject the request for any further reason that can't be validated by the token alone.

### Command Query Responsibility Segregation

Splitting requests by `Command` or `Query` allows for a different number of worker instances and data models for each. For example, if the Resolver service persists data to an SQL database, a normalised form may be mutated by instances responding to `Command` messages, and a denormalised form can be used by instances responding to `Query` messages.

If an external Resolver is used, a small internal service will be needed to translate `Command` and `Query` messages to the external API format. Where appropriate, cached data may be kept internally for fast `Query` responses.

## NATS

NATS is a lightweight, low-latency message broker that can be used for both Remote Procedure Calls (RPC) and Publish-Subscribe (PubSub) messaging models. RPC is useful for Web API requests which may fail and need to return an appropriate error response, while PubSub allows for asynchronous actions following a published `Event`.

### Producers and Consumers

NATS acts as a distributed queue where either all subscribers receive a published message (i.e. PubSub), or one subscriber is picked at random. The former case maps well to published `Event` messages, while the latter is useful for delivering `Command` and `Query` messages from the Web API Service to a single Core or Resolver instance and receiving a response to return to the client.

It should be noted that NATS provides no message persistence, and messages are delivered with **at-most-once** semantics. This trade-off is considered acceptable for the SOTA Server as any Web API requests that do not receive a response from any Core or Resolver instance within a short timeout period should return a `504` response letting the client know they should retry (ideally with exponential back-off).

### Subjects

The Core and Resolver services define three subjects: `[service].command`, `[service].query` and `[service].event`. The first two are input queues for **other services** to send `Command` and `Query` messages to, while the last is an output queue for the **owning service** to publish `Event` messages to.

The Web API service works a bit differently because it does not persist data, respond to queries or publish events. Instead, on an HTTP Request it creates a temporal response subject of the form `web.response.[id]` for receiving data to send in the HTTP Response. The `id` is randomly generated each time and should be large enough to avoid collisions.

For example, when an incoming HTTP Request querying Core data is received, a `Query` message is sent to the `core.query` subject with a reply subject of `web.response.123`. Any message received on `web.response.123` is then returned as an HTTP Response. If no reply is received within the timeout period, a `504` Response is returned instead.

Wildcards can be used for subscriptions. For example, to listen to every `Event` message use subject `*.event`. Listen to all service messages with `[service].*`, and every message in the system with `*.*`.

## Messages

Defining a language-agnostic schema for communication helps control complexity as the system grows. Services can be developed independently as long as they adhere to this interface. Avro is a popular choice for this purpose as it has a compact binary representation while allowing for schema evolution over time.

### Examples

Below are examples of using the Avro Interface Description Language (IDL) to communicate between services.

#### Adding a Package to Core

The following Avro IDL corresponds to a `PUT /packages/:name/:version` Web API Request:

```c
// Package struct
record Package {
    string name;
    string version;
}

// AddPackage Command
record AddPackage {
    Package package;
    bytes binary;
    union{null, string} description = null;
    union{null, string} vendor = null;
}

// PackageAdded Event
record PackageAdded {
    Package package;
    union{null, string} description = null;
    union{null, string} vendor = null;
}

// HTTP 200 OK
record Status_200 {}

// HTTP 400 Bad Request
record Status_400 {
    string code;
    string description;
}

// RPC call from Web API to Core, returning a 204 or 400 response.
union{Status_204, Status_400} addPackage(AddPackage cmd);
```

The steps are:

1. Translate the incoming HTTP Request to an `AddPackage` Command.
2. In a background thread, send an `addPackage` RPC call to the Core service.
3. The Core service unpacks the `cmd` argument and adds the package to its database.
   1. On success, publish a `PackageAdded` event and return a `204` status code.
   2. On failure, return a `400` status with an error code and description.
4. The Web API sends an HTTP Response and closes the background thread.
   1. On a response, return the HTTP Status Code.
   2. On a timeout, return `504`.
