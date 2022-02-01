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

import {
    KBVBundleResource,
    Vaccination,
    KBVBase,
    Reference,
    ParserUtil
} from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "../BaseModel";
import { PractitionerModel } from "./";
import { AdditionalCommentModel, ModelValue, TelecomModel } from "../";
import { FHIR } from "../../components/Util";
import * as Models from "../index";

export default class ConditionModel extends BaseModel<Vaccination.V1_1_0.Profile.Condition> {
    constructor(
        value: Vaccination.V1_1_0.Profile.Condition,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = Util.FHIR.handleCode(this.value.code, [
            Vaccination.V1_1_0.ConceptMap.PriorDiseaseGerman
        ]).join(", ");

        const onsetArray: string[] = [];
        const onsetExtension = this.value._onsetString?.extension;

        if (onsetExtension) {
            onsetExtension.forEach((e) => {
                if (Vaccination.V1_1_0.Profile.ConditionOnsetStringLebensphase.is(e)) {
                    onsetArray.push(
                        FHIR.handleCode(e.valueCodeableConcept, [
                            KBVBase.V1_1_1.ConceptMap.StageLifeGerman
                        ]).join(", ")
                    );
                }
            });
        }
        const onset = onsetArray.join(", ");

        const recorders: ModelValue[] = [];

        const practitionerRole =
            ParserUtil.getEntryWithRef<Vaccination.V1_1_0.Profile.Practitionerrole>(
                this.parent,
                [Vaccination.V1_1_0.Profile.Practitionerrole],
                new Reference(this.value.recorder?.reference, this.fullUrl)
            );

        if (practitionerRole) {
            const practitionerRef = practitionerRole.resource.practitioner.reference;
            const organizationRef = practitionerRole.resource.organization.reference;
            const mio = this.parent as Vaccination.V1_1_0.Profile.BundleEntry;

            const practitioner = Util.IM.getPractitioner(
                mio,
                new Reference(practitionerRef, practitionerRole.fullUrl)
            );
            const organization = Util.IM.getOrganization(
                mio,
                new Reference(organizationRef, practitionerRole.fullUrl)
            );

            if (practitioner) {
                recorders.push({
                    value: Util.IM.getPractitionerName(practitioner?.resource),
                    label: "Dokumentiert von",
                    onClick: Util.Misc.toEntry(history, parent, practitioner, true),
                    subEntry: practitioner,
                    subModels: [PractitionerModel, TelecomModel, AdditionalCommentModel]
                });
            }

            if (organization) {
                recorders.push({
                    value: organization.resource.name,
                    label: "Einrichtung in der dokumentiert wurde",
                    onClick: Util.Misc.toEntry(history, parent, organization, true),
                    subEntry: organization,
                    subModels: [
                        Models.IM.OrganizationModel,
                        Models.AddressModel,
                        Models.TelecomModel,
                        Models.AdditionalCommentModel
                    ]
                });
            }
        }

        const notes = this.value.note?.map((n) => n.text);

        let provenance = Util.IM.getProvenance(
            this.parent as Vaccination.V1_1_0.Profile.BundleEntry
        );

        if (provenance) {
            if (
                // TODO: MIOV-493
                !provenance.resource.target.filter((t) =>
                    new Reference(t.reference, this.fullUrl).resolve(t.reference)
                ).length
            ) {
                provenance = undefined;
            }
        }

        this.values = [
            {
                value: this.value.onsetString
                    ? this.value.onsetString
                    : onset
                    ? onset
                    : "-",
                label: "Erkrankt als"
            },
            {
                value: Util.Misc.formatDate(this.value.recordedDate),
                label: "Dokumentiert am"
            },
            {
                value: notes && notes.length ? notes.join(", ") : "-",
                label: "Anmerkungen zur Erkrankung"
            },
            ...recorders,
            {
                value: provenance
                    ? Util.FHIR.handleCode(
                          provenance.resource.agent[0].role[0] as Util.FHIR.Code,
                          [Vaccination.V1_1_0.ConceptMap.SourceofInformationGerman]
                      ).join(", ")
                    : "-",
                label: "Informationsquelle"
            }
        ];
    }

    public toString(): string {
        return (
            this.headline +
            "\n\n" +
            this.values.map((v) => v.label + ": " + v.value).join("\n") +
            "\n\n"
        );
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: Util.Misc.formatDate(this.value.recordedDate),
            onClick: Util.Misc.toEntryByRef(
                this.history,
                this.parent,
                new Reference(this.fullUrl) // TODO:
            )
        };
    }
}
