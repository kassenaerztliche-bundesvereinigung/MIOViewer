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

import { Content } from "pdfmake/interfaces";

import { ParserUtil, MR } from "@kbv/mioparser";
import { Util } from "../../components";

import * as Models from "../../models";
import { horizontalLine } from "../PDFMaker";
import Compare from "../../views/MP/Compare";

import PDFRepresentation from "../PDFRepresentation";
import Mappings from "../../views/MP/Mappings";

const MR_PR = MR.V1_00_000.Profile;

export default class MRtoPDF extends PDFRepresentation<MR.V1_00_000.Profile.Bundle> {
    protected composition?: MR.V1_00_000.Profile.Composition;

    constructor(value: MR.V1_00_000.Profile.Bundle) {
        super(value, "Mutterpasseintrag", "s");

        this.composition = ParserUtil.getEntry<MR.V1_00_000.Profile.Composition>(
            this.value,
            [MR_PR.Composition]
        )?.resource;
    }

    public getContent(): Content {
        return [
            this.getHeading(),
            this.getStampInformation(),
            this.getAppointments(),
            this.getDateDetermination(),
            this.getAnamnesis(),
            this.getSpecialFindings(),
            this.getCounselling(),
            this.getAntiDProphylaxis(),
            this.getExaminations(),
            this.getInpatientTreatments(),
            this.getHints()
        ];
    }

    public getHeading(): Content {
        const title = this.composition ? this.composition.title : "-";
        const ref = this.composition?.author[0].reference;
        const date = this.composition?.date;

        let authorContent: Content | undefined = undefined;
        if (ref) {
            const author = Util.MP.getAuthor(this.value, ref);

            if (author && author.resource) {
                const res = author.resource;
                let model;
                if (MR.V1_00_000.Profile.Practitioner.is(res)) {
                    model = new Models.MP.Basic.PractitionerModel(res, this.value);
                } else {
                    model = new Models.MP.Basic.OrganizationModel(res, this.value);
                }
                const address = new Models.AddressModel(author.resource, this.value);
                const telecom = new Models.TelecomModel(author.resource, this.value);

                authorContent = [
                    [horizontalLine],
                    model.toPDFContent(["subTable"]),
                    address.toPDFContent(["subTable"]),
                    telecom.toPDFContent(["subTable"])
                ];
            }
        }

        const patientResource = Util.MP.getPatientMother(this.value);

        let patient = undefined;
        if (patientResource) {
            const model = new Models.MP.Basic.PatientMotherModel(
                patientResource.resource,
                this.value
            );
            const address = new Models.AddressModel(patientResource.resource, this.value);
            patient = [model.toPDFContent(), address.toPDFContent()];
        }

        return this.headingContent(title, date, authorContent, patient);
    }

    public getStampInformation(): Content {
        const content: Content = this.mapToModels(
            Mappings.StampInformation,
            Compare.StampInformation
        );

        return this.sectionWithContent(
            "Stempelinformationen des Arztes/der Klinik/der mitbetreuenden Hebamme",
            content
        );
    }

    public getAppointments(): Content {
        const content: Content = this.mapToModels(
            Mappings.Appointments,
            Compare.Appointment
        );

        return this.sectionWithContent("Termine", content);
    }

    public getDateDetermination(): Content {
        const content: Content = this.mapToModels(
            Mappings.DateDetermination,
            Compare.DateDetermination
        );

        return this.sectionWithContent("Terminbestimmung", content);
    }

