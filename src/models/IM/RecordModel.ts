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

import { ParserUtil, KBVBundleResource, Vaccination } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "../BaseModel";
import { OrganizationModel, PractitionerModel } from "./";
import { AdditionalCommentModel, AddressModel, ModelValue, TelecomModel } from "../";

type Bundle = Vaccination.V1_00_000.Profile.BundleEntry;

export default class RecordModel<
    T extends
        | Vaccination.V1_00_000.Profile.RecordPrime
        | Vaccination.V1_00_000.Profile.RecordAddendum
> extends BaseModel<T> {
    constructor(value: T, fullUrl: string, parent: KBVBundleResource, history?: History) {
        super(value, fullUrl, parent, history);

        let headline = "";
        this.value.protocolApplied.forEach((protocol) => {
            headline += protocol.targetDisease.map((disease) => disease.text).join(", ");
        });

        this.headline = headline;

        let vaccineCode = "-";
        if (this.value.vaccineCode.text) vaccineCode = this.value.vaccineCode.text;
        else if (this.value.vaccineCode.coding) {
            const codes: string[] = [];
            this.value.vaccineCode.coding.forEach((coding) => {
                codes.push(
                    ParserUtil.translateCode(
                        coding.code,
                        Vaccination.V1_00_000.ConceptMap.VaccineGerman
                    ).join(", ")
                );
            });
            vaccineCode = codes.join(", ");
        }

        const followUp = this.getFollowUp(this.value);

        const attester = ParserUtil.getSlice<Vaccination.V1_00_000.Extension.Attester>(
            Vaccination.V1_00_000.Extension.Attester,
            this.value.extension
        );

        const entryAttester = Util.IM.getPractitionerroleByExtension(
            parent as Bundle,
            attester
        );

        const organizationAttester = Util.IM.getOrganization(
            parent as Bundle,
            entryAttester?.resource.organization.reference
        );

        const practitionerAttester = Util.IM.getPractitioner(
            parent as Bundle,
            entryAttester?.resource.practitioner.reference
        );

        const enterer = ParserUtil.getSlice<Vaccination.V1_00_000.Extension.Enterer>(
            Vaccination.V1_00_000.Extension.Enterer,
            this.value.extension
        );

        const entryEnterer = Util.IM.getPractitionerroleByExtension(
            parent as Bundle,
            enterer
        );
        const practitionerEnterer = Util.IM.getPractitioner(
            parent as Bundle,
            entryEnterer?.resource.practitioner.reference
        );

        const organizationEnterer = Util.IM.getOrganization(
            parent as Bundle,
            entryEnterer?.resource.organization.reference
        );

        this.values = [
            {
                value: Util.Misc.formatDate(this.value.occurrenceDateTime),
                label: "Datum der Impfung"
            },
            {
                value: vaccineCode,
                label: "Handelsname des Impfstoffes"
            },
            {
                value: this.value.lotNumber ? this.value.lotNumber : "-",
                label: "Chargennummer des Impfstoffes"
            },
            {
                value: this.value.manufacturer ? this.value.manufacturer.display : "-",
                label: "Hersteller des Impfstoffes"
            },
            {
                value: followUp ? Util.Misc.formatDate(followUp.valueDateTime) : "-",
                label: "Terminvorschlag für die Folge- oder Auffrischimpfung"
            },
            {
                value: organizationAttester ? organizationAttester.resource.name : "-",
                label: "Einrichtung in der geimpft wurde",
                onClick: Util.Misc.toEntry(history, parent, organizationAttester, true),
                subEntry: organizationAttester,
                subModels: [
                    OrganizationModel,
                    AddressModel,
                    TelecomModel,
                    AdditionalCommentModel
                ]
            },
            {
                value: Util.IM.getPractitionerName(practitionerAttester?.resource),
                label: "Impfung durch",
                onClick: Util.Misc.toEntry(history, parent, practitionerAttester, true),
                subEntry: practitionerAttester,
                subModels: [PractitionerModel, TelecomModel, AdditionalCommentModel]
            },
            {
                value: organizationEnterer ? organizationEnterer.resource.name : "-",
                label: "Einrichtung in der eingetragen wurde",
                onClick: Util.Misc.toEntry(history, parent, organizationEnterer, true),
                subEntry: organizationEnterer,
                subModels: [
                    OrganizationModel,
                    AddressModel,
                    TelecomModel,
                    AdditionalCommentModel
                ]
            },
            {
                value: Util.IM.getPractitionerName(practitionerEnterer?.resource),
                label: "Eintrag durch",
                onClick: Util.Misc.toEntry(history, parent, practitionerEnterer, true),
                subEntry: practitionerEnterer,
                subModels: [PractitionerModel, TelecomModel, AdditionalCommentModel]
            }
        ];
    }

    protected getFollowUp = (
        record:
            | Vaccination.V1_00_000.Profile.RecordPrime
            | Vaccination.V1_00_000.Profile.RecordAddendum
    ): Vaccination.V1_00_000.Extension.FollowUp | undefined => {
        let result = undefined;
        record.protocolApplied.forEach(
            (
                protocol:
                    | Vaccination.V1_00_000.Profile.RecordPrimeProtocolApplied
                    | Vaccination.V1_00_000.Profile.RecordAddendumProtocolApplied
            ) => {
                if (protocol.extension) {
                    const filtered = protocol.extension.filter((e) =>
                        Vaccination.V1_00_000.Extension.FollowUp.is(e)
                    );
                    result = filtered[0] as Vaccination.V1_00_000.Extension.FollowUp;
                }
            }
        );

        return result;
    };

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
            label: Util.Misc.formatDate(this.value.occurrenceDateTime)
        };
    }
}
