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

import { ParserUtil, KBVBundleResource, Vaccination, MR, CMR } from "@kbv/mioparser";

import BaseModel from "../BaseModel";
import { ModelValue } from "../Types";

export type AdditionalCommentType =
    | Vaccination.V1_00_000.Profile.Practitioner
    | Vaccination.V1_00_000.Profile.PractitionerAddendum
    | Vaccination.V1_00_000.Profile.Organization
    | MR.V1_00_000.Profile.Organization
    | MR.V1_00_000.Profile.Practitioner
    | MR.V1_00_000.Profile.PatientChild
    | MR.V1_00_000.Profile.DiagnosticReportUltrasoundI
    | CMR.V1_00_000.Profile.CMRPractitioner;

export default class AdditionalCommentModel extends BaseModel<AdditionalCommentType> {
    constructor(
        value: AdditionalCommentType,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History,
        protected customLabel?: string
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "";

        const additionalComments = ParserUtil.getSlices<
            | Vaccination.V1_00_000.Extension.AdditionalComment
            | MR.V1_00_000.Profile.OrganizationErgaenzendeAngaben
            | MR.V1_00_000.Profile.PractitionerErgaenzendeAngaben
            | MR.V1_00_000.Profile.PatientChildErgaenzendeAngaben
            | MR.V1_00_000.Profile.DiagnosticReportUltrasoundIErgaenzendeAngaben
        >(
            [
                Vaccination.V1_00_000.Extension.AdditionalComment,
                MR.V1_00_000.Profile.OrganizationErgaenzendeAngaben,
                MR.V1_00_000.Profile.PractitionerErgaenzendeAngaben,
                MR.V1_00_000.Profile.PatientChildErgaenzendeAngaben,
                MR.V1_00_000.Profile.DiagnosticReportUltrasoundIErgaenzendeAngaben
            ],
            this.value.extension
        );

        let label = customLabel ? customLabel : "Ergänzende Angaben";
        if (MR.V1_00_000.Profile.DiagnosticReportUltrasoundI.is(value)) {
            label = "Bemerkungen";
        }

        this.values = [
            {
                value: additionalComments.length
                    ? additionalComments.map((c) => c.valueString).join(", ")
                    : "-",
                label
            }
        ];
    }

    public toString(): string {
        return this.values
            .filter((v) => v.value !== "-" && !v.label.includes("Geburtsname"))
            .map((v) => v.label + ": " + v.value)
            .join("\n");
    }

    public getMainValue(): ModelValue {
        return this.values[0];
    }
}