    public getAnamnesis(): Content {
        const section = this.getSection<MR.V1_00_000.Profile.CompositionAnamneseUndAllgemeineBefunde>(
            this.composition,
            [MR_PR.CompositionAnamneseUndAllgemeineBefunde]
        );

        const itemsAnamnesis: Content = this.mapToModels(
            Mappings.Anamnesis.Observations,
            undefined,
            section
        );

        const contentPreviousPregnancy = this.mapToModels(
            [
                {
                    profile: MR_PR.ObservationPreviousPregnancy,
                    models: [Models.MP.Basic.ObservationModel]
                }
            ],
            undefined,
            section
        );

        const contentAnamnesis: Content = [
            this.sectionWithContent("Anamnese", itemsAnamnesis, "h2")
        ];

        contentAnamnesis.push(contentPreviousPregnancy);

        // Erste Vorsorge Untersuchung
        const itemsInitialExamination: Content = this.mapToModels(
            [
                {
                    profile: MR_PR.ClinicalImpressionInitialExamination,
                    models: [
                        Models.MP.Basic.ClinicalImpressionModel,
                        Models.MP.Basic.ClinicalImpressionFindingModel,
                        Models.MP.Basic.ClinicalImpressionInvestigationModel
                    ],
                    noHeadline: true
                }
            ],
            undefined,
            section
        );

        const contentInitialExamination: Content = this.sectionWithContent(
            "Erste Vorsorge-Untersuchung",
            itemsInitialExamination,
            "h2"
        );
        return this.sectionWithContent("Anamnese und allgemeine Befunde", [
            contentAnamnesis,
            contentInitialExamination
        ]);
    }

    public getSpecialFindings(): Content {
        const content: Content = [];

        const section = this.getSection<MR.V1_00_000.Profile.CompositionBesondereBefunde>(
            this.composition,
            [MR_PR.CompositionBesondereBefunde]
        );

        const itemsCatalogueB: Content[] = [];
        section?.entry?.forEach((entry) => {
            const ref = entry.reference;
            const res = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ObservationSpecialFindings>(
                this.value,
                [MR_PR.ObservationSpecialFindings],
                ref
            )?.resource;

            if (res) {
                const model = new Models.MP.Basic.ObservationModel(
                    res,
                    this.value,
                    undefined,
                    [MR.V1_00_000.ConceptMap.SpecialFindingsGerman]
                );

                const note = model.getNote();
                itemsCatalogueB.push(
                    this.keyValuePair(
                        model.getMainValue().value,
                        note ? note.value : "-",
                        "40%"
                    )
                );
            }
        });

        const contentCatalogueB: Content = this.sectionWithContent(
            "Katalog B",
            itemsCatalogueB,
            "h2"
        );

        if (itemsCatalogueB.length) content.push(contentCatalogueB, horizontalLine);

        const sectionOGTT = this.getSection<MR.V1_00_000.Profile.CompositionBesondereBefundeSection>(
            section,
            [MR_PR.CompositionBesondereBefundeSection]
        );

        if (sectionOGTT) {
            const itemsOGTT: Content[] = this.mapToModels(
                Mappings.SpecialFindings.Tests,
                undefined,
                sectionOGTT,
                true
            );

            if (itemsOGTT.length) {
                content.push(
                    this.sectionWithContent("Gestationsdiabetes", itemsOGTT, "h2"),
                    horizontalLine
                );
            }
        }

        return this.sectionWithContent("Besondere Befunde", content);
    }

    public getCounselling(): Content {
        const content = this.mapToModels(Mappings.Counselling);
        return this.sectionWithContent("Beratung", content);
    }

    public getAntiDProphylaxis(): Content {
        const mappings = Mappings.AntiDProphylaxis;
        mappings[0].noHeadline = true;
        const content = this.mapToModels(mappings);
        return this.sectionWithContent("Anti-D-Prophylaxe", content);
    }

    public getInpatientTreatments(): Content {
        const content = this.mapToModels(Mappings.InpatientTreatment);
        return this.sectionWithContent("Stationäre Behandlung", content);
    }

    public getExaminations(): Content {
        const content: Content = [
            this.getLaboratoryExamination(),
            this.getGravidogramm(),
            this.getUltrasound(),
            this.getCardiotocography(),
            this.getEpicrisis()
        ];

        return this.sectionWithContent("Untersuchungen", content);
    }

