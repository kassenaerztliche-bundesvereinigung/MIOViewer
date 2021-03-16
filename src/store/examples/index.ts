/*
 * Copyright (c) 2020 - 2021. Kassenärztliche Bundesvereinigung, KBV
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

import { KBVBundleResource, ParserUtil } from "@kbv/mioparser";

// Example files to import
import IMExample_1_0_0 from "./IM/Example_IM_1_0_0.json";
import ZBExample_1_0_0 from "./ZB/Example_ZB_1_0_0.json";
import MPExample_1_0_0 from "./MP/Example_MR_1_0_0.json";

// A bundle uuid starts with 8 chars 'example' has 7 - should be unique
const EXAMPLE_PREFIX = "example-";

const exampleFiles = [IMExample_1_0_0, ZBExample_1_0_0, MPExample_1_0_0];

const Examples = exampleFiles.map((e) => {
    e.identifier.value = EXAMPLE_PREFIX + ParserUtil.getUuid(e.identifier.value);
    return e as KBVBundleResource;
});

export { EXAMPLE_PREFIX };
export default Examples;