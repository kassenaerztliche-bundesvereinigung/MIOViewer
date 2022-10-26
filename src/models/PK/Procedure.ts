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

import { PKA, ST, Reference } from "@kbv/mioparser";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { Util, UI } from "../../components";

export default class ProcedureModel extends BaseModel<PKA.V1_0_0.Profile.NFDProcedure> {
    constructor(
        value: PKA.V1_0_0.Profile.NFDProcedure,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.noHeadline = true;

        const patientRef = new Reference(value.subject.reference, this.fullUrl);
        const patient = Util.PK.getPatientByRef(parent, patientRef)?.resource;

        this.values = [
            {
                value: patient ? Util.PK.getPatientName(patient) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(history, parent, patientRef, true)
            },
            this.getCode(),
            {
                value: this.getPerformed(),
                label: "Durchgeführt am"
            },
            ...this.getAsserter(),
            this.getBodySite()
        ];
    }

    protected getPerformed(): string {
        const values = [
            Util.Misc.formatDate(this.value.performedDateTime),
            this.value.performedString
        ];
        return values.filter((v) => !!v).join(", ");
    }

    protected getAsserter(): ModelValue[] {
        const values: ModelValue[] = [];
        const ref = this.value.asserter?.reference;

        values.push(
            ...Util.PK.handlePractitionerRoleWithOrganization(
                this.parent as PKA.V1_0_0.Profile.NFDxDPEBundle,
                ref,
                this.fullUrl,
                this.history,
                "Durchgeführt durch",
                "Durchgeführt durch"
            )
        );

        return values;
    }

    protected getBodySite(): ModelValue {
        let value = "-";
        const bodySite = this.value.bodySite;
        if (bodySite) {
            value =
                bodySite
                    .map((b) => {
                        const r = b.coding.map((c) => {
                            return Util.FHIR.handleCodeVS(c, [
                                ST.V1_0_0.ValueSet.KBVVSSFHIRICDSEITENLOKALISATIONValueSet
                            ]);
                        });

                        return r.join(", ");
                    })
                    .join(", ") ?? "-";
        }

        return { value, label: "Lokalisation" };
    }

    protected getCode(): ModelValue {
        const codings = this.getCodings();

        const multiple = codings.length > 1;

        return {
            value: codings.join("\n"),
            label:
                this.value._status?.extension
                    ?.map((s) =>
                        s.extension
                            ?.map((e) => e.valueString)
                            .filter((e) => !!e)
                            .join(",")
                    )
                    .join(", ") ?? "-",
            renderAs: multiple ? UI.ListItem.Bullet : undefined
        };
    }

    protected getCodings(): string[] {
        return Util.FHIR.handleCode(this.value.code, [
            PKA.V1_0_0.ConceptMap.NFDProcedureGerman
        ]);
    }

    public getCoding(): string {
        return this.getCodings().join(", ");
    }

    public getMainValue(): ModelValue {
        return {
            value: this.getCoding(),
            label: this.getPerformed()
        };
    }
}
