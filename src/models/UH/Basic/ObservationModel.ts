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
import { UI, Util } from "../../../components";

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";
import OrganizationModel from "./OrganizationModel";
import { AdditionalCommentModel, AddressModel, TelecomModel } from "../../Comprehensive";
import { Content } from "pdfmake/interfaces";

export type ObservationType =
    | CMR.V1_0_1.Profile.CMRObservationU3U4ProblemOfHip
    | CMR.V1_0_1.Profile.CMRObservationU3U4HipScreeningHistory
    | CMR.V1_0_1.Profile.CMRObservationPhysicalExamParentalAssessment
    | CMR.V1_0_1.Profile.CMRObservationPercentileValues
    // U1
    | CMR.V1_0_1.Profile.CMRObservationU1U3PregnancyHistory
    | CMR.V1_0_1.Profile.CMRObservationU1U3FoetalPosition
    | CMR.V1_0_1.Profile.CMRObservationU1U3DifferentFoetalPosition
    | CMR.V1_0_1.Profile.CMRObservationU1U3Birthmode
    | CMR.V1_0_1.Profile.CMRObservationU1U3PrenatalFinding
    | CMR.V1_0_1.Profile.CMRObservationU1U3BaseExcess
    | CMR.V1_0_1.Profile.CMRObservationU1U3pHValue
    | CMR.V1_0_1.Profile.CMRObservationU1U3GenderBirthHistory
    | CMR.V1_0_1.Profile.CMRObservationU1U3DateTimeofBirth
    | CMR.V1_0_1.Profile.CMRObservationU1U3LengthGestationAtBirth
    | CMR.V1_0_1.Profile.CMRObservationU1FamilyHistory
    | CMR.V1_0_1.Profile.CMRObservationHeadCircumference
    | CMR.V1_0_1.Profile.CMRObservationU1EdemaOfNewborn
    | CMR.V1_0_1.Profile.CMRObservationU1NeonatalJaundice
    | CMR.V1_0_1.Profile.CMRObservationU1BirthTraumaOfFetus
    | CMR.V1_0_1.Profile.CMRObservationU1CongenitalMalformation
    | CMR.V1_0_1.Profile.CMRObservationU1TermInfant
    | CMR.V1_0_1.Profile.CMRObservationU1ApgarScore
    | CMR.V1_0_1.Profile.CMRObservationU1BirthLength
    | CMR.V1_0_1.Profile.CMRObservationU1BirthWeight
    | CMR.V1_0_1.Profile.CMRObservationU1U3PulseOxymetryMeasurement
    | CMR.V1_0_1.Profile.CMRObservationU1U5NeonatalHearscreening
    | CMR.V1_0_1.Profile.CMRObservationU1U5CounselingAboutHearscreening
    | CMR.V1_0_1.Profile.CMRObservationU1U5PediatricDiagnosticAudiologyService
    // U2
    | CMR.V1_0_1.Profile.CMRObservationU2PhysicalExamSkin
    | CMR.V1_0_1.Profile.CMRObservationU2PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRObservationU2PhysicalExamHead
    | CMR.V1_0_1.Profile.CMRObservationU2PhysicalExamMouthNose
    | CMR.V1_0_1.Profile.CMRObservationU2U3PhysicalExamAbdomenGenitals
    | CMR.V1_0_1.Profile.CMRObservationU2U3PhysicalExamEars
    | CMR.V1_0_1.Profile.CMRObservationU2U3PhysicalExamEyes
    | CMR.V1_0_1.Profile.CMRObservationU2U4PhysicalExamChestLungRespiratoryTract
    | CMR.V1_0_1.Profile.CMRObservationU2U6PhysicalExamHeartBloodCirculation
    | CMR.V1_0_1.Profile.CMRObservationU2U6BodyWeight
    | CMR.V1_0_1.Profile.CMRObservationU2U9BodyHeightMeasure
    | CMR.V1_0_1.Profile.CMRObservationU2SocialHistory
    | CMR.V1_0_1.Profile.CMRObservationU2U9RelevantHistoryResults
    | CMR.V1_0_1.Profile.CMRObservationComments
    | CMR.V1_0_1.Profile.CMRObservationU2U9NoAbnormalityDetected
    // U3
    | CMR.V1_0_1.Profile.CMRObservationU3CurrentChildHistory
    | CMR.V1_0_1.Profile.CMRObservationU3FamilyHistory
    | CMR.V1_0_1.Profile.CMRObservationU3U9SocialHistory
    //
    | CMR.V1_0_1.Profile.CMRObservationU3U4PhysicalExamSkin
    | CMR.V1_0_1.Profile.CMRObservationU3PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRObservationU3PhysicalExamHead
    | CMR.V1_0_1.Profile.CMRObservationU3U4HipScreeningResult
    | CMR.V1_0_1.Profile.CMRObservationU3U4PhysicalExamMouthNose
    // U4
    | CMR.V1_0_1.Profile.CMRObservationU4PhysicalExamAbdomenGenitals
    | CMR.V1_0_1.Profile.CMRObservationU4PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRObservationU4PhysicalExamHead
    | CMR.V1_0_1.Profile.CMRObservationU4U5PhysicalExamEyes
    | CMR.V1_0_1.Profile.CMRObservationU4U9StatusOfImmunization
    // U5
    | CMR.V1_0_1.Profile.CMRObservationU5U9PhysicalExamSkin
    | CMR.V1_0_1.Profile.CMRObservationU5PhysicalExamChestLungRespiratoryTract
    | CMR.V1_0_1.Profile.CMRObservationU5U6PhysicalExamAbdomenGenitals
    | CMR.V1_0_1.Profile.CMRObservationU5PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRObservationU5U6PhysicalExamHead
    | CMR.V1_0_1.Profile.CMRObservationU5PhysicalExamMouthNose
    // U6
    | CMR.V1_0_1.Profile.CMRObservationU6U7PhysicalExamChestLungRespiratoryTract
    | CMR.V1_0_1.Profile.CMRObservationU6PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRObservationU6PhysicalExamMouthNose
    | CMR.V1_0_1.Profile.CMRObservationU6PhysicalExamEyes
    // U7
    | CMR.V1_0_1.Profile.CMRObservationU7U7aPhysicalExamAbdomenGenitals
    | CMR.V1_0_1.Profile.CMRObservationU7U9PhysicalExamHeartBloodCirculation
    | CMR.V1_0_1.Profile.CMRObservationU7PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRObservationU7PhysicalExamMouthNose
    | CMR.V1_0_1.Profile.CMRObservationU7PhysicalExamEyes
    | CMR.V1_0_1.Profile.CMRObservationU7U9BMI
    | CMR.V1_0_1.Profile.CMRObservationU7U9BodyWeight
    // U7a
    | CMR.V1_0_1.Profile.CMRObservationU7aandU9PhysicalExamChestLungRespiratoryTract
    | CMR.V1_0_1.Profile.CMRObservationU7aandU9PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRObservationU7aPhysicalExamMouthNose
    | CMR.V1_0_1.Profile.CMRObservationU7aU9PhysicalExamEyes
    // U8
    | CMR.V1_0_1.Profile.CMRObservationU8PhysicalExamChestLungRespiratoryTract
    | CMR.V1_0_1.Profile.CMRObservationU8PhysicalExamAbdomenGenitals
    | CMR.V1_0_1.Profile.CMRObservationU8PhysicalExamEars
    | CMR.V1_0_1.Profile.CMRObservationU8PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRObservationU8U9PhysicalExamMouthNose
    // U9
    | CMR.V1_0_1.Profile.CMRObservationU9PhysicalExamAbdomenGenitals;

