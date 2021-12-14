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

import { History } from "history";

import { ParserUtil, CMR } from "@kbv/mioparser";
import { Util } from "../../../components";

import * as Models from "../../";
import BaseModel from "./CMRBaseModel";

export type EncounterType =
    | CMR.V1_0_1.Profile.CMREncounter
    | CMR.V1_0_1.Profile.PCEncounter
    | CMR.V1_0_1.Profile.PNEncounter;

export default class EncounterModel extends BaseModel<EncounterType> {
    constructor(
        value: EncounterType,
        fullUrl: string,
        parent:
            | CMR.V1_0_1.Profile.CMRBundle
            | CMR.V1_0_1.Profile.PCBundle
            | CMR.V1_0_1.Profile.PNBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        const encounterType = Util.UH.getType(this.value, true);

        this.headline = encounterType ? encounterType : "-";

        const patientRef = this.value.subject.reference;

        this.values = [
            {
                value: Util.Misc.formatDate(this.value.period.start),
                label: "Untersucht am"
            },
            Util.UH.getPatientModelValue(patientRef, parent, history),
            ...this.getParticipants()
        ];

        const provider = this.getServiceProvider();
        if (provider) this.values.push(provider);
    }

    protected getParticipants(label = "Untersucht durch"): Models.ModelValue[] {
        if (CMR.V1_0_1.Profile.PNEncounter.is(this.value)) return [];
        return this.value.participant.map((p) => {
            const ref = p.individual.reference;
            const practitioner =
                ParserUtil.getEntryWithRef<CMR.V1_0_1.Profile.CMRPractitioner>(
                    this.parent,
                    [CMR.V1_0_1.Profile.CMRPractitioner],
                    ref
                );

            return {
                value: Util.UH.getPractitionerName(practitioner?.resource),
                label: label,
                onClick: Util.Misc.toEntry(this.history, this.parent, practitioner),
                subEntry: practitioner,
                subModels: [
                    Models.UH.Basic.PractitionerModel,
                    Models.AddressModel,
                    Models.TelecomModel,
                    Models.AdditionalCommentModel
                ]
            };
        });
    }

    protected getServiceProvider(): Models.ModelValue | undefined {
        if (
            CMR.V1_0_1.Profile.CMREncounter.is(this.value) ||
            CMR.V1_0_1.Profile.PCEncounter.is(this.value)
        ) {
            const provider = this.value.serviceProvider;
            if (provider) {
                const ref = provider.reference;
                const organization =
                    ParserUtil.getEntryWithRef<CMR.V1_0_1.Profile.CMROrganization>(
                        this.parent,
                        [CMR.V1_0_1.Profile.CMROrganization],
                        ref
                    );

                const organizationName = organization?.resource.name;

                return {
                    value: organizationName ? organizationName : "-",
                    label: "Einrichtung",
                    onClick: Util.Misc.toEntry(this.history, this.parent, organization),
                    subEntry: organization,
                    subModels: [
                        Models.UH.Basic.OrganizationModel,
                        Models.AddressModel,
                        Models.TelecomModel,
                        Models.AdditionalCommentModel
                    ]
                };
            } else {
                return {
                    value: "-",
                    label: "Einrichtung"
                };
            }
        }
    }

    getMainValue(): Models.ModelValue {
        return {
            value: Util.Misc.formatDate(this.value.period.start),
            label: "-"
        };
    }

    public getCoding(): string {
        return "This profile has no coding";
    }
}