    protected getLaboratoryExamination(): Content {
        const section = this.getSection<MR.V1_00_000.Profile.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutz>(
            this.composition,
            [
                MR_PR.CompositionUntersuchungen,
                MR_PR.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutz
            ]
        );

        const itemsBloodGroup = this.mapToModels(
            Mappings.LaboratoryExamination.BloodGroups,
            undefined,
            section
        );

        const bloodGroupContent: Content = this.sectionWithContent(
            "Blutgruppenzugehörigkeit",
            itemsBloodGroup,
            "h2"
        );

        const slices = ParserUtil.getSlices<
            | MR.V1_00_000.Profile.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchung
            | MR.V1_00_000.Profile.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchungMaskiert
        >(
            [
                MR_PR.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchung,
                MR_PR.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchungMaskiert
            ],
            section?.section
        );

        const entries: { reference: string }[] = [];
        slices.forEach((slice) => entries.push(...slice.entry));

        const itemsExamination = this.mapToModels(
            Mappings.LaboratoryExamination.Observations,
            undefined,
            {
                entry: entries
            }
        );

        const examinationContent: Content = this.sectionWithContent(
            "Laboruntersuchungen",
            itemsExamination,
            "h2"
        );

        const itemsVaccination = this.mapToModels(
            Mappings.LaboratoryExamination.ImmunizationStatus,
            undefined,
            section
        );

        const vaccinationContent: Content = this.sectionWithContent(
            "Impfrelevante Angaben",
            itemsVaccination,
            "h2"
        );

        return this.sectionWithContent("Laboruntersuchungen und Rötelnschutz", [
            bloodGroupContent,
            examinationContent,
            vaccinationContent
        ]);
    }

    protected getGravidogramm(): Content {
        const section = this.getSection<MR.V1_00_000.Profile.CompositionUntersuchungenGravidogramm>(
            this.composition,
            [MR_PR.CompositionUntersuchungen, MR_PR.CompositionUntersuchungenGravidogramm]
        );

        const content = this.mapToModels(Mappings.Gravidogramm.Basic, undefined, section);
        return this.sectionWithContent("Gravidogram", content);
    }

    protected getUltrasound(): Content {
        const section = this.getSection<MR.V1_00_000.Profile.CompositionUntersuchungenUltraschall>(
            this.composition,
            [MR_PR.CompositionUntersuchungen, MR_PR.CompositionUntersuchungenUltraschall]
        );

        const content: Content = [];

        // Bemerkung
        section?.entry?.forEach((entry) => {
            const ref = entry.reference;
            const res = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ObservationUltrasound>(
                this.value,
                [MR_PR.ObservationUltrasound],
                ref
            )?.resource;

            if (res) {
                const model = new Models.MP.Basic.ObservationModel(res, this.value);
                const note = model.getNote();

                content.push(
                    this.contentPair(
                        "Bemerkung (z.B. Ergebnisse aus vorangegangen Ultraschalluntersuchungen)",
                        note ? note.value : "-"
                    ),
                    horizontalLine
                );
            }
        });

        const slices = ParserUtil.getSlices<
            | MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallUltraschallI
            | MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallUltraschallII
            | MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallUltraschallIII
        >(
            [
                MR_PR.CompositionUntersuchungenUltraschallUltraschallI,
                MR_PR.CompositionUntersuchungenUltraschallUltraschallII,
                MR_PR.CompositionUntersuchungenUltraschallUltraschallIII
            ],
            section?.section
        );

        slices.forEach((subSection) => {
            const diagnosticReportContent = this.mapToModels(
                Mappings.Ultrasound.DiagnosticReports,
                undefined,
                subSection
            );

            content.push(diagnosticReportContent);
        });

        const otherUltrasoundSlices = ParserUtil.getSlices<MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallWeitereUltraschallUntersuchungen>(
            [MR_PR.CompositionUntersuchungenUltraschallWeitereUltraschallUntersuchungen],
            section?.section
        );

        otherUltrasoundSlices.forEach((subSection) => {
            const itemsOtherUltrasound = this.mapToModels(
                Mappings.Ultrasound.Others,
                undefined,
                subSection
            );

            const contentOtherUltrasound: Content = this.sectionWithContent(
                subSection.title,
                itemsOtherUltrasound,
                "h2"
            );

            content.push(contentOtherUltrasound);
        });

        return this.sectionWithContent("Ultraschall", content);
    }