const interpretationConceptMaps: ParserUtil.ConceptMap[] = [
    CMR.V1_0_1.ConceptMap.CMRU1U3PulseOxymetryMeasurementGerman
];

export default class ObservationModel extends BaseModel<ObservationType> {
    constructor(
        value: ObservationType,
        fullUrl: string,
        parent: CMR.V1_0_1.Profile.CMRBundle,
        history?: History,
        codeConceptMaps?: ParserUtil.ConceptMap[],
        valueConceptMaps?: ParserUtil.ConceptMap[],
        customLabel?: string,
        noValue?: boolean
    ) {
        super(value, fullUrl, parent, history, codeConceptMaps, valueConceptMaps);

        this.headline = this.getCoding();

        const patientRef = this.value.subject.reference;
        const encounterRef = this.value.encounter.reference;
        const performerRefs: string[] =
            this.value.performer?.map((performer) => performer.reference) ?? [];

        this.values = [];

        if (!noValue) {
            this.values.push(this.getObservationValue());
        }

        const component = this.getComponent();
        if (component) {
            this.values.push(component);
        }

        const bodySite = this.getBodySite();
        if (bodySite) {
            this.values.push(bodySite);
        }

        const interpretation = this.getInterpretation();
        if (interpretation) {
            this.values.push(interpretation);
        }

        this.values.push(...this.getDerivedFrom());

        this.values.push(
            Util.UH.getPatientModelValue(
                new Reference(patientRef, this.fullUrl),
                parent,
                history
            ),
            Util.UH.getEncounterModelValue(
                new Reference(encounterRef, this.fullUrl),
                parent,
                history
            )
        );

        if (
            !CMR.V1_0_1.Profile.CMRObservationU1U5CounselingAboutHearscreening.is(value)
        ) {
            this.values.push({
                value: Util.Misc.formatDate(this.value.effectiveDateTime),
                label: "Durchgeführt am"
            });
        }

        this.values.push(
            ...Util.UH.getPerformerModelValues(
                performerRefs.map((r) => new Reference(r, this.fullUrl)),
                parent,
                history
            ).map((v) => {
                v.subModels = [
                    OrganizationModel,
                    AddressModel,
                    TelecomModel,
                    AdditionalCommentModel
                ];
                return v;
            })
        );
    }

