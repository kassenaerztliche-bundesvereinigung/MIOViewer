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
import { UI, Util } from "../../../components";

import { ModelValue } from "../../BaseModel";
import MPBaseModel from "../MPBaseModel";

import { getCoding, translateCode } from "../Util";

export default class ObservationModel<
    T extends
        | MR.V1_00_000.Profile.ObservationCalculatedDeliveryDate
        | MR.V1_00_000.Profile.ObservationDateDeterminationChildbirth
        | MR.V1_00_000.Profile.ObservationDateOfConception
        | MR.V1_00_000.Profile.ObservationDeterminationOfPregnancy
        | MR.V1_00_000.Profile.ObservationMenstrualCycle
        | MR.V1_00_000.Profile.ObservationAge
        | MR.V1_00_000.Profile.ObservationBaselineWeightMother
        | MR.V1_00_000.Profile.ObservationHeight
        | MR.V1_00_000.Profile.ObservationGravida
        | MR.V1_00_000.Profile.ObservationPara
        | MR.V1_00_000.Profile.ObservationPregnancyRisk
        | MR.V1_00_000.Profile.ObservationPreviousPregnancy
        | MR.V1_00_000.Profile.ObservationCatalogueA
        | MR.V1_00_000.Profile.ObservationSpecialFindings
        | MR.V1_00_000.Profile.ObservationoGTTPretest
        | MR.V1_00_000.Profile.ObservationoGTTDiagnosistest
        | MR.V1_00_000.Profile.ObservationHIVTestPerformed
        | MR.V1_00_000.Profile.ObservationExamination
        | MR.V1_00_000.Profile.ObservationImmunizationStatus
        | MR.V1_00_000.Profile.ObservationBloodGroupSerology
        | MR.V1_00_000.Profile.ObservationOtherBloodGroupSystems
        | MR.V1_00_000.Profile.ObservationBloodPressure
        | MR.V1_00_000.Profile.ObservationWeightMother
        | MR.V1_00_000.Profile.ObservationFundusHeight
        | MR.V1_00_000.Profile.ObservationVaricosis
        | MR.V1_00_000.Profile.ObservationEdema
        | MR.V1_00_000.Profile.ObservationUrine
        | MR.V1_00_000.Profile.ObservationUrineSugar
        | MR.V1_00_000.Profile.ObservationUrineProtein
        | MR.V1_00_000.Profile.ObservationUrineNitrite
        | MR.V1_00_000.Profile.ObservationUrineBlood
        | MR.V1_00_000.Profile.ObservationVaginalExamination
        | MR.V1_00_000.Profile.ObservationHeartSoundsChild
        | MR.V1_00_000.Profile.ObservationChildMovement
        | MR.V1_00_000.Profile.ObservationNumberOfCheckups
        | MR.V1_00_000.Profile.ObservationPresentationAtBirthClinic
        | MR.V1_00_000.Profile.ObservationInpatientStayDuringPregnancy
        | MR.V1_00_000.Profile.ObservationCardiotocography
        // Ultrasound
        | MR.V1_00_000.Profile.ObservationUltrasound
        | MR.V1_00_000.Profile.ObservationOtherUltrasoundStudies
        | MR.V1_00_000.Profile.DiagnosticReportUltrasoundI
        | MR.V1_00_000.Profile.DiagnosticReportUltrasoundII
        | MR.V1_00_000.Profile.DiagnosticReportUltrasoundIII
        // Ultrasound DiagnosticReport result
        | MR.V1_00_000.Profile.ObservationGeneralInformation
        | MR.V1_00_000.Profile.ObservationPregnancyInformation
        | MR.V1_00_000.Profile.ObservationSingletonPregnancy
        | MR.V1_00_000.Profile.ObservationHeartAction
        | MR.V1_00_000.Profile.ObservationLocalisationPlacenta
        | MR.V1_00_000.Profile.ObservationChildPosition
        | MR.V1_00_000.Profile.ObservationBiometricsI
        | MR.V1_00_000.Profile.ObservationBiometricsII
        | MR.V1_00_000.Profile.ObservationBiometricsIII
        | MR.V1_00_000.Profile.ObservationPercentile
        | MR.V1_00_000.Profile.ObservationTimelyDevelopment
        | MR.V1_00_000.Profile.ObservationFindingsRequiredControl
        | MR.V1_00_000.Profile.ObservationAbnormalities
        | MR.V1_00_000.Profile.ObservationConsultationInitiated
        | MR.V1_00_000.Profile.ObservationMorphology
        // Epikrise
        | MR.V1_00_000.Profile.ObservationExternalBirth
        // Epikrise - Geburt - Angaben zum Kind
        | MR.V1_00_000.Profile.ObservationLiveBirth
        | MR.V1_00_000.Profile.ObservationBirthMode
        | MR.V1_00_000.Profile.ObservationWeightChild
        | MR.V1_00_000.Profile.ObservationHeadCircumference
        | MR.V1_00_000.Profile.ObservationBirthHeight
        | MR.V1_00_000.Profile.ObservationApgarScore
        | MR.V1_00_000.Profile.ObservationpHValueUmbilicalArtery
        | MR.V1_00_000.Profile.ObservationMalformation
        // Epikrise - Wochenbett - Angaben zur Mutter
        | MR.V1_00_000.Profile.ObservationPuerperiumNormal
        | MR.V1_00_000.Profile.ObservationGynecologicalFindingNormal
        | MR.V1_00_000.Profile.ObservationAntiDProphylaxisPostPartum
        | MR.V1_00_000.Profile.ObservationAdviceOnIodineIntake
        // Epikrise - Wochenbett - Angaben zum Kind
        | MR.V1_00_000.Profile.ObservationBloodGroupSerologyChild
        | MR.V1_00_000.Profile.ObservationDirectCoombstest
        // Epikrise - Zweite Untersuchung
        | MR.V1_00_000.Profile.ObservationBreastfeedingBehavior
        | MR.V1_00_000.Profile.ObservationUrineSediment
        | MR.V1_00_000.Profile.ObservationU3Performed
        | MR.V1_00_000.Profile.ObservationNeedOfTreatmentU3
        | MR.V1_00_000.Profile.ObservationChildIsHealthy
