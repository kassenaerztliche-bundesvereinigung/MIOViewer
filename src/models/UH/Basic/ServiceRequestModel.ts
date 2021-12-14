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

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";
import OrganizationModel from "./OrganizationModel";
import { AdditionalCommentModel, AddressModel, TelecomModel } from "../../Comprehensive";

export type ServiceRequestType =
    | CMR.V1_0_1.Profile.CMRServiceRequestU1U5ReferralPediatricAudiologyService
    | CMR.V1_0_1.Profile.CMRServiceRequestU1U3PulseOxymetryClarification
    | CMR.V1_0_1.Profile.CMRServiceRequestDentalReferral;

export default class ServiceRequestModel extends BaseModel<ServiceRequestType> {
    constructor(
        value: ServiceRequestType,
        fullUrl: string,
        parent: CMR.V1_0_1.Profile.CMRBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = this.getCoding();

        const patientRef = this.value.subject.reference;
        const encounterRef = this.value.encounter.reference;

        this.values = [
            {
                value: Util.Misc.formatDate(this.value.authoredOn),
                label: "Veranlasst am"
            },
            ...this.getRequester(),
            Util.UH.getPatientModelValue(patientRef, parent, history),
            Util.UH.getEncounterModelValue(encounterRef, parent, history)
        ];

        const reason = this.getReasonReference();
        if (reason) this.values.push(reason);
    }

    protected getRequester(): ModelValue[] {
        const requesterRefs = this.value.requester
            ? [this.value.requester.reference]
            : [];

        const r = Util.UH.getPerformerModelValues(
            requesterRefs,
            this.parent as CMR.V1_0_1.Profile.CMRBundle,
            this.history
        );

        return r.map((value) => {
            value.label = "Veranlasst von";
            value.subModels = [
                OrganizationModel,
                AddressModel,
                TelecomModel,
                AdditionalCommentModel
            ];
            return value;
        });
    }

    protected getReasonReference(): ModelValue | undefined {
        if (
            CMR.V1_0_1.Profile.CMRServiceRequestU1U3PulseOxymetryClarification.is(
                this.value
            )
        ) {
            const refs = this.value.reasonReference.map(
                (reason: { reference: string }) => reason.reference
            );

            if (refs.length) {
                const ref = refs[0];
                const result =
                    ParserUtil.getEntryWithRef<CMR.V1_0_1.Profile.CMRObservationU1U3PulseOxymetryMeasurement>(
                        this.parent,
                        [CMR.V1_0_1.Profile.CMRObservationU1U3PulseOxymetryMeasurement],
                        ref
                    )?.resource;

                if (result) {
                    const CM = CMR.V1_0_1.ConceptMap;
                    const values = Util.FHIR.handleCode(result.code, [
                        CM.CMRPulseOxymetryScreeningMeasurementTypeGerman
                    ]);

                    return {
                        value: values.join(", "),
                        label: "Auffälliger Befund",
                        onClick: Util.Misc.toEntryByRef(this.history, this.parent, ref)
                    };
                }
            }
        }
    }

    public getCoding(resource?: { code?: Util.FHIR.Code }): string {
        if (!resource) resource = this.value;
        return Util.FHIR.getCoding(resource /*, this.codeConceptMap*/);
    }

    public getMainValue(): ModelValue {
        return {
            value: this.getCoding(),
            label: Util.Misc.formatDate(this.value.authoredOn),
            onClick: Util.Misc.toEntryByRef(this.history, this.parent, this.fullUrl),
            sortBy: new Date(this.value.authoredOn).getTime().toString()
        };
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