    protected getInterpretation(): ModelValue | undefined {
        const resource = this.value as { interpretation: Util.FHIR.Code[] };
        if (resource.interpretation) {
            return {
                value: resource.interpretation
                    .map((interpretation: Util.FHIR.Code) => {
                        return Util.FHIR.handleCode(
                            interpretation,
                            interpretationConceptMaps
                        ).join(", ");
                    })
                    .join(", "),
                label: "Interpretation"
            };
        }
    }

    protected getObservationValue(): ModelValue {
        const resource = this.value as {
            valueBoolean?: boolean;
            valueString?: string;
            valueQuantity?: {
                value: string | number;
                unit: string;
            };
            valueCodeableConcept?: Util.FHIR.Code;
            dataAbsentReason?: Util.FHIR.Code;
            valueDateTime?: string;
        };

        let value = undefined;
        let label = "Wert";

        if (resource.valueBoolean || resource.valueBoolean === false) {
            value = resource.valueBoolean ? "Ja" : "Nein";
        } else if (resource.valueString) {
            value = resource.valueString;
        } else if (resource.valueQuantity) {
            const unit = resource.valueQuantity.unit;
            const unitStr = unit ? " " + unit : "";
            value = resource.valueQuantity.value + unitStr;
        } else if (resource.valueCodeableConcept) {
            value = Util.FHIR.handleCode(
                resource.valueCodeableConcept,
                this.valueConceptMaps
            ).join(", ");
        } else if (resource.dataAbsentReason) {
            value = Util.FHIR.handleCode(
                resource.dataAbsentReason,
                this.valueConceptMaps
            ).join(", ");
        } else if (resource.valueDateTime) {
            value = Util.Misc.formatDate(resource.valueDateTime, true);
        }

        if (
            CMR.V1_0_1.Profile.CMRObservationU1U5CounselingAboutHearscreening.is(resource)
        ) {
            value = Util.Misc.formatDate(resource.effectiveDateTime);
            label = "Durchgeführt am";
        }

        if (value) {
            return {
                value: value,
                label: label
            };
        } else {
            const component = this.getComponent();
            if (component) {
                return component;
            } else {
                return {
                    value: "-",
                    label: label
                };
            }
        }
    }

    protected getComponent(): ModelValue | undefined {
        const resource = this.value as {
            component?: {
                valueQuantity?: { value: string };
                valueCodeableConcept?: { text: string };
                valueString?: string;
                code?: Util.FHIR.Code;
            }[];
        };

        if (resource.component) {
            let schwangerschaftstage = false;

            const values: UI.ListItem.Content[] = resource.component.map((c) => {
                let v = "-";
                let l = "-";
                if (c.valueQuantity) {
                    v = c.valueQuantity.value;
                } else if (c.valueCodeableConcept) {
                    v = c.valueCodeableConcept.text;
                } else if (c.valueString) {
                    v = c.valueString;
                }

                if (c.code) {
                    if (c.code.coding) {
                        l = Util.FHIR.handleCode(c.code).join(", ");
                    } else if (c.code.text) {
                        l = c.code.text;
                        if (l === "schwangerschaftstage") {
                            schwangerschaftstage = true;
                        }
                    }
                }

                return { value: v, label: l };
            });

            if (CMR.V1_0_1.Profile.CMRObservationU3U4HipScreeningResult.is(this.value)) {
                values.sort((a, b) =>
                    a.label > b.label ? 1 : b.label > a.label ? -1 : 0
                );
            }

            const isLengthGestationAtBirth =
                CMR.V1_0_1.Profile.CMRObservationU1U3LengthGestationAtBirth.is(
                    this.value
                );

            const separator = isLengthGestationAtBirth ? " + " : " / ";

            if (isLengthGestationAtBirth && values.length === 1) {
                const n = { value: "0", label: "" };
                const v = values.pop();
                if (!v) {
                    return;
                }
                schwangerschaftstage ? values.push(n, v) : values.push(v, n);
            }

            return {
                value: values.map((v) => v.value).join(separator),
                label: values.map((v) => v.label).join(separator),
                renderAs: isLengthGestationAtBirth ? UI.ListItem.NoLabel : undefined
            };
        }
    }

