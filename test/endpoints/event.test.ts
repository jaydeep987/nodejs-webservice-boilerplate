import * as chai from 'chai';
// chai-http is exported as single object (export =)
import chaiHttp = require('chai-http');
import { Application } from 'express';
import * as http from 'http';
import * as mocha from 'mocha'; // tslint:disable-line
import * as mongoose from 'mongoose';

// import { App } from '../../src/app';
import { EventModel } from '../../src/model/event';
import { VirtualMongoServerConnector, pick } from '../test-utils';

chai.use(chaiHttp);
const expect = chai.expect;

const mockEvents = [
  {
    eventTitle: 'Garba@Yokohama',
    subtitle: 'Garbanight presents',
    eventType: 'cultural',
    description: 'Enjoying garba is fun and that if we get chance in foreign country, that can be extra-ordinary fun, isn\'t it ?',
    startDate: '2019/10/02 19:00',
    endDate: '2019/10/02 21:00',
    status: 'open',
  },
  {
    eventTitle: 'Holi',
    subtitle: 'Holi is here',
    eventType: 'cultural',
    description: 'make life colorful',
    startDate: '2019/03/12 19:00',
    endDate: '2019/03/12 20:00',
    status: 'open',
  },
];

describe('Test Event endpoints', () => {
  let virtualMongoConnector: VirtualMongoServerConnector;
  let addedMockData: mongoose.Document[];
  let app: Application;
  let server: http.Server;

  before(async () => {
    virtualMongoConnector = new VirtualMongoServerConnector();

    await virtualMongoConnector.connect();

    // load app after we initialize MONGO_URL in config
    app = await new (await import('../../src/app')).App().createApp();
    server = http.createServer(app);

    // fill data
    addedMockData = await EventModel.create(mockEvents);
  });

  after(async () => {
    chai.request(server).close();
    await virtualMongoConnector.disconnect();
  });

  describe('Endpoint: /event/', () => {
    it('should give all events', async () => {
      const response = await chai
        .request(server)
        .get('/event/');

      expect(response.status).to.equal(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('array');
    });
  });

  describe('Endpoint: /event/:eventId', () => {

    it('should give an error if wrong event id passed', async () => {
      const response = await chai
        .request(server)
        .get('/event/wrongid');

      expect(response).to.be.json;
      expect(response.status).to.equal(500);
    });

    it('shoud give event by id', async () => {
      const response = await chai
        .request(server)
        .get(`/event/${addedMockData[0]._id}`);

      expect(response).to.be.json;
      expect(response.status).to.equal(200);
      expect(response.body).to.not.an('array');
    });
  });

  describe('Endpoint: /event/addnewevent', () => {
    it('should give validation error when nothing passed', async () => {
      const response = await chai
        .request(server)
        .put('/event/addnewevent');

      expect(response).to.be.json;
      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal('error');
      expect(response.body.type).to.equal('Validation Error');
    });

    it('should add new event in database', async () => {
      const data = {
        eventTitle: 'TestCreateEvent',
        subtitle: 'Under testing event',
        eventType: 'test',
        description: 'this is unit test',
        startDate: '2019/10/02 19:00',
        endDate: '2019/10/02 21:00',
        status: 'open',
      };
      const response = await chai
        .request(server)
        .put('/event/addnewevent')
        .send(data);

      expect(response).to.be.json;
      expect(response.status).to.equal(200);
      expect(data).to.eql(pick(response.body, Object.keys(data)));
    });
  });

  describe('Endpoint: /event/deleteevent/:eventId', () => {
    it('should give error if wrong event id is passed', async () => {
      const response = await chai
        .request(server)
        .delete('/event/deleteevent/wrongid');

      expect(response).to.be.json;
      expect(response.status).to.equal(500);
    });

    it('should delete event', async () => {
      const response = await chai
        .request(server)
        .delete(`/event/deleteevent/${addedMockData[0]._id}`);

      expect(response).to.be.json;
      expect(response.status).to.equal(200);

      // verify event by searching it
      const foundEvent = await chai
        .request(server)
        .get(`/event/${addedMockData[0]._id}`);

      expect(foundEvent).to.be.json;
      expect(foundEvent.status).to.equal(404);
    });
  });

});
