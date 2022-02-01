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
import { Util } from "../../../components";

import MPBaseModel from "../MPBaseModel";
import { ModelValue } from "../../Types";

const PR = MR.V1_1_0.Profile;

export default class EncounterModel<
    T extends
        | MR.V1_1_0.Profile.EncounterGeneral
        | MR.V1_1_0.Profile.EncounterInpatientTreatment
> extends MPBaseModel<T> {
    constructor(
        value: T,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History,
        customLabel = "Untersucht am"
    ) {
        super(value, fullUrl, parent, history);

        this.headline = this.getPeriod();

        const subjectRef = this.value.subject.reference;
        const patient = ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.PatientMother>(
            this.parent,
            [PR.PatientMother],
            new Reference(subjectRef, this.fullUrl)
        );

        const providerRef = this.value.serviceProvider
            ? this.value.serviceProvider.reference
            : "";
        const provider = ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.Organization>(
            this.parent,
            [PR.Organization],
            new Reference(providerRef, this.fullUrl)
        );

        this.values = [
            {
                value: this.getPeriod(),
                label: customLabel
            },
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

    protected getPeriod(): string {
        const period = this.value.period as { start?: string; end?: string };
        if (Object.prototype.hasOwnProperty.call(period, "start")) {
            return (
                Util.Misc.formatDate(period.start) +
                (period.end ? " - " + Util.Misc.formatDate(period.end) : "")
            );
        }
        return "-";
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.getPeriod(),
            label: "Untersuchungsdatum"
        };
    }
}
