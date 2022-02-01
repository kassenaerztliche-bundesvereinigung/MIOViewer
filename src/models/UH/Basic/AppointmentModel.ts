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

import { ParserUtil, CMR, Reference } from "@kbv/mioparser";
import { Util } from "../../../components";

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";
import { Content } from "pdfmake/interfaces";

export type AppointmentType =
    | CMR.V1_0_1.Profile.CMRAppointmentParticipationPeriod
    | CMR.V1_0_1.Profile.CMRAppointmentNextAppointment
    | CMR.V1_0_1.Profile.CMRAppointmentNextImmunizationAppointment;

export default class AppointmentModel extends BaseModel<AppointmentType> {
    constructor(
        value: AppointmentType,
        fullUrl: string,
        parent: CMR.V1_0_1.Profile.CMRBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        if (CMR.V1_0_1.Profile.CMRAppointmentParticipationPeriod.is(value)) {
            this.headline = "Bitte bringen Sie Ihr Kind zur Untersuchung:";
            this.values.push(this.getServiceType());
        } else {
            this.headline = this.getServiceType().value;
        }

        this.values.push(...this.getRequestedPeriod(), ...this.getParticipants());
    }

    protected getParticipants(): ModelValue[] {
        return this.value.participant.map((p) => {
            const ref = p.actor.reference;
            const actor = ParserUtil.getEntryWithRef<
                CMR.V1_0_1.Profile.CMRPatient | CMR.V1_0_1.Profile.CMRPractitioner
            >(
                this.parent,
                [CMR.V1_0_1.Profile.CMRPatient, CMR.V1_0_1.Profile.CMRPractitioner],
                new Reference(ref, this.fullUrl)
            );

            let value = "-";

            if (actor) {
                if (CMR.V1_0_1.Profile.CMRPatient.is(actor.resource)) {
                    value = Util.UH.getPatientName(actor.resource);
                } else {
                    value = Util.UH.getPractitionerName(actor.resource);
                }
            }

            return {
                value,
                label: CMR.V1_0_1.Profile.CMRPatient.is(actor?.resource)
                    ? "Patient/-in"
                    : "Behandelnde Person",
                onClick: Util.Misc.toEntry(this.history, this.parent, actor)
            };
        });
    }

    protected getRequestedPeriod(): ModelValue[] {
        const results: ModelValue[] = [];

        let value = "-";
        let label = "Termin";

        this.value.requestedPeriod.forEach((period: { start: string; end?: string }) => {
            const start: string = period.start;

            if (period.end) {
                const end: string = period.end;
                value = Util.Misc.formatDate(start) + " - " + Util.Misc.formatDate(end);
                label = "Untersuchungszeitraum";
            } else {
                value = Util.Misc.formatDate(start, true);
            }

            results.push({
                value,
                label
            });
        });

        return results;
    }

    public getServiceType(): ModelValue {
        const cm = [
            CMR.V1_0_1.ConceptMap.CMRExaminationNumberGerman,
            CMR.V1_0_1.ConceptMap.PCPNExaminationNumberGerman
        ];

        const serviceType: Set<string> = new Set<string>();
        this.value.serviceType.forEach((st: Util.FHIR.Code) => {
            Util.FHIR.handleCode(st, cm).forEach((c) => serviceType.add(c));
        });

        const arr = Array.from(serviceType);

        return {
            value: arr.length ? arr.join(", ") : "-",
            label: "U-Untersuchung"
        };
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        const periods = this.getRequestedPeriod();
        return {
            value: this.getServiceType().value,
            label: periods.length ? periods[0].value : "-",
            onClick: Util.Misc.toEntryByRef(
                this.history,
                this.parent,
                new Reference(this.fullUrl)
            )
        };
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }

    public toPDFContent(
        styles: string[] = [],
        subTable?: boolean,
        removeHTML?: boolean
    ): Content {
        if (CMR.V1_0_1.Profile.CMRAppointmentParticipationPeriod.is(this.value)) {
            const value = this.getRequestedPeriod()
                .map((v) => v.value)
                .join(", ");
            const label = this.getServiceType().value;

            return [
                {
                    layout: "noBorders",
                    table: {
                        headerRows: 0,
                        widths: [subTable ? "50%" : "40%", "*"],
                        body: [
                            [
                                {
                                    text: label
                                        ? label + (label.endsWith(":") ? "" : ":")
                                        : "",
                                    bold: true,
                                    style: styles
                                },
                                { text: value, style: styles }
                            ]
                        ]
                    }
                }
            ];
        } else {
            return super.toPDFContent(styles, subTable, removeHTML);
        }
    }
}
