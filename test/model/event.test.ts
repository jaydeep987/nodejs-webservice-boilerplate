import * as chai from 'chai';
import * as mocha from 'mocha'; // tslint:disable-line
import * as mongoose from 'mongoose';

import { EventModel } from '../../src/model/event';

const expect = chai.expect;

describe('Test Model: Event', () => {
  it('should give validation error', async () => {
    const eventModel = new EventModel();

    try {
      await eventModel.validate();
      // fail it
      expect(false).to.be.true;
    } catch (err) {
      expect(err.errors.eventTitle).to.exist;
      expect(err.errors.eventType).to.exist;
      expect(err.errors.description).to.exist;
      expect(err.errors.startDate).to.exist;
      expect(err.errors.endDate).to.exist;
      expect(err.errors.status).to.exist;
    }
  });

  it('should not give validation error', async () => {
    const eventModel = new EventModel({
      eventTitle: 'Garba@Yokohama',
      subtitle: 'Garbanight presents',
      eventType: 'cultural',
      description: 'Enjoying garba is fun and that if we get chance in foreign country, that can be extra-ordinary fun, isn\'t it ?',
      startDate: '2019/10/02 19:00',
      endDate: '2019/10/02 21:00',
      status: 'open',
    });

    try {
      await eventModel.validate();

      expect(eventModel.errors).to.be.undefined;
    } catch (error) {
      expect(error, `Should not have error: ${error}`).to.not.exist;
    }
  });
});
