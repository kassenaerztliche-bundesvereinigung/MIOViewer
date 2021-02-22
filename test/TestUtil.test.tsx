/*
 * Copyright (c) 2020. Kassenärztliche Bundesvereinigung, KBV
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

import React from "react";

import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { Store } from "redux";
import { Route, RouteComponentProps, Router, match } from "react-router";
import { createMemoryHistory, createLocation } from "history";

import "@testing-library/jest-dom/extend-expect";
import "jest-canvas-mock";
import { mockIonicReact } from "@ionic/react-test-utils";

import { KBVBundleResource } from "mioparser";
import { combineReducers, createStore } from "redux";
import { mioReducer, settingsReducer, initialSettingsState } from "../src/store/reducers";

import { MIOViewerRootState } from "../src/store";

export function renderReduxRoute(
    component: React.ComponentType<any>,
    store: Store,
    route: string,
    path = "/"
): any {
    const history = createMemoryHistory();
    history.push("/");

    const result = render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={path} component={component} />
            </Router>
        </Provider>
    );

    history.push(route);

    return result;
}

export function renderRedux(component: JSX.Element, store: Store): any {
    return render(<Provider store={store}>{component}</Provider>);
}

export function renderRoute(
    component: React.ComponentType<any>,
    route: string,
    path = "/"
): any {
    const history = createMemoryHistory();
    history.push("/");

    const result = render(
        <Router history={history}>
            <Route path={path} component={component} />
        </Router>
    );

    history.push(route);

    return result;
}

export function createStoreWithMios(mios: KBVBundleResource[]): any {
    return createStore<MIOViewerRootState, any, any, any>(
        combineReducers({
            mioState: mioReducer,
            settingsState: settingsReducer
        }),
        {
            mioState: {
                mios: mios,
                loading: false
            },
            settingsState: {
                showIntro: true,
                cookiesAccepted: true
            }
        }
    );
}

export function createRouteProps(): RouteComponentProps {
    const history = createMemoryHistory();
    const path = "/";

    const match: match<any> = { isExact: false, path, url: path, params: {} };

    const location = createLocation(match.url);

    return {
        history,
        match,
        location
    };
}

export function setupIntersectionObserverMock({
    observe = () => null,
    unobserve = () => null
} = {}): void {
    class IntersectionObserver {
        observe = observe;
        unobserve = unobserve;
    }
    Object.defineProperty(window, "IntersectionObserver", {
        writable: true,
        configurable: true,
        value: IntersectionObserver
    });
    Object.defineProperty(global, "IntersectionObserver", {
        writable: true,
        configurable: true,
        value: IntersectionObserver
    });
}

export function setupMutationObserverMock({
    disconnect = () => null,
    observe = () => null
} = {}): void {
    class MutationObserver {
        disconnect = disconnect;
        observe = observe;
    }
    Object.defineProperty(window, "MutationObserver", {
        writable: true,
        configurable: true,
        value: MutationObserver
    });
}

export function mock(): void {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    setupIntersectionObserverMock();
    setupMutationObserverMock();
    mockIonicReact();
}

export function listItemMustBeDefined(label: string, fn: any) {
    const el = fn(`list-item-${label}`);
    expect(el).toBeDefined();
    if (Array.isArray(el)) {
        expect(
            el.filter((el: any) => el.textContent?.replace(label, "") === "-").length
        ).toBe(0);
    } else {
        expect(el.textContent?.replace(label, "")).not.toBe("-");
    }
}
