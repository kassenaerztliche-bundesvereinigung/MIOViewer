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

import { ParserUtil, MR, Reference } from "@kbv/mioparser";
import { UI, Util } from "../../../components";

import MPBaseModel from "../MPBaseModel";

import { getCoding } from "../Util";
import { ModelValue } from "../../Types";

export type ObservationType =
    | MR.V1_1_0.Profile.ObservationCalculatedDeliveryDate
    | MR.V1_1_0.Profile.ObservationDateDeterminationChildbirth
    | MR.V1_1_0.Profile.ObservationDateOfConception
    | MR.V1_1_0.Profile.ObservationDeterminationOfPregnancy
    | MR.V1_1_0.Profile.ObservationMenstrualCycle
    | MR.V1_1_0.Profile.ObservationAge
    | MR.V1_1_0.Profile.ObservationBaselineWeightMother
    | MR.V1_1_0.Profile.ObservationHeight
    | MR.V1_1_0.Profile.ObservationGravida
    | MR.V1_1_0.Profile.ObservationPara
    | MR.V1_1_0.Profile.ObservationPregnancyRisk
    | MR.V1_1_0.Profile.ObservationPreviousPregnancy
    | MR.V1_1_0.Profile.ObservationCatalogueA
    | MR.V1_1_0.Profile.ObservationSpecialFindings
    | MR.V1_1_0.Profile.ObservationoGTTPretest
    | MR.V1_1_0.Profile.ObservationoGTTDiagnosistest
    | MR.V1_1_0.Profile.ObservationHIVTestPerformed
    | MR.V1_1_0.Profile.ObservationExamination
    | MR.V1_1_0.Profile.ObservationExaminationMasked
    | MR.V1_1_0.Profile.ObservationImmunizationStatus
    | MR.V1_1_0.Profile.ObservationBloodGroupSerology
    | MR.V1_1_0.Profile.ObservationOtherBloodGroupSystems
    | MR.V1_1_0.Profile.ObservationBloodPressure
    | MR.V1_1_0.Profile.ObservationWeightMother
    | MR.V1_1_0.Profile.ObservationFundusHeight
    | MR.V1_1_0.Profile.ObservationVaricosis
    | MR.V1_1_0.Profile.ObservationEdema
    | MR.V1_1_0.Profile.ObservationUrine
    | MR.V1_1_0.Profile.ObservationUrineSugar
    | MR.V1_1_0.Profile.ObservationUrineProtein
    | MR.V1_1_0.Profile.ObservationVaginalExamination
    | MR.V1_1_0.Profile.ObservationHeartSoundsChild
    | MR.V1_1_0.Profile.ObservationChildMovement
    | MR.V1_1_0.Profile.ObservationNumberOfCheckups
    | MR.V1_1_0.Profile.ObservationPresentationAtBirthClinic
    | MR.V1_1_0.Profile.ObservationInpatientStayDuringPregnancy
    | MR.V1_1_0.Profile.ObservationCardiotocography
    | MR.V1_1_0.Profile.ObservationBloodGroupSerologyFetus
    // Ultrasound
    | MR.V1_1_0.Profile.ObservationUltrasound
    | MR.V1_1_0.Profile.ObservationOtherUltrasoundStudies
    | MR.V1_1_0.Profile.DiagnosticReportUltrasoundI
    | MR.V1_1_0.Profile.DiagnosticReportUltrasoundII
    | MR.V1_1_0.Profile.DiagnosticReportUltrasoundIII
    // Ultrasound DiagnosticReport result
    | MR.V1_1_0.Profile.ObservationGeneralInformation
    | MR.V1_1_0.Profile.ObservationPregnancyInformation
    | MR.V1_1_0.Profile.ObservationSingletonPregnancy
    | MR.V1_1_0.Profile.ObservationHeartAction
    | MR.V1_1_0.Profile.ObservationLocalisationPlacenta
    | MR.V1_1_0.Profile.ObservationChildPosition
    | MR.V1_1_0.Profile.ObservationBiometricsI
    | MR.V1_1_0.Profile.ObservationBiometricsII
    | MR.V1_1_0.Profile.ObservationBiometricsIII
    | MR.V1_1_0.Profile.ObservationPercentile
    | MR.V1_1_0.Profile.ObservationTimelyDevelopment
    | MR.V1_1_0.Profile.ObservationFindingsRequiredControl
    | MR.V1_1_0.Profile.ObservationAbnormalities
    | MR.V1_1_0.Profile.ObservationConsultationInitiated
    | MR.V1_1_0.Profile.ObservationMorphology
    // Epikrise
    | MR.V1_1_0.Profile.ObservationExternalBirth
    // Epikrise - Geburt - Angaben zum Kind
    | MR.V1_1_0.Profile.ObservationLiveBirth
    | MR.V1_1_0.Profile.ObservationBirthMode
    | MR.V1_1_0.Profile.ObservationWeightChild
    | MR.V1_1_0.Profile.ObservationHeadCircumference
    | MR.V1_1_0.Profile.ObservationBirthHeight
    | MR.V1_1_0.Profile.ObservationApgarScore
    | MR.V1_1_0.Profile.ObservationpHValueUmbilicalArtery
    | MR.V1_1_0.Profile.ObservationMalformation
    // Epikrise - Wochenbett - Angaben zur Mutter
    | MR.V1_1_0.Profile.ObservationPuerperiumNormal
    | MR.V1_1_0.Profile.ObservationGynecologicalFindingNormal
    | MR.V1_1_0.Profile.ObservationAntiDProphylaxisPostPartum
    | MR.V1_1_0.Profile.ObservationAdviceOnIodineIntake
    // Epikrise - Wochenbett - Angaben zum Kind
    | MR.V1_1_0.Profile.ObservationBloodGroupSerologyChild
    | MR.V1_1_0.Profile.ObservationDirectCoombstest
    // Epikrise - Zweite Untersuchung
    | MR.V1_1_0.Profile.ObservationBreastfeedingBehavior
    | MR.V1_1_0.Profile.ObservationU3Performed
    | MR.V1_1_0.Profile.ObservationNeedOfTreatmentU3
    | MR.V1_1_0.Profile.ObservationChildIsHealthy;