    public getBodySite(): ModelValue | undefined {
        if (
            CMR.V1_0_1.Profile.CMRObservationU3U4HipScreeningResult.is(this.value) &&
            this.value.bodySite
        ) {
            const value = Util.FHIR.getCoding({ code: this.value.bodySite }, [
                CMR.V1_0_1.ConceptMap.CMRBodysiteHipGerman
            ]);

            return {
                value,
                label: "Körperstelle"
            };
        }
    }

    public getDerivedFrom(): ModelValue[] {
        const results: ModelValue[] = [];

        if (CMR.V1_0_1.Profile.CMRObservationPercentileValues.is(this.value)) {
            const refs = this.value.derivedFrom?.map((d) => d.reference);

            refs?.forEach((ref) => {
                const result = ParserUtil.getEntryWithRef<
                    | CMR.V1_0_1.Profile.CMRObservationU1BirthWeight
                    | CMR.V1_0_1.Profile.CMRObservationU2U6BodyWeight
                    | CMR.V1_0_1.Profile.CMRObservationU7U9BodyWeight
                    | CMR.V1_0_1.Profile.CMRObservationHeadCircumference
                    | CMR.V1_0_1.Profile.CMRObservationU1BirthLength
                    | CMR.V1_0_1.Profile.CMRObservationU2U9BodyHeightMeasure
                    | CMR.V1_0_1.Profile.CMRObservationU7U9BMI
                >(
                    this.parent,
                    [
                        CMR.V1_0_1.Profile.CMRObservationU1BirthWeight,
                        CMR.V1_0_1.Profile.CMRObservationU2U6BodyWeight,
                        CMR.V1_0_1.Profile.CMRObservationU7U9BodyWeight,
                        CMR.V1_0_1.Profile.CMRObservationHeadCircumference,
                        CMR.V1_0_1.Profile.CMRObservationU1BirthLength,
                        CMR.V1_0_1.Profile.CMRObservationU2U9BodyHeightMeasure,
                        CMR.V1_0_1.Profile.CMRObservationU7U9BMI
                    ],
                    new Reference(ref, this.fullUrl)
                );

                if (result) {
                    const model = new ObservationModel(
                        result.resource,
                        result.fullUrl,
                        this.parent as CMR.V1_0_1.Profile.CMRBundle,
                        this.history
                    );

                    results.push(model.getMainValue());
                }
            });
        }

        return results;
    }

    public getCoding(resource?: { code?: Util.FHIR.Code }): string {
        if (!resource) {
            resource = this.value;
        }
        return Util.FHIR.getCoding(resource, this.codeConceptMaps);
    }

    public getMainValue(): ModelValue {
        let value = this.getObservationValue().value;
        let label = this.getCoding(); // .replace(/:$/, "");

        if (CMR.V1_0_1.Profile.CMRObservationU1U3PregnancyHistory.is(this.value)) {
            value = this.getCoding();
            label = Util.Misc.formatDate(this.value.effectiveDateTime);
        } else if (
            CMR.V1_0_1.Profile.CMRObservationU1U3Birthmode.is(this.value) ||
            CMR.V1_0_1.Profile.CMRObservationU1U3FoetalPosition.is(this.value)
        ) {
            value = this.getCoding();
        }

        const derivedFrom = this.getDerivedFrom()
            .map((v) => v.value)
            .join(", ");

        value += derivedFrom ? " (" + derivedFrom + ")" : "";

        return {
            value,
            label,
            onClick: Util.Misc.toEntryByRef(
                this.history,
                this.parent,
                new Reference(this.fullUrl)
            ),
            sortBy: new Date(this.value.effectiveDateTime).getTime().toString(),
            renderAs: CMR.V1_0_1.Profile.CMRObservationU1FamilyHistory.is(this.value)
                ? UI.ListItem.NoLabel
                : undefined
        };
    }

    public toPDFContent(
        styles: string[] = [],
        subTable?: boolean,
        removeHTML?: boolean
    ): Content {
        let heading = this.getMainValue().label;
        if (CMR.V1_0_1.Profile.CMRObservationU1U3Birthmode.is(this.value)) {
            heading = "Geburtsmodus - " + heading;
        } else if (
            CMR.V1_0_1.Profile.CMRObservationU1U3FoetalPosition.is(this.value) ||
            CMR.V1_0_1.Profile.CMRObservationU1U3DifferentFoetalPosition.is(this.value)
        ) {
            heading = "Kindslage - " + heading;
        }
        return super.toPDFContent(styles, subTable, removeHTML, heading);
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
