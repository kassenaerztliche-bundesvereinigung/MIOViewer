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

import { PKA, ParserUtil, Reference, KBVBundleResource } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";

export default class RelatedPersonModel extends BaseModel<PKA.V1_0_0.Profile.DPERelatedPersonContactPerson> {
    constructor(
        value: PKA.V1_0_0.Profile.DPERelatedPersonContactPerson,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent as PKA.V1_0_0.Profile.NFDxDPEBundle, history);

        this.headline = Util.Misc.getHumanName(value.name);

        const patientRef = new Reference(value.patient.reference, fullUrl);
        const patient = ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.DPEPatientDPE>(
            parent,
            [PKA.V1_0_0.Profile.DPEPatientDPE],
            patientRef
        )?.resource;

        let patientName = "-";
        if (patient) {
            patientName = Util.Misc.getHumanName(patient.name);
        }

        this.values = [
            {
                value: patientName,
                label: "Bevollmächtigt von",
                onClick: Util.Misc.toEntryByRef(history, parent, patientRef, true)
            }
        ];
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: "Verwandte Person"
        };
    }
}
