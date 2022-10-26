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

import { History } from "history";

import { PKA, KBVBundleResource } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";

export default class OrganizationModel extends BaseModel<PKA.V1_0_0.Profile.NFDOrganization> {
    constructor(
        value: PKA.V1_0_0.Profile.NFDOrganization,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent as PKA.V1_0_0.Profile.NFDxDPEBundle, history);

        this.headline = value.name;
        this.values = [this.getType()];
    }

    public getType(): ModelValue {
        const label = "Art der Organisation";
        const value = this.value.type.map((t) => Util.FHIR.handleCode(t));
        return { value: value.join(", ") ?? "-", label };
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: "-"
        };
    }
}
