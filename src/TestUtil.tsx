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

import React from "react";

import { render, RenderResult, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { combineReducers, createStore, Store } from "redux";
import { match, Route, RouteComponentProps, Router } from "react-router";
import { createLocation, createMemoryHistory } from "history";

import "@testing-library/jest-dom/extend-expect";
import "jest-canvas-mock";

import { KBVBundleResource } from "@kbv/mioparser";
import { mioReducer, settingsReducer } from "./store/reducers";

import { MIOViewerRootState } from "./store";

const waitForOptions = { timeout: 10000, interval: 50 };

export function renderReduxRoute(
    component: React.ComponentType<any>,
    store: Store,
    route: string,
    path = "/"
): Promise<RenderResult> {
    const history = createMemoryHistory();
    history.push(route);

    return waitFor(
        () =>
            render(
                <Provider store={store}>
                    <Router history={history}>
                        <Route path={path} component={component} />
                    </Router>
                </Provider>
            ),
        waitForOptions
    );
}

export function renderRedux(component: JSX.Element, store: Store): any {
    return render(<Provider store={store}>{component}</Provider>);
}

export function renderRoute(
    component: React.ComponentType<any>,
    route: string,
    path = "/"
): Promise<RenderResult> {
    const history = createMemoryHistory();
    history.push(route);

    return waitFor(
        () =>
            render(
                <Router history={history}>
                    <Route path={path} component={component} />
                </Router>
            ),
        waitForOptions
    );
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
                examples: [],
                loading: false
            },
            settingsState: {
                showIntro: true,
                cookiesAccepted: true,
                devMode: false
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
    jest.setTimeout(60 * 1000);

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    setupIntersectionObserverMock();
    setupMutationObserverMock();
}

export function listItemMustBeDefined(label: string, fn: any) {
    const el = fn(`list-item-${label}`);
    expect(el).toBeDefined();
    if (Array.isArray(el)) {
        const notDefinedListItems = el.filter(
            (el: any) => el.textContent?.replace(label, "") === "-"
        ).length;
        expect(notDefinedListItems).toBe(0);
    } else {
        expect(el.textContent?.replace(label, "")).not.toBe("-");
    }
}
