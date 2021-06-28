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

import { CMR } from "@kbv/mioparser";
import { UI, Util } from "../../../components";

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";
import OrganizationModel from "./OrganizationModel";
import { AdditionalCommentModel, AddressModel, TelecomModel } from "../../Comprehensive";

export type CarePlanType =
    | CMR.V1_0_0.Profile.CMRCarePlanU2U9Result
    | CMR.V1_0_0.Profile.CMRCarePlanU3U4HipScreeningPlan;

export default class CarePlanModel extends BaseModel<CarePlanType> {
    constructor(
        value: CarePlanType,
        fullUrl: string,
        parent: CMR.V1_0_0.Profile.CMRBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        if (CMR.V1_0_0.Profile.CMRCarePlanU3U4HipScreeningPlan.is(this.value)) {
            this.headline = this.value.title;
        } else {
            this.headline = "Weiteres Vorgehen";
        }

        const patientRef = this.value.subject.reference;
        const encounterRef = this.value.encounter.reference;
        const authorRefs = this.value.author ? [this.value.author.reference] : [];

        this.values = [
            ...this.getActivity(),
            Util.UH.getPatientModelValue(patientRef, parent, history),
            Util.UH.getEncounterModelValue(encounterRef, parent, history),
            {
                value: Util.Misc.formatDate(this.value.created),
                label: "Erstellt am"
            },
            ...Util.UH.getPerformerModelValues(
                authorRefs,
                parent,
                history,
                "Erstellt durch"
            ).map((v) => {
                v.subModels = [
                    OrganizationModel,
                    AddressModel,
                    TelecomModel,
                    AdditionalCommentModel
                ];
                return v;
            })
        ];
    }

    protected getActivity(): ModelValue[] {
        const values: ModelValue[] = [];

        type Activity = {
            detail: {
                code: Util.FHIR.Code;
                status: string;
                description?: string;
            };
        };

        this.value.activity.forEach((activity: Activity) => {
            const detail = activity.detail;

            if (CMR.V1_0_0.Profile.CMRCarePlanU3U4HipScreeningPlan.is(this.value)) {
                values.push({
                    value: Util.FHIR.handleCode(detail.code, [
                        CMR.V1_0_0.ConceptMap.CMRHipProceedingGerman
                    ]).join(", "),
                    label: ""
                });
            } else {
                values.push({
                    value: detail.description ?? "-",
                    label: Util.FHIR.handleCode(detail.code).join(", ")
                });
            }
        });

        if (CMR.V1_0_0.Profile.CMRCarePlanU3U4HipScreeningPlan.is(this.value)) {
            return [
                {
                    value: values.map((v) => v.value).join("\n"),
                    label: "",
                    renderAs: UI.ListItem.Bullet
                }
            ];
        } else return values;
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline, // .replace(/:$/, ""),
            label: Util.Misc.formatDate(this.value.created),
            onClick: Util.Misc.toEntryByRef(this.history, this.parent, this.fullUrl),
            sortBy: new Date(this.value.created).getTime().toString()
        };
    }

    public getCoding(): string {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