> extends MPBaseModel<T> {
    constructor(
        value: T,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History,
        protected valueConceptMap: ParserUtil.ConceptMap[] | undefined = undefined,
        protected codeConceptMap: ParserUtil.ConceptMap[] | undefined = undefined,
        protected customValueLabel?: string,
        protected noValue = false,
        protected noHeadline = false,
        protected customHeadline?: string
    ) {
        super(value, parent, history);

        if (noHeadline) {
            this.noHeadline = noHeadline;
        } else {
            if (customHeadline) {
                this.headline = customHeadline;
            } else {
                this.headline = this.getCoding();

                const bodySite = this.getBodySite();
                if (bodySite) {
                    this.headline = bodySite.value + ": " + this.getCoding();
                }
            }
        }

        const subjectRef = this.value.subject.reference;
        const patient = ParserUtil.getEntryWithRef<
            MR.V1_00_000.Profile.PatientMother | MR.V1_00_000.Profile.PatientChild
        >(
            this.parent,
            [MR.V1_00_000.Profile.PatientMother, MR.V1_00_000.Profile.PatientChild],
            subjectRef
        );

        const performerRefs = this.value.performer?.map((p) => p.reference);
        let performerName = "-";
        let toPerformerEntry = undefined;
        if (performerRefs?.length) {
            // There is only one (0..1)
            const performer = ParserUtil.getEntryWithRef<
                MR.V1_00_000.Profile.Organization | MR.V1_00_000.Profile.Practitioner
            >(
                this.parent,
                [MR.V1_00_000.Profile.Organization, MR.V1_00_000.Profile.Practitioner],
                performerRefs[0]
            );

            toPerformerEntry = Util.Misc.toEntry(history, parent, performer, true);

            if (performer) {
                if (MR.V1_00_000.Profile.Organization.is(performer.resource)) {
                    if (performer.resource.name) performerName = performer.resource.name;
                } else if (MR.V1_00_000.Profile.Practitioner.is(performer.resource)) {
                    performerName = Util.MP.getPractitionerName(performer.resource);
                }
            }
        }

        const encounterRef = this.value.encounter.reference;
        const encounter = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.EncounterGeneral>(
            this.parent,
            [MR.V1_00_000.Profile.EncounterGeneral],
            encounterRef
        );
        const toEncounterEntry = Util.Misc.toEntry(history, parent, encounter, true);

        this.values = [];

        const identifier = this.getIdentifier();
        if (identifier.value !== "-") this.values.push(identifier);

        const pregnancyWeek = this.getPregnancyWeekValue();
        if (pregnancyWeek.value !== "-") this.values.push(pregnancyWeek);

        if (!noValue) this.values.push(this.getObservationValue());

        const interpretation = this.getInterpretation();
        if (interpretation) this.values.push(interpretation);

        this.values.push(
            {
                value: patient ? Util.MP.getPatientName(patient.resource) : "-",
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
                value: Util.Misc.formatDate(this.value.effectiveDateTime),
                label: "Dokumentiert am"
            },
            {
                value: performerName,
                label: "Dokumentiert durch",
                onClick: toPerformerEntry
            }
        );

        const note = this.getNote();
        if (note) {
            if (
                MR.V1_00_000.Profile.ObservationDateDeterminationChildbirth.is(this.value)
            ) {
                note.label = "Ergänzende Angabe";
            } else if (
                MR.V1_00_000.Profile.ObservationCatalogueA.is(this.value) ||
                MR.V1_00_000.Profile.ObservationSpecialFindings.is(this.value)
            ) {
                note.label = "Besonderheiten";
            } else if (MR.V1_00_000.Profile.ObservationUltrasound.is(this.value)) {
                note.label = "Bemerkungen";
            }
            this.values.push(note);
        }
    }

    public getCoding(resource?: unknown): string {
        const value = resource ? resource : (this.value as unknown);
        return getCoding(value, this.codeConceptMap);
    }

    public getPregnancyWeekValue(): ModelValue {
        const returnValue = Util.MP.getPregnancyWeekValue(this.value);
        const value = returnValue.value;

        return {
            value,
            label: returnValue.label
        };
    }

    public getIdentifier(): ModelValue {
        const resource = this.value as any;
        let value = "-";

        if (Object.prototype.hasOwnProperty.call(resource, "identifier")) {
            value = resource.identifier.map((i: { value: string }) => i.value).join(", ");
        }

        return {
            value: value,
            label: "Protokollnummer des Labors"
        };
    }

    public getObservationValue(): ModelValue {
        const resource = this.value as any;
        let value;

        if (Object.prototype.hasOwnProperty.call(resource, "valueBoolean")) {
            value = resource.valueBoolean ? "Ja" : "Nein";
        } else if (Object.prototype.hasOwnProperty.call(resource, "valueString")) {
            value = resource.valueString;
        } else if (Object.prototype.hasOwnProperty.call(resource, "valueQuantity")) {
            value =
                resource.valueQuantity.value +
                (resource.valueQuantity.unit ? " " + resource.valueQuantity.unit : "");
        } else if (Object.prototype.hasOwnProperty.call(resource, "valueDateTime")) {
            if (MR.V1_00_000.Profile.ObservationPreviousPregnancy.is(this.value)) {
                value = Util.Misc.dateYear(resource.valueDateTime);
            } else {
                value = Util.Misc.formatDate(resource.valueDateTime);
            }
        } else if (
            Object.prototype.hasOwnProperty.call(resource, "valueCodeableConcept")
        ) {
            value = resource.valueCodeableConcept.coding
                .map((c: any) => {
                    if (this.valueConceptMap) {
                        return translateCode(c.code, this.valueConceptMap);
                    } else {
                        if (c._display) {
                            return c._display.extension
                                .map((e: { extension: { valueString: string }[] }) =>
                                    e.extension.map((ex) => ex.valueString)
                                )
                                .join(", ");
                        } else if (c.display) {
                            return c.display;
                        }
                        return c.code;
                    }
                })
                .join();
        } else if (Object.prototype.hasOwnProperty.call(resource, "component")) {
            value =
                Array.from(
                    new Set(
                        resource.component.map((c: any) => {
                            if (c.valueQuantity) {
                                return c.valueQuantity.value;
                            } else if (c.valueCodeableConcept) {
                                return c.valueCodeableConcept.text;
                            } else {
                                return "-";
                            }
                        })
                    )
                ).join(" / ") +
                " " +
                (resource.component[0].valueQuantity &&
                resource.component[0].valueQuantity.unit
                    ? resource.component[0].valueQuantity.unit
                    : "");
        } else {
            value = "-";
        }

        return {
            value,
            label: this.customValueLabel || "Wert" // this.getCoding()
        };
    }

    public getBodySite(): ModelValue | undefined {
        const value = this.value as any;
        if (Object.prototype.hasOwnProperty.call(value, "bodySite")) {
            const bodySite = value.bodySite;

            const code = this.getCoding({ code: bodySite });
            let extension;
            if (bodySite.extension) {
                bodySite.extension
                    .map((e: { valueString: string }) => e.valueString)
                    .join(", ");
            }

            return {
                value: code + (extension ? ` (${extension})` : ""),
                label: "Körperstelle",
                renderAs: UI.ListItemNoLabel
            };
        }

        return undefined;
    }

    public getInterpretation(): ModelValue | undefined {
        const value = this.value as any;
        if (Object.prototype.hasOwnProperty.call(value, "interpretation")) {
            const interpretation = value.interpretation
                .map((i: { coding: { code: string }[] }) => {
                    return i.coding
                        .map((c: { code: string }) => {
                            return ParserUtil.translateCode(
                                c.code,
                                MR.V1_00_000.ConceptMap.ExaminationInterpretationGerman
                            );
                        })
                        .join(", ");
                })
                .join(", ");
            return {
                value: interpretation,
                label: "Ergebnis"
            };
        } else if (Object.prototype.hasOwnProperty.call(value, "dataAbsentReason")) {
            const v = value.dataAbsentReason.coding
                .map((c: { display: string }) => c.display)
                .join(", ");

            return {
                value: v === "Not Performed" ? "Nicht Durchgeführt" : "Ergebnis maskiert",
                label: "Ergebnis"
            };
        }
        return undefined;
    }

    protected getDataAbsentReason(): ModelValue | undefined {
        const resource = this.value as any;

        if (Object.prototype.hasOwnProperty.call(resource, "dataAbsentReason")) {
            const v = resource.dataAbsentReason.coding
                .map((c: { display: string }) => c.display)
                .join(", ");

            return {
                value: v === "Not Performed" ? "Nicht Durchgeführt" : "Ergebnis maskiert",
                label: "Ergebnis"
            };
        }

        return undefined;
    }

    getMainValue(): ModelValue {
        const absentReason = this.getDataAbsentReason()?.value;

        return {
            value: absentReason ?? this.getObservationValue().value,
            label: this.customValueLabel ? this.customValueLabel : this.getCoding(),
            onClick: Util.Misc.toEntryByRef(
                this.history,
                this.parent,
                this.value.id,
                true
            )
        };
    }
}
