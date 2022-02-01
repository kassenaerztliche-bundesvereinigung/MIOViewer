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

import { ParserUtil, MR, Reference } from "@kbv/mioparser";
import { Util } from "../../components";

import MPBaseModel from "./MPBaseModel";
import { ModelValue } from "../Types";

export default class EncounterArrivalMaternityHospitalModel extends MPBaseModel<MR.V1_1_0.Profile.EncounterArrivalMaternityHospital> {
    constructor(
        value: MR.V1_1_0.Profile.EncounterArrivalMaternityHospital,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Vorstellung in einer Entbindungsklinik";

        const subjectRef = this.value.subject.reference;
        const patient = ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.PatientMother>(
            this.parent,
            [MR.V1_1_0.Profile.PatientMother],
            new Reference(subjectRef, this.fullUrl)
        );

        const providerRef = this.value.serviceProvider.reference;
        const provider = ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.Organization>(
            this.parent,
            [MR.V1_1_0.Profile.Organization],
            new Reference(providerRef, this.fullUrl)
        );

        this.values = [
            {
                value: patient ? Util.MP.getPatientMotherName(patient.resource) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(
                    history,
                    parent,
                    new Reference(subjectRef, this.fullUrl),
                    true
                )
            },
            {
                value: Util.Misc.formatDate(this.value.period.start),
                label: this.getCoding()
            },
            {
                value: provider && provider.resource.name ? provider.resource.name : "-",
                label: "Einrichtung",
                onClick: Util.Misc.toEntryByRef(
                    history,
                    parent,
                    new Reference(providerRef, this.fullUrl),
                    true
                )
            }
        ];
    }

    public getCoding(): string {
        return this.value.type
            .map((t) => {
                return t.coding.map((c) => {
                    return c._display?.extension?.map((e) => {
                        return e.extension?.map((ex) => ex.valueString);
                    });
                });
            })
            .join(",");
    }

    public getMainValue(): ModelValue {
        return {
            value: Util.Misc.formatDate(this.value.period.start),
            label: this.getCoding()
        };
    }
}
