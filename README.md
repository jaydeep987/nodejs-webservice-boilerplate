# :sparkles: nodejs-webservice-boilerplate
Node.js webservice awesome boilerplate with typescript, mongodb and tests

## Motivation

I always like to start development as soon as I can, but there always need to spend time by configuring an app.

Building *Node.js* web service can be very easy if requirements are simple. By considering that in mind, I created this boilerplate to provide nice structure of project.

## Features

- Node.js restful api service building easily
- Using mongodb, you can configure either local or remote one
- Configured with *tests*, so you can use *TDD* aproach
- Using *typescript* for better type safe code and great intellisense power. (pre-configured lint and rules)
- Cool logging feature included!
- Configured with Basic security
- Ready with example endpoint (event) and its tests! Tests uses virtual mongodb server.

## Things to keep in mind

- It's very basic boilerplate
- It's not configured with any *authentication* mechanism
- Neither it has any *session* related configuration

## What next ?

You can start using this for your start up of app. And modify it according to your need. Add missing features like session, authentication etc.

Though I will continue to make it advanced and will add those features in separate branch in future.

## Usage

Usage is very easy!

Clone it and start development!

*You can either install mongodb in your local machine or use remote mongodb server like gcloud etc.*

__Start in development mode:__ 

`npm run dev`

__Run tests:__ 

`npm test`

__Run in production:__ 

`npm run prod`

__Lint:__ 

`npm run lint`

__To test:__

default url is `http://localhost:3000`

- *Get All events*
  
  `http://localhost:3000/event`

### Feel free to contribute!