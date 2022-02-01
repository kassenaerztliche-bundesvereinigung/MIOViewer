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

import { fireEvent, render } from "@testing-library/react";

import InputFile from "../";

describe("<InputFile/>", () => {
    it("Rendert", (done) => {
        const { getByTestId } = render(<InputFile />);
        expect(getByTestId("input-file")).toBeDefined();
        fireEvent.change(getByTestId("input-file"), {
            target: {
                files: [new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" })]
            }
        });
        done();
    });
});
