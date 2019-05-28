import MockAsyncStorage from "mock-async-storage";

import {
  getOfflineUpdatesFlagState,
  getPersistedUser,
  logoutUserLocal,
  saveUserToAsyncStorage,
  setOfflineUpdatesFlagState,
} from "@src/tools/async-store";
import MOCKS from "@tests/mocks";

const mockStorage = () => {
  const mockImpl = new MockAsyncStorage();
  jest.mock("AsyncStorage", () => mockImpl);
};

const release = () => jest.unmock("AsyncStorage");

beforeEach(() => mockStorage());
afterEach(() => release());

describe("async-store utils", () => {
  test("user persistance", async () => {
    const initialState = await getPersistedUser();
    expect(initialState).toBe(undefined);

    await saveUserToAsyncStorage(MOCKS.USER);

    const userExists = await getPersistedUser();
    expect(userExists).toEqual(MOCKS.USER);

    await logoutUserLocal();

    const userLoggedOut = await getPersistedUser();
    expect(userLoggedOut).toBe(undefined);
  });

  test("offline updates flag", async () => {
    const initialState = await getOfflineUpdatesFlagState();
    expect(initialState.shouldProcessRequests).toBeFalsy();

    await setOfflineUpdatesFlagState({ shouldProcessRequests: true });

    const trueState = await getOfflineUpdatesFlagState();
    expect(trueState.shouldProcessRequests).toBeTruthy();

    await setOfflineUpdatesFlagState({ shouldProcessRequests: false });

    const falseState = await getOfflineUpdatesFlagState();
    expect(falseState.shouldProcessRequests).toBeFalsy();
  });
});