    protected getCardiotocography(): Content {
        const section = this.getSection<MR.V1_00_000.Profile.CompositionUntersuchungenCardiotokographie>(
            this.composition,
            [
                MR_PR.CompositionUntersuchungen,
                MR_PR.CompositionUntersuchungenCardiotokographie
            ]
        );

        const content = this.mapToModels(Mappings.Cardiotocography, undefined, section);
        return this.sectionWithContent("Cardiotokographien", content, "h2");
    }

    protected getEpicrisis(): Content {
        const section = this.getSection<MR.V1_00_000.Profile.CompositionUntersuchungenEpikrise>(
            this.composition,
            [MR_PR.CompositionUntersuchungen, MR_PR.CompositionUntersuchungenEpikrise]
        );

        const content: Content = [
            this.getPregnancy(section),
            this.getBirth(section),
            this.getWochenbett(section),
            this.getSecondExamination(section)
        ];

        return this.sectionWithContent("Abschluss-Untersuchung/Epikrise", content);
    }

    protected getPregnancy(
        section: MR.V1_00_000.Profile.CompositionUntersuchungenEpikrise | undefined
    ): Content {
        const content: Content = [];

        const slices = ParserUtil.getSlices<MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseSchwangerschaft>(
            [MR_PR.CompositionUntersuchungenEpikriseSchwangerschaft],
            section?.section
        );

        slices.forEach((subSection) => {
            const contentPregnancyExamination = this.mapToModels(
                Mappings.EpicrisisPregnancy.DischargeSummary,
                undefined,
                subSection
            );

            if (contentPregnancyExamination.length) {
                content.push(contentPregnancyExamination);
            }
        });

        return this.sectionWithContent("Schwangerschaft", content, "h2");
    }

    protected getBirth(
        section: MR.V1_00_000.Profile.CompositionUntersuchungenEpikrise | undefined
    ): Content {
        const content: Content = [];

        const slices = ParserUtil.getSlices<MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseGeburt>(
            [MR_PR.CompositionUntersuchungenEpikriseGeburt],
            section?.section
        );

        slices.forEach((subSection) => {
            subSection.entry?.forEach((entry) => {
                const ref = entry.reference;
                const resource = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ClinicalImpressionBirthExaminationDeliveryInformation>(
                    this.value,
                    [MR_PR.ClinicalImpressionBirthExaminationDeliveryInformation],
                    ref
                )?.resource;

                if (resource) {
                    const model = new Models.MP.Basic.ClinicalImpressionModel(
                        resource,
                        this.value
                    );

                    content.push(model.toPDFContent(), horizontalLine);

                    const childSection = ParserUtil.getSlices<MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseGeburtSection>(
                        [MR_PR.CompositionUntersuchungenEpikriseGeburtSection],
                        subSection.section
                    );

                    const childrenContent = this.mapChildren(resource, childSection);
                    if (childrenContent.length) {
                        content.push(
                            this.sectionWithContent(
                                "Angaben zum Kind",
                                childrenContent,
                                "h3"
                            )
                        );
                    }
                }
            });
        });

        return this.sectionWithContent("Geburt", content, "h2");
    }

