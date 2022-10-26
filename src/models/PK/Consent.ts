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

import { PKA, Reference, ParserUtil } from "@kbv/mioparser";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { Util } from "../../components";

import { RelatedPerson } from "./";
import { AddressModel, TelecomModel } from "../";

export default class ConsentModel extends BaseModel<
    | PKA.V1_0_0.Profile.DPEConsentPersonalConsent
    | PKA.V1_0_0.Profile.NFDxDPEConsentActiveAdvanceDirective
> {
    protected policyRule: string;

    constructor(
        value:
            | PKA.V1_0_0.Profile.DPEConsentPersonalConsent
            | PKA.V1_0_0.Profile.NFDxDPEConsentActiveAdvanceDirective,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.policyRule = this.getPolicyRule();
        this.headline = this.getPolicyRule();

        const patientRef = new Reference(value.patient.reference, fullUrl);
        const patient = Util.PK.getPatientByRef(parent, patientRef)?.resource;

        this.values = [
            {
                value: patient ? Util.PK.getPatientName(patient) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(history, parent, patientRef, true)
            },
            {
                value: Util.Misc.formatDate(value.dateTime),
                label: "Verfasst am"
            },
            this.getProvisionActor()
        ];

        const description = this.getDescription();
        if (description) {
            this.values.push(description);
        }

        const sourceReference = value.sourceReference;
        if (sourceReference) {
            if (sourceReference._display) {
                const sre = this.getSourceReferenceExtension();
                if (sre) {
                    this.values.push(sre);
                }
            } else {
                this.values.push({
                    value: sourceReference.display ? sourceReference.display : "-",
                    label: "Ablageort"
                });
            }
        }
    }

    protected getPolicyRule(): string {
        return Util.FHIR.handleCode(this.value.policyRule, [
            PKA.V1_0_0.ConceptMap.DPEDeclarationTypeGerman
        ])
            .map((c) => {
                c = c.replaceAll("DPE_", " ");
                c = c.replaceAll("_", " ");
                return c;
            })
            .join(", ");
    }

    protected getProvisionActor(): ModelValue {
        let value = "-";
        let label = "-";
        let onClick: (() => void) | undefined;
        let subEntry = undefined;

        if (PKA.V1_0_0.Profile.DPEConsentPersonalConsent.is(this.value)) {
            const actor = this.value.provision?.actor;

            actor?.forEach((a) => {
                const ref = new Reference(a.reference.reference, this.fullUrl);
                subEntry =
                    ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.DPERelatedPersonContactPerson>(
                        this.parent,
                        [PKA.V1_0_0.Profile.DPERelatedPersonContactPerson],
                        ref
                    );

                if (subEntry) {
                    value = subEntry.resource.name
                        .map((n) => Util.Misc.humanNameToString(n))
                        .join(" ");
                    onClick = Util.Misc.toEntryByRef(this.history, this.parent, ref);
                }
                label = Util.FHIR.handleCode(a.role).join(" ");
            });
        } else if (
            PKA.V1_0_0.Profile.NFDxDPEConsentActiveAdvanceDirective.is(this.value)
        ) {
            const actor = this.value.provision?.actor;
            actor?.forEach((a) => {
                value = a.reference.display;
                label = "Behandelnde Person"; // Util.FHIR.handleCode(a.role).join(", ");
            });
        }

        return {
            value,
            label,
            onClick,
            subEntry,
            subModels: [RelatedPerson, AddressModel, TelecomModel]
        };
    }

    protected getDescription(): ModelValue | undefined {
        if (PKA.V1_0_0.Profile.DPEConsentPersonalConsent.is(this.value)) {
            const value =
                this.value.extension?.map((e) => e.valueString).join(", ") ?? "-";

            return {
                value,
                label: "Beschreibung"
            };
        }
    }

    public getSourceReferenceExtension(): ModelValue | undefined {
        const display = this.value.sourceReference?._display;
        if (display) {
            let str = "";
            display.extension?.forEach((d) => {
                const valueAddress = d.valueAddress;
                if (valueAddress) {
                    let cityPart = "";
                    if (PKA.V1_0_0.Profile.NFDxDPEAddress.is(valueAddress)) {
                        const e = valueAddress.extension;
                        cityPart = e ? " " + e.map((v) => v.valueString).join(" ") : "";
                    }

                    str = [
                        valueAddress.line?.join(" ") ?? "",
                        valueAddress.postalCode ?? "",
                        valueAddress.city + cityPart,
                        valueAddress.country ?? ""
                    ]
                        .filter((v) => v != "")
                        .join(", ");
                }
            });

            return { value: str, label: "Ablageort" };
        }
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.policyRule,
            label: Util.Misc.formatDate(this.value.dateTime)
        };
    }
}
