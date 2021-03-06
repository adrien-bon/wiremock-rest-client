# WireMock REST Client
The WireMock REST client is a lightweight module to interact with a running [WireMock](http://wiremock.org) server based on the [OpenAPI 3.0 spec](http://wiremock.org/docs/api/) via REST.

<!-- TOC -->
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
    - [Global](#global)
    - [Stub mappings](#stub-mappings)
    - [Recordings](#recordings)
    - [Requests](#requests)
    - [Scenarios](#scenarios)
- [Logging](#logging)
<!-- /TOC -->

## Installation
```
npm install wiremock-rest-client
```

## Usage
The `WireMockRestClient` has 5 services which correspond with request paths as specified in the OpenAPI spec.
- `global` - Global operations
- `mappings` - Operations on stub mappings
- `recordings` - Stub mapping record and snapshot functions
- `requests` - Logged requests and responses received
- `scenarios` - Scenarios support modeling of stateful behavior

See the [API](#api) for the available methods. All methods are related to available operations on the WireMock server endpoints.

```js
import { WireMockRestClient } from 'wiremock-rest-client';

const wireMock = new WireMockRestClient('http://localhost:8080');

const stubMappings = await wireMock.mappings.getAllMappings();

console.log(stubMappings);

await wireMock.global.shutdown();
```

## API

### Global
- `updateGlobalSettings(delayDefinition: DelayDefinition): Promise<void>`
- `resetAll(): Promise<void>`
- `shutdown(): Promise<void>`

Example:
```js
await wireMockRestClient.global.resetAll();
```

### Stub mappings
- `getAllMappings(): Promise<StubMappings>`
- `createMapping(stubMapping: StubMapping): Promise<StubMapping>`
- `createMappingFromFile(fileName: string): Promise<StubMapping>`
- `createMappingsFromDir(directoryName: string): Promise<any>`
- `deleteAllMappings(): Promise<void>`
- `resetAllMappings(): Promise<void>`
- `getMapping(uuid: string): Promise<StubMapping>`
- `updateMapping(uuid: string, stubMapping: StubMapping): Promise<StubMapping>`
- `deleteMapping(uuid: string): Promise<void>`
- `saveAllMappings(): Promise<void>`
- `findByMetaData(contentPattern: ContentPattern): Promise<StubMappings>`
- `removeByMetaData(contentPattern: ContentPattern): Promise<void>`

Example:
```js
await wireMockRestClient.mappings.resetAllMappings();

const stubMapping = {
    "request": {
        "method": "GET",
        "urlPathPattern": "/api/helloworld"
    },
    "response": {
        "status": 200,
        "jsonBody": {"hello": "world"},
        "headers": {
            "Content-Type": "application/json"
        }
    }
};

const response = await wireMock.mappings.createMapping(stubMapping);

// Create mapping from current working directory
await wireMock.mappings.createMappingFromFile('stubs/hello-world.json');

// Create mappings from a directory recursively (based on current working directory)
await wireMock.mappings.createMappingsFromDir('stubs');
```

### Recordings
- `startRecording(recordSpec: RecordSpec): Promise<void>`
- `stopRecording(): Promise<StubMappings>`
- `getRecordingStatus(): Promise<any>`
- `takeSnapshotRecording(snapshotSpec: RecordSpec): Promise<StubMappings>`

Example:
```js
const recordingStatus = wireMockRestClient.recordings.getRecordingStatus();
```

### Requests
- `getAllRequests(): Promise<any>`
- `deleteAllRequests(): Promise<void>`
- `getRequest(uuid: string): Promise<any>`
- `deleteRequest(uuid: string): Promise<void>`
- `resetAllRequests(): Promise<void>`
- `getCount(requestPattern: RequestPattern): Promise<any>`
- `removeRequests(requestPattern: RequestPattern): Promise<any>`
- `removeRequestsByMetadata(contentPattern: ContentPattern): Promise<any>`
- `findRequests(requestPattern: RequestPattern): Promise<any>`
- `getUnmatchedRequests(): Promise<any>`
- `getUnmatchedNearMisses(): Promise<LoggedRequest[]>`
- `getNearMissesByRequest(loggedRequest: LoggedRequest): Promise<any>`
- `getNearMissesByRequestPattern(requestPattern: RequestPattern): Promise<any>`

Example:
```js
const requests = await wireMockRestClient.requests.getAllRequests();
```

### Scenarios
- `getAllScenarios(): Promise<Scenario[]>`
- `resetAllScenarios(): Promise<void>`

Example:
```js
await wireMockRestClient.scenarios.resetAllScenarios();
```

## Proxy
A proxy can be set to connect through as follows.

Set the environment variable `WRC_HTTP_PROXY` to the proxy url. The proxy URL can be HTTP or HTTPS. Credentials for authentication can be passed in the URL.

Example:
```
WRC_HTTP_PROXY=http://username:secret@mycorporateproxy.com
```

## Logging
- Default log level is `info`
- Each log line contains a unique id to trace logs for a single request
- Log level `debug` will log the request body for each request.

A different log level can be configured by setting the environment variable `WRC_LOG_LEVEL` to specific a log level (`trace`/`debug`/`info`/`warn`/`error`/`silent`)

Example:
```
WRC_LOG_LEVEL=debug
```

```shell
2019-12-11T20:43:18.157Z INFO wiremock-rest-client: [10f7dcb9-b8a3-4598-8751-40edb0bd5d2e] Request: [POST] http://localhost:8080/__admin/mappings
2019-12-11T20:43:18.157Z DEBUG wiremock-rest-client: [10f7dcb9-b8a3-4598-8751-40edb0bd5d2e] Request body:  {"request":{"method":"GET","urlPathPattern":"/api/helloworld"},"response":{"status":200,"jsonBody":{"hello":"world"},"headers":{"Content-Type":"application/json"}}}
2019-12-11T20:43:18.158Z INFO wiremock-rest-client: [10f7dcb9-b8a3-4598-8751-40edb0bd5d2e] Response: [201] Created
2019-12-11T20:43:18.158Z INFO wiremock-rest-client: [c3690603-c055-4412-a5b0-497704c09dd0] Request: [POST] http://localhost:8080/__admin/shutdown
2019-12-11T20:43:18.161Z INFO wiremock-rest-client: [c3690603-c055-4412-a5b0-497704c09dd0] Response: [200] OK
```