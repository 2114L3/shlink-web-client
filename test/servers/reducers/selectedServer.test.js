import reduce, {
  _selectServer,
  RESET_SELECTED_SERVER,
  resetSelectedServer,
  SELECT_SERVER,
} from '../../../src/servers/reducers/selectedServer';
import * as sinon from 'sinon';
import { RESET_SHORT_URL_PARAMS } from '../../../src/short-urls/reducers/shortUrlsListParams';

describe('selectedServerReducer', () => {
  describe('reduce', () => {
    it('returns default when action is not handled', () =>
      expect(reduce(null, { type: 'unknown' })).toEqual(null)
    );

    it('returns default when action is RESET_SELECTED_SERVER', () =>
      expect(reduce(null, { type: RESET_SELECTED_SERVER })).toEqual(null)
    );

    it('returns selected server when action is SELECT_SERVER', () => {
      const selectedServer = { id: 'abc123' };
      expect(reduce(null, { type: SELECT_SERVER, selectedServer })).toEqual(selectedServer);
    });
  });

  describe('resetSelectedServer', () => {
    it('returns proper action', () => {
      expect(resetSelectedServer()).toEqual({ type: RESET_SELECTED_SERVER });
    });
  });

  describe('selectServer', () => {
    const ShlinkApiClientMock = {
      setConfig: sinon.spy()
    };
    const serverId = 'abc123';
    const selectedServer = {
      id: serverId
    };
    const ServersServiceMock = {
      findServerById: sinon.fake.returns(selectedServer)
    };

    afterEach(() => {
      ShlinkApiClientMock.setConfig.resetHistory();
      ServersServiceMock.findServerById.resetHistory();
    });

    it('dispatches proper actions', () => {
      const dispatch = sinon.spy();

      _selectServer(ShlinkApiClientMock, ServersServiceMock, serverId)(dispatch);

      expect(dispatch.callCount).toEqual(2);
      expect(dispatch.firstCall.calledWith({ type: RESET_SHORT_URL_PARAMS })).toEqual(true);
      expect(dispatch.secondCall.calledWith({
        type: SELECT_SERVER,
        selectedServer
      })).toEqual(true);
    });

    it('invokes dependencies', () => {
      _selectServer(ShlinkApiClientMock, ServersServiceMock, serverId)(() => {});

      expect(ShlinkApiClientMock.setConfig.callCount).toEqual(1);
      expect(ServersServiceMock.findServerById.callCount).toEqual(1);
    });
  });
});
