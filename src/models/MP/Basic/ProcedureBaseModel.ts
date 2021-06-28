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

import { ParserUtil, MR } from "@kbv/mioparser";
import { Util } from "../../../components";

import MPBaseModel from "../MPBaseModel";
import { Content } from "pdfmake/interfaces";
import { ModelValue } from "../../Types";

export default class ProcedureBaseModel<
    T extends
        | MR.V1_0_0.Profile.ProcedureAntiDProphylaxis
        | MR.V1_0_0.Profile.ProcedureCounselling
> extends MPBaseModel<T> {
    constructor(
        value: T,
        fullUrl: string,
        parent: MR.V1_0_0.Profile.Bundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = this.getCoding();

        const subjectRef = this.value.subject.reference;
        const patient = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.PatientMother>(
            this.parent,
            [MR.V1_0_0.Profile.PatientMother],
            subjectRef
        );

        const performerRefs = this.value.performer?.map((p) => p.actor.reference);
        let performerName = "-";
        let toPerformerEntry = undefined;
        if (performerRefs?.length) {
            // There is only one (0..1)
            const performer = ParserUtil.getEntryWithRef<
                MR.V1_0_0.Profile.Organization | MR.V1_0_0.Profile.Practitioner
            >(
                this.parent,
                [MR.V1_0_0.Profile.Organization, MR.V1_0_0.Profile.Practitioner],
                performerRefs[0]
            );

            if (performer) {
                toPerformerEntry = Util.Misc.toEntry(history, parent, performer, true);

                if (MR.V1_0_0.Profile.Organization.is(performer.resource)) {
                    if (performer.resource.name) performerName = performer.resource.name;
                } else if (MR.V1_0_0.Profile.Practitioner.is(performer.resource)) {
                    performerName = Util.MP.getPractitionerName(performer.resource);
                }
            }
        }

        const encounterRef = this.value.encounter.reference;
        const encounter = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.EncounterGeneral>(
            this.parent,
            [MR.V1_0_0.Profile.EncounterGeneral],
            encounterRef
        );
        const toEncounterEntry = Util.Misc.toEntry(history, parent, encounter, true);

        this.values = [];

        this.values.push(
            {
                value: patient ? Util.MP.getPatientMotherName(patient.resource) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(history, parent, subjectRef, true)
            },
            {
                value: encounter
                    ? Util.Misc.formatDate(encounter.resource.period.start)
                    : "-",
                label: "Untersuchungsdatum",
                onClick: toEncounterEntry
            },
            {
                value: Util.Misc.formatDate(this.value.performedDateTime),
                label: "Durchgeführt am"
            },
            {
                value: performerName,
                label: "Durchgeführt durch",
                onClick: toPerformerEntry
            }
        );

        const note = this.getNote();
        if (note) this.values.push(note);
    }

    public getCoding(): string {
        const value = this.value as { code: Util.FHIR.Code };
        return Array.from(
            new Set(
                value.code.coding.map((c: Util.FHIR.Coding) => {
                    return (
                        c._display?.extension
                            ?.map((e) => e.extension?.map((ex) => ex.valueString))
                            .join(", ") ?? "-"
                    );
                })
            )
        ).join(", ");
    }

    public getMainValue(): ModelValue {
        return {
            value: Util.Misc.formatDate(this.value.performedDateTime),
            label: this.getCoding()
        };
    }

    public toPDFContent(
        styles: string[] = [],
        subTable?: boolean,
        removeHTML?: boolean
    ): Content {
        if (MR.V1_0_0.Profile.ProcedureAntiDProphylaxis.is(this.value)) {
            const noHeadline = this.noHeadline;
            this.noHeadline = true;
            const pdfContent = super.toPDFContent(styles, subTable, removeHTML);
            this.noHeadline = noHeadline;
            return pdfContent;
        } else {
            return super.toPDFContent(styles, subTable, removeHTML);
        }
    }
}
