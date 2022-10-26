/*
 * Copyright (c) 2020 - 2022. Kassenärztliche Bundesvereinigung, KBV
 *
 * This file is part of MIO Viewer.
 *
 * MIO Viewer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation version 3 of the License only.
 *
 * MIO Viewer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with MIO Viewer. If not, see <https://www.gnu.org/licenses/>.
 */

import fs from "fs";

import * as ViewerTestUtil from "../../TestUtil";
import * as TestUtil from "@kbv/miotestdata";

import { KBVBundleResource } from "@kbv/mioparser";

import Store, { Actions, AsyncAction } from "../";

describe("<Store/>", () => {
    test("Hinzufügen eines MIOs", (done) => {
        expect(Store.getState().mioState.mios.length).toBe(0);
        const mio = {} as KBVBundleResource;
        Store.dispatch(Actions.addMIO(mio));
        expect(Store.getState().mioState.mios.length).toBe(1);
        done();
    });

    const storeTest = (bundles: string[]) => {
        bundles.forEach((file) => {
            test(file, async () => {
                const store = ViewerTestUtil.createStoreWithMios([]);
                expect(store.getState().mioState.mios.length).toBe(0);
                const blob = new File([fs.readFileSync(file)], "test.file");
                const result = await AsyncAction.parseMIO(store.dispatch, blob);

                expect(result).toBeDefined();
                expect(result instanceof Error).toBeFalsy();

                if (result && !(result instanceof Error)) {
                    const mio = result.value as KBVBundleResource;
                    await store.dispatch(Actions.addMIO(mio));
                    expect(store.getState().mioState.mios.length).toBe(1);
                }
            });
        });
    };

    TestUtil.runAllBundles("Parsen und Hinzufügen eines MIOs", storeTest);

    it("Parsed fehlerhaftes MIO", async () => {
        const store = ViewerTestUtil.createStoreWithMios([]);
        const result = await AsyncAction.parseMIO(
            store.dispatch,
            new File(["{}"], "test.file")
        );

        expect(result).toBeDefined();
        expect(result instanceof Error).toBeTruthy();
        expect(store.getState().mioState.mios.length).toBe(0);
    });
});