export default class ObservationModel<T extends ObservationType> extends MPBaseModel<T> {
    constructor(
        value: T,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History,
        protected valueConceptMaps: ParserUtil.ConceptMap[] | undefined = undefined,
        protected codeConceptMaps: ParserUtil.ConceptMap[] | undefined = undefined,
        protected customValueLabel?: string,
        protected noValue = false,
        protected noHeadline = false,
        protected customHeadline?: string
    ) {
        super(value, fullUrl, parent, history);

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
            MR.V1_1_0.Profile.PatientMother | MR.V1_1_0.Profile.PatientChild
        >(
            this.parent,
            [MR.V1_1_0.Profile.PatientMother, MR.V1_1_0.Profile.PatientChild],
            new Reference(subjectRef, this.fullUrl)
        );

        const performerRefs = this.value.performer?.map((p) => p.reference);
        let performerName = "-";
        let toPerformerEntry = undefined;
        if (performerRefs?.length) {
            // There is only one (0..1)
            const performer = ParserUtil.getEntryWithRef<
                MR.V1_1_0.Profile.Organization | MR.V1_1_0.Profile.Practitioner
            >(
                this.parent,
                [MR.V1_1_0.Profile.Organization, MR.V1_1_0.Profile.Practitioner],
                new Reference(performerRefs[0], this.fullUrl)
            );

            toPerformerEntry = Util.Misc.toEntry(history, parent, performer, true);

            if (performer) {
                if (MR.V1_1_0.Profile.Organization.is(performer.resource)) {
                    if (performer.resource.name) {
                        performerName = performer.resource.name;
                    }
                } else if (MR.V1_1_0.Profile.Practitioner.is(performer.resource)) {
                    performerName = Util.MP.getPractitionerName(performer.resource);
                }
            }
        }

        const encounterRef = this.value.encounter.reference;
        const encounter = ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.EncounterGeneral>(
            this.parent,
            [MR.V1_1_0.Profile.EncounterGeneral],
            new Reference(encounterRef, this.fullUrl)
        );
        const toEncounterEntry = Util.Misc.toEntry(history, parent, encounter, true);

        this.values = [];

        const identifier = this.getIdentifier();
        if (identifier.value !== "-") {
            this.values.push(identifier);
        }

        const pregnancyWeek = Util.MP.getPregnancyWeekValue(this.value);
        if (pregnancyWeek.value !== "-") {
            this.values.push(pregnancyWeek);
        }

        if (!noValue) {
            this.values.push(this.getObservationValue());
        }

        const interpretation = this.getInterpretation();
        if (interpretation) {
            this.values.push(interpretation);
        }

        this.values.push(
            {
                value: patient ? Util.MP.getPatientName(patient.resource) : "-",
                label: MR.V1_1_0.Profile.PatientChild.is(patient?.resource)
                    ? "Kind"
                    : "Patient/-in",
                onClick: Util.Misc.toEntryByRef(
                    history,
                    parent,
                    new Reference(subjectRef, this.fullUrl),
                    true
                )
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
            if (MR.V1_1_0.Profile.ObservationDateDeterminationChildbirth.is(this.value)) {
                note.label = "Ergänzende Angabe";
            } else if (
                MR.V1_1_0.Profile.ObservationCatalogueA.is(this.value) ||
                MR.V1_1_0.Profile.ObservationSpecialFindings.is(this.value)
            ) {
                note.label = "Besonderheiten";
            } else if (MR.V1_1_0.Profile.ObservationUltrasound.is(this.value)) {
                note.label = "Bemerkungen";
            }
            this.values.push(note);
        }
    }

    public getCoding(resource?: { code?: Util.FHIR.Code }): string {
        if (!resource) {
            resource = this.value;
        }
        return getCoding(resource, this.codeConceptMaps);
    }

    public getIdentifier(): ModelValue {
        const resource = this.value as { identifier: { value: string }[] };
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
        type Quantity = {
            value: string | number;
            unit: string;
        };

        const resource = this.value as {
            valueBoolean?: boolean;
            valueString?: string;
            valueQuantity?: Quantity;
            valueCodeableConcept?: Util.FHIR.Code;
            dataAbsentReason?: Util.FHIR.Code;
            valueDateTime?: string;
            component?: {
                valueQuantity?: Quantity;
                valueCodeableConcept?: { text: string };
                valueString?: string;
                code?: Util.FHIR.Code;
            }[];
        };

        let value: string | undefined;

        if (Object.prototype.hasOwnProperty.call(resource, "valueBoolean")) {
            value = resource.valueBoolean ? "Ja" : "Nein";
        } else if (Object.prototype.hasOwnProperty.call(resource, "valueString")) {
            value = resource.valueString;
        } else if (Object.prototype.hasOwnProperty.call(resource, "valueQuantity")) {
            const unit = resource.valueQuantity?.unit;
            const unitTranslated = Array.from(
                new Set<string>(
                    Util.FHIR.translateCode(unit ?? "", [
                        MR.V1_1_0.ConceptMap.ExaminationUnitGerman
                    ])
                )
            );

            const unitStr = unit
                ? " " + (unitTranslated.length ? unitTranslated.join(" ") : unit)
                : "";

            value = resource.valueQuantity?.value + unitStr;
        } else if (Object.prototype.hasOwnProperty.call(resource, "valueDateTime")) {
            if (MR.V1_1_0.Profile.ObservationPreviousPregnancy.is(this.value)) {
                value = Util.Misc.dateYear(resource.valueDateTime);
            } else {
                value = Util.Misc.formatDate(resource.valueDateTime);
            }
        } else if (
            Object.prototype.hasOwnProperty.call(resource, "valueCodeableConcept")
        ) {
            value = resource.valueCodeableConcept?.coding
                .map((c: Util.FHIR.Coding) => {
                    if (this.valueConceptMaps) {
                        return Util.FHIR.translateCode(c.code, this.valueConceptMaps);
                    } else {
                        if (c._display) {
                            return c._display?.extension
                                ?.map((e) => e.extension?.map((ex) => ex.valueString))
                                .join(", ");
                        } else if (c.display) {
                            return c.display;
                        }
                        return c.code;
                    }
                })
                .join();
        } else if (Object.prototype.hasOwnProperty.call(resource, "component")) {
            value = resource.component
                ? Array.from(
                      new Set(
                          resource.component?.map((c) => {
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
                  (resource.component[0] &&
                  resource.component[0].valueQuantity &&
                  resource.component[0].valueQuantity.unit
                      ? resource.component[0].valueQuantity.unit
                      : "")
                : "-";
        }

        return {
            value: value ?? "-",
            label: this.customValueLabel || "Wert" // this.getCoding()
        };
    }

    public getBodySite(): ModelValue | undefined {
        const value = this.value as {
            bodySite: Util.FHIR.Code & { extension: { valueString: string }[] };
        };
        if (Object.prototype.hasOwnProperty.call(value, "bodySite")) {
            const bodySite = value.bodySite;

            const code = this.getCoding({ code: bodySite });
            let extension;
            if (bodySite.extension) {
                extension = bodySite.extension
                    .map((e: { valueString: string }) => e.valueString)
                    .join(", ");
            }

            return {
                value: code + (extension ? ` (${extension})` : ""),
                label: "Körperstelle",
                renderAs: UI.ListItem.NoLabel
            };
        }

        return undefined;
    }

    public getInterpretation(): ModelValue | undefined {
        // TODO:
        const value = this.value as any as {
            interpretation: Util.FHIR.Code[];
            dataAbsentReason: Util.FHIR.Code;
        };

        if (Object.prototype.hasOwnProperty.call(value, "interpretation")) {
            const interpretation = value.interpretation
                .map((i) => {
                    return i.coding
                        .map((c) => {
                            return ParserUtil.translateCode(
                                c.code,
                                MR.V1_1_0.ConceptMap.ExaminationInterpretationGerman
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
            const v = value.dataAbsentReason?.coding.map((c) => c.display).join(", ");

            return {
                value: v === "Not Performed" ? "Nicht Durchgeführt" : "Ergebnis maskiert",
                label: "Ergebnis"
            };
        }
        return undefined;
    }

    protected getDataAbsentReason(): ModelValue | undefined {
        const resource = this.value as { dataAbsentReason: Util.FHIR.Code };

        if (Object.prototype.hasOwnProperty.call(resource, "dataAbsentReason")) {
            const v = resource.dataAbsentReason.coding
                .map((c) => c.display ?? c.code)
                .join(", ");

            return {
                value: v === "Not Performed" ? "Nicht Durchgeführt" : "Ergebnis maskiert",
                label: "Ergebnis"
            };
        }

        return undefined;
    }

    public getMainValue(): ModelValue {
        const absentReason = this.getDataAbsentReason()?.value;

        return {
            value: absentReason ?? this.getObservationValue().value,
            label: this.customValueLabel ? this.customValueLabel : this.getCoding(),
            onClick: Util.Misc.toEntryByRef(
                this.history,
                this.parent,
                new Reference(this.fullUrl),
                true
            )
        };
    }
}
