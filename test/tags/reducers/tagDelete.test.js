import * as sinon from 'sinon';
import reducer, {
  DELETE_TAG_START,
  DELETE_TAG_ERROR,
  DELETE_TAG,
  TAG_DELETED,
  tagDeleted,
  deleteTag,
} from '../../../src/tags/reducers/tagDelete';

describe('tagDeleteReducer', () => {
  describe('reducer', () => {
    it('returns loading on DELETE_TAG_START', () => {
      expect(reducer({}, { type: DELETE_TAG_START })).toEqual({
        deleting: true,
        error: false,
      });
    });

    it('returns error on DELETE_TAG_ERROR', () => {
      expect(reducer({}, { type: DELETE_TAG_ERROR })).toEqual({
        deleting: false,
        error: true,
      });
    });

    it('returns tag names on DELETE_TAG', () => {
      expect(reducer({}, { type: DELETE_TAG })).toEqual({
        deleting: false,
        error: false,
      });
    });
  });

  describe('tagDeleted', () => {
    it('returns action based on provided params', () =>
      expect(tagDeleted('foo')).toEqual({
        type: TAG_DELETED,
        tag: 'foo',
      }));
  });

  describe('deleteTag', () => {
    const createApiClientMock = (result) => ({
      deleteTags: sinon.fake.returns(result),
    });
    const dispatch = sinon.spy();
    const getState = () => ({});

    afterEach(() => dispatch.resetHistory());

    it('calls API on success', async () => {
      const expectedDispatchCalls = 2;
      const tag = 'foo';
      const apiClientMock = createApiClientMock(Promise.resolve());
      const dispatchable = deleteTag(() => apiClientMock)(tag);

      await dispatchable(dispatch, getState);

      expect(apiClientMock.deleteTags.callCount).toEqual(1);
      expect(apiClientMock.deleteTags.getCall(0).args).toEqual([[ tag ]]);

      expect(dispatch.callCount).toEqual(expectedDispatchCalls);
      expect(dispatch.getCall(0).args).toEqual([{ type: DELETE_TAG_START }]);
      expect(dispatch.getCall(1).args).toEqual([{ type: DELETE_TAG }]);
    });

    it('throws on error', async () => {
      const expectedDispatchCalls = 2;
      const error = 'Error';
      const tag = 'foo';
      const apiClientMock = createApiClientMock(Promise.reject(error));
      const dispatchable = deleteTag(() => apiClientMock)(tag);

      try {
        await dispatchable(dispatch, getState);
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(apiClientMock.deleteTags.callCount).toEqual(1);
      expect(apiClientMock.deleteTags.getCall(0).args).toEqual([[ tag ]]);

      expect(dispatch.callCount).toEqual(expectedDispatchCalls);
      expect(dispatch.getCall(0).args).toEqual([{ type: DELETE_TAG_START }]);
      expect(dispatch.getCall(1).args).toEqual([{ type: DELETE_TAG_ERROR }]);
    });
  });
});