    protected getWochenbett(
        section: MR.V1_00_000.Profile.CompositionUntersuchungenEpikrise | undefined
    ): Content {
        const content: Content = [];

        const slices = ParserUtil.getSlices<MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseWochenbett>(
            [MR_PR.CompositionUntersuchungenEpikriseWochenbett],
            section?.section
        );

        slices.forEach((subSection) => {
            subSection.entry?.forEach((entry) => {
                const ref = entry.reference;
                const resource = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ClinicalImpressionFirstExaminationAfterChildbirth>(
                    this.value,
                    [MR_PR.ClinicalImpressionFirstExaminationAfterChildbirth],
                    ref
                )?.resource;

                if (resource) {
                    const model = new Models.MP.Basic.ClinicalImpressionModel(
                        resource,
                        this.value
                    );

                    content.push(model.toPDFContent(), horizontalLine);

                    const mother = new Models.MP.InformationAboutMotherModel(
                        resource,
                        this.value
                    );

                    content.push(mother.toPDFContent(), horizontalLine);

                    const childSection = ParserUtil.getSlices<MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseWochenbettAngabenZumKind>(
                        [MR_PR.CompositionUntersuchungenEpikriseWochenbettAngabenZumKind],
                        subSection.section
                    );

                    const childrenContent = this.mapChildren(resource, childSection);
                    if (childrenContent.length) {
                        content.push(
                            this.sectionWithContent(
                                "Angaben zum Kind",
                                childrenContent,
                                "h3"
                            )
                        );
                    }
                }
            });
        });

        return this.sectionWithContent(
            "Erste Untersuchung nach Entbindung (Wochenbett)",
            content,
            "h2"
        );
    }

    protected getSecondExamination(
        section: MR.V1_00_000.Profile.CompositionUntersuchungenEpikrise | undefined
    ): Content {
        const content: Content = [];

        const slices = ParserUtil.getSlices<MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindung>(
            [MR_PR.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindung],
            section?.section
        );

        slices.forEach((subSection) => {
            subSection.entry?.forEach((entry) => {
                const ref = entry.reference;
                const resource = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ClinicalImpressionSecondExaminationAfterChildbirth>(
                    this.value,
                    [MR_PR.ClinicalImpressionSecondExaminationAfterChildbirth],
                    ref
                )?.resource;

                if (resource) {
                    const entryModel = new Models.MP.Basic.ClinicalImpressionModel(
                        resource,
                        this.value
                    );

                    content.push(entryModel.toPDFContent(), horizontalLine);

                    const mother = new Models.MP.InformationAboutMotherModel(
                        resource,
                        this.value
                    );

                    content.push(mother.toPDFContent(), horizontalLine);

                    const childSection = ParserUtil.getSlices<MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindungAngabenZumKind>(
                        [
                            MR_PR.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindungAngabenZumKind
                        ],
                        subSection.section
                    );

                    const childrenContent = this.mapChildren(resource, childSection);
                    if (childrenContent.length) {
                        content.push(
                            this.sectionWithContent(
                                "Angaben zum Kind",
                                childrenContent,
                                "h3"
                            )
                        );
                    }
                }
            });
        });

        return this.sectionWithContent(
            "Zweite Untersuchung nach Entbindung",
            content,
            "h2"
        );
    }

