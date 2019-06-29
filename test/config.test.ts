import * as chai from 'chai';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import { EnvVars } from '../src/common/config';

const expect = chai.expect;

describe('Test app config', () => {
  it('should check required config', () => {
    const nconfMock: { [key: string]: any } = {
      argv: sinon.stub().returnsThis(),
      env: sinon.stub().returnsThis(),
      file: sinon.stub().returnsThis(),
      defaults: sinon.stub().returnsThis(),
      get: (setting: string): string => nconfMock[setting],
    };

    /** Constructs message for given setting */
    function getMsg(setting: string): string {
      return `You must set ${setting} as environment var or in config.json`;
    }

    const testFunc = () => {
      proxyquire('../src/common/config', { nconf: nconfMock }).default;
    };

    expect(testFunc).to.throw(Error, getMsg(EnvVars.MONGODB_URI));

    nconfMock[EnvVars.MONGODB_URI] = 'someurl';
    expect(testFunc).to.not.throw(Error, getMsg(EnvVars.MONGODB_URI));
    expect(testFunc).to.throw(Error, getMsg(EnvVars.NODE_ENV));

    nconfMock[EnvVars.NODE_ENV] = 'test';
    expect(testFunc).to.not.throw(Error, getMsg(EnvVars.NODE_ENV));
    expect(testFunc).to.throw(Error, getMsg(EnvVars.PORT));

    nconfMock[EnvVars.PORT] = '3000';
    expect(testFunc).to.not.throw(Error, getMsg(EnvVars.PORT));
  });
});