    private mapChildren(
        resource:
            | MR.V1_00_000.Profile.ClinicalImpressionBirthExaminationDeliveryInformation
            | MR.V1_00_000.Profile.ClinicalImpressionSecondExaminationAfterChildbirth
            | MR.V1_00_000.Profile.ClinicalImpressionFirstExaminationAfterChildbirth,
        section:
            | MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseGeburtSection[]
            | MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseWochenbettAngabenZumKind[]
            | MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindungAngabenZumKind[]
    ): Content[] {
        const content: Content = [];

        const model = new Models.MP.InformationAboutChildModel(resource, this.value);

        model.getChildren().forEach((child) => {
            const childContent: Content = [];
            section.forEach((r: { entry?: { reference: string }[] }) => {
                const entries = [];

                if (r && r.entry) entries.push(...r.entry);

                if (
                    MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseGeburtSection.is(
                        r
                    )
                ) {
                    const apgarSection = ParserUtil.getSlice<MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseGeburtSectionSection>(
                        MR_PR.CompositionUntersuchungenEpikriseGeburtSectionSection,
                        r?.section
                    );

                    if (apgarSection && apgarSection.entry) {
                        entries.push(...apgarSection.entry);
                    }
                }

                entries.forEach((entry: { reference: string }) => {
                    const ref = entry.reference;
                    const entryResource = ParserUtil.getEntryWithRef<
                        | MR.V1_00_000.Profile.PatientChild
                        // Geburt
                        | MR.V1_00_000.Profile.ObservationBirthMode
                        | MR.V1_00_000.Profile.ObservationWeightChild
                        | MR.V1_00_000.Profile.ObservationHeadCircumference
                        | MR.V1_00_000.Profile.ObservationBirthHeight
                        | MR.V1_00_000.Profile.ObservationApgarScore
                        | MR.V1_00_000.Profile.ObservationpHValueUmbilicalArtery
                        | MR.V1_00_000.Profile.ObservationMalformation
                        | MR.V1_00_000.Profile.ObservationLiveBirth
                        // Wochenbett
                        | MR.V1_00_000.Profile.ObservationBloodGroupSerologyChild
                        | MR.V1_00_000.Profile.ObservationDirectCoombstest
                        // Zweite Untersuchung nach Entbindung
                        | MR.V1_00_000.Profile.ObservationU3Performed
                        | MR.V1_00_000.Profile.ObservationChildIsHealthy
                        | MR.V1_00_000.Profile.ObservationNeedOfTreatmentU3
                    >(
                        this.value,
                        [
                            // Geburt
                            MR_PR.PatientChild,
                            MR_PR.ObservationBirthMode,
                            MR_PR.ObservationWeightChild,
                            MR_PR.ObservationHeadCircumference,
                            MR_PR.ObservationBirthHeight,
                            MR_PR.ObservationApgarScore,
                            MR_PR.ObservationpHValueUmbilicalArtery,
                            MR_PR.ObservationMalformation,
                            MR_PR.ObservationLiveBirth,
                            // Wochenbett
                            MR_PR.ObservationBloodGroupSerologyChild,
                            MR_PR.ObservationDirectCoombstest,
                            // Zweite Untersuchung nach Entbindung
                            MR_PR.ObservationU3Performed,
                            MR_PR.ObservationChildIsHealthy,
                            MR_PR.ObservationNeedOfTreatmentU3
                        ],
                        ref
                    )?.resource;

                    if (entryResource) {
                        if (MR.V1_00_000.Profile.PatientChild.is(entryResource)) {
                            if (child === entryResource.id) {
                                const entryModel = new Models.MP.Basic.PatientChildModel(
                                    entryResource,
                                    this.value
                                );

                                childContent.push(entryModel.toPDFContent());
                            }
                        } else {
                            if (
                                child === ParserUtil.getUuid(resource.subject.reference)
                            ) {
                                const entryModel = new Models.MP.Basic.ObservationModel(
                                    entryResource,
                                    this.value
                                );

                                childContent.push([entryModel.mainValueToPDFContent()]);
                            }
                        }
                    }
                });
            });

            if (childContent.length) {
                content.push(childContent, horizontalLine);
            }
        });

        return content;
    }

    protected getHints(): Content {
        const content: Content[] = [];

        const hints = ParserUtil.getSlice<MR.V1_00_000.Profile.CompositionHinweise>(
            MR.V1_00_000.Profile.CompositionHinweise,
            this.composition?.extension
        );

        const hintMap: Record<string, string> = {
            hinweiseSchwangere: "Hinweise für die Schwangere",
            hinweiseMutter: "Hinweise an die Mutter",
            aufbewahrungshinweis: "Aufbewahrungshinweis"
        };

        if (hints) {
            hints.extension?.map((e) => {
                const value = e.valueString;
                if (value) {
                    const result = value.split(/(?=●)/).map((v) => {
                        return { text: v.replace("●", " - ") };
                    });

                    content.push(
                        this.sectionWithContent(hintMap[e.url], [result], "h2"),
                        horizontalLine
                    );
                }
            });
        }

        return this.sectionWithContent("Hinweise", content);
    }
}
