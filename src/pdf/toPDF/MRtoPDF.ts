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

import { Content } from "pdfmake/interfaces";

import { ParserUtil, MIOEntry, MR, Reference } from "@kbv/mioparser";
import { Util } from "../../components";

import * as Models from "../../models";

import Mappings from "../../views/MP/Mappings";
import Compare from "../../views/MP/Compare";

import { horizontalLine, modelValueToPDF } from "../PDFHelper";
import PDFRepresentation from "../PDFRepresentation";
import { ChildInformation } from "../../views/MP/OverviewSection/Sections";

const MR_PR = MR.V1_1_0.Profile;

export default class MRtoPDF extends PDFRepresentation<MR.V1_1_0.Profile.Bundle> {
    protected composition?: MIOEntry<MR.V1_1_0.Profile.Composition>;

    constructor(value: MR.V1_1_0.Profile.Bundle) {
        super(value, "Mutterpasseintrag", "s");

        this.composition = ParserUtil.getEntry<MR.V1_1_0.Profile.Composition>(
            this.value,
            [MR_PR.Composition]
        );
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
        const composition = this.composition?.resource;
        const title = composition ? composition.title : "-";
        const ref = composition?.author[0].reference;
        const date = composition?.date;

        let authorContent: Content | undefined = undefined;
        if (ref) {
            const author = Util.MP.getAuthor(
                this.value,
                new Reference(ref, this.composition?.fullUrl)
            );

            if (author && author.resource) {
                let model;

                if (MR.V1_1_0.Profile.Practitioner.is(author.resource)) {
                    model = new Models.MP.Basic.PractitionerModel(
                        author.resource,
                        author.fullUrl,
                        this.value
                    );
                } else {
                    model = new Models.MP.Basic.OrganizationModel(
                        author.resource,
                        author.fullUrl,
                        this.value
                    );
                }
                const address = new Models.AddressModel(
                    author.resource,
                    author.fullUrl,
                    this.value
                );
                const telecom = new Models.TelecomModel(
                    author.resource,
                    author.fullUrl,
                    this.value
                );

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
                patientResource.fullUrl,
                this.value
            );
            const address = new Models.AddressModel(
                patientResource.resource,
                patientResource.fullUrl,
                this.value
            );
            patient = [model.toPDFContent(), address.toPDFContent()];
        }

        return this.headingContent(title, date, authorContent, patient);
    }

    public getStampInformation(): Content {
        const content: Content = this.mapToModels(
            Mappings.StampInformation,
            this.composition?.fullUrl ?? "",
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
            this.composition?.fullUrl ?? "",
            Compare.Appointment
        );

        return this.sectionWithContent("Termine", content);
    }

    public getDateDetermination(): Content {
        const content: Content = this.mapToModels(
            Mappings.DateDetermination,
            this.composition?.fullUrl ?? "",
            Compare.DateDetermination
        );

        return this.sectionWithContent("Terminbestimmung", content);
    }

    public getAnamnesis(): Content {
        const section =
            this.getSection<MR.V1_1_0.Profile.CompositionAnamneseUndAllgemeineBefunde>(
                this.composition?.resource,
                [MR_PR.CompositionAnamneseUndAllgemeineBefunde]
            );

        const itemsAnamnesis: Content = this.mapToModels(
            Mappings.Anamnesis.Observations,
            this.composition?.fullUrl ?? "",
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
            this.composition?.fullUrl ?? "",
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
            this.composition?.fullUrl ?? "",
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

        const section = this.getSection<MR.V1_1_0.Profile.CompositionBesondereBefunde>(
            this.composition?.resource,
            [MR_PR.CompositionBesondereBefunde]
        );

        const itemsCatalogueB: Content[] = [];
        section?.entry?.forEach((entry) => {
            const ref = entry.reference;
            const res =
                ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.ObservationSpecialFindings>(
                    this.value,
                    [MR_PR.ObservationSpecialFindings],
                    new Reference(ref, this.composition?.fullUrl)
                );

            if (res) {
                const model = new Models.MP.Basic.ObservationModel(
                    res.resource,
                    res.fullUrl,
                    this.value,
                    undefined,
                    [MR.V1_1_0.ConceptMap.SpecialFindingsGerman]
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

        const sectionOGTT =
            this.getSection<MR.V1_1_0.Profile.CompositionBesondereBefundeSection>(
                section,
                [MR_PR.CompositionBesondereBefundeSection]
            );

        if (sectionOGTT) {
            const itemsOGTT: Content[] = this.mapToModels(
                Mappings.SpecialFindings.Tests,
                this.composition?.fullUrl ?? "",
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
        const content = this.mapToModels(
            Mappings.Counselling,
            this.composition?.fullUrl ?? ""
        );
        return this.sectionWithContent("Beratung", content);
    }

    public getAntiDProphylaxis(): Content {
        const mappings = Mappings.AntiDProphylaxis;
        mappings[0].noHeadline = true;
        const content = this.mapToModels(mappings, this.composition?.fullUrl ?? "");
        return this.sectionWithContent("Anti-D-Prophylaxe", content);
    }

    public getInpatientTreatments(): Content {
        const content = this.mapToModels(
            Mappings.InpatientTreatment,
            this.composition?.fullUrl ?? ""
        );
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
        const section =
            this.getSection<MR.V1_1_0.Profile.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutz>(
                this.composition?.resource,
                [
                    MR_PR.CompositionUntersuchungen,
                    MR_PR.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutz
                ]
            );

        const itemsBloodGroup = this.mapToModels(
            Mappings.LaboratoryExamination.BloodGroups,
            this.composition?.fullUrl ?? "",
            undefined,
            section
        );

        const bloodGroupContent: Content = this.sectionWithContent(
            "Blutgruppenzugehörigkeit",
            itemsBloodGroup,
            "h2"
        );

        const slices = ParserUtil.getSlices<
            | MR.V1_1_0.Profile.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchung
            | MR.V1_1_0.Profile.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchungMaskiert
        >(
            [
                MR_PR.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchung,
                MR_PR.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchungMaskiert
            ],
            section?.section
        );

        const entries: { reference: string }[] = [];
        slices.forEach((slice) => {
            if (slice.entry) entries.push(...slice.entry);
        });

        const itemsExamination = this.mapToModels(
            Mappings.LaboratoryExamination.Observations,
            this.composition?.fullUrl ?? "",
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
            this.composition?.fullUrl ?? "",
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
        const section =
            this.getSection<MR.V1_1_0.Profile.CompositionUntersuchungenGravidogramm>(
                this.composition?.resource,
                [
                    MR_PR.CompositionUntersuchungen,
                    MR_PR.CompositionUntersuchungenGravidogramm
                ]
            );

        const content = this.mapToModels(
            Mappings.Gravidogramm.Basic,
            this.composition?.fullUrl ?? "",
            undefined,
            section
        );
        return this.sectionWithContent("Gravidogram", content);
    }

    protected getUltrasound(): Content {
        const section =
            this.getSection<MR.V1_1_0.Profile.CompositionUntersuchungenUltraschall>(
                this.composition?.resource,
                [
                    MR_PR.CompositionUntersuchungen,
                    MR_PR.CompositionUntersuchungenUltraschall
                ]
            );

        const content: Content = [];

        // Bemerkung
        section?.entry?.forEach((entry) => {
            const ref = entry.reference;
            const res =
                ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.ObservationUltrasound>(
                    this.value,
                    [MR_PR.ObservationUltrasound],
                    new Reference(ref, this.composition?.fullUrl)
                );

            if (res) {
                const model = new Models.MP.Basic.ObservationModel(
                    res.resource,
                    res.fullUrl,
                    this.value
                );
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
            | MR.V1_1_0.Profile.CompositionUntersuchungenUltraschallUltraschallI
            | MR.V1_1_0.Profile.CompositionUntersuchungenUltraschallUltraschallII
            | MR.V1_1_0.Profile.CompositionUntersuchungenUltraschallUltraschallIII
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
                this.composition?.fullUrl ?? "",
                undefined,
                subSection
            );

            content.push(diagnosticReportContent);
        });

        const otherUltrasoundSlices =
            ParserUtil.getSlices<MR.V1_1_0.Profile.CompositionUntersuchungenUltraschallWeitereUltraschallUntersuchungen>(
                [
                    MR_PR.CompositionUntersuchungenUltraschallWeitereUltraschallUntersuchungen
                ],
                section?.section
            );

        otherUltrasoundSlices.forEach((subSection) => {
            const itemsOtherUltrasound = this.mapToModels(
                Mappings.Ultrasound.Others,
                this.composition?.fullUrl ?? "",
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
        const section = undefined;

        this.getSection<MR.V1_1_0.Profile.CompositionUntersuchungenCardiotokografie>(
            this.composition?.resource,
            [
                MR_PR.CompositionUntersuchungen,
                MR_PR.CompositionUntersuchungenCardiotokografie
            ]
        );

        const content = this.mapToModels(
            Mappings.Cardiotocography,
            this.composition?.fullUrl ?? "",
            undefined,
            section
        );
        return this.sectionWithContent("Cardiotokografien", content, "h2");
    }

    protected getEpicrisis(): Content {
        const section =
            this.getSection<MR.V1_1_0.Profile.CompositionUntersuchungenEpikrise>(
                this.composition?.resource,
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
        section: MR.V1_1_0.Profile.CompositionUntersuchungenEpikrise | undefined
    ): Content {
        const content: Content = [];

        const slices =
            ParserUtil.getSlices<MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseSchwangerschaft>(
                [MR_PR.CompositionUntersuchungenEpikriseSchwangerschaft],
                section?.section
            );

        slices.forEach((subSection) => {
            const contentPregnancyExamination = this.mapToModels(
                Mappings.EpicrisisPregnancy.DischargeSummary,
                this.composition?.fullUrl ?? "",
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
        section: MR.V1_1_0.Profile.CompositionUntersuchungenEpikrise | undefined
    ): Content {
        const content: Content = [];

        const slices =
            ParserUtil.getSlices<MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseGeburt>(
                [MR_PR.CompositionUntersuchungenEpikriseGeburt],
                section?.section
            );

        slices.forEach((subSection) => {
            subSection.entry?.forEach((entry) => {
                const ref = entry.reference;
                const res =
                    ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation>(
                        this.value,
                        [MR_PR.ClinicalImpressionBirthExaminationDeliveryInformation],
                        new Reference(ref, this.composition?.fullUrl)
                    );

                if (res) {
                    const model = new Models.MP.Basic.ClinicalImpressionModel(
                        res.resource,
                        res.fullUrl,
                        this.value
                    );

                    content.push(model.toPDFContent(), horizontalLine);

                    const childSection =
                        ParserUtil.getSlices<MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseGeburtSection>(
                            [MR_PR.CompositionUntersuchungenEpikriseGeburtSection],
                            subSection.section
                        );

                    const childrenContent = this.mapChildren(
                        res.resource,
                        res.fullUrl,
                        childSection
                    );

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
        section: MR.V1_1_0.Profile.CompositionUntersuchungenEpikrise | undefined
    ): Content {
        const content: Content = [];

        const slices =
            ParserUtil.getSlices<MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseWochenbett>(
                [MR_PR.CompositionUntersuchungenEpikriseWochenbett],
                section?.section
            );

        slices.forEach((subSection) => {
            subSection.section?.forEach(() => {
                content.push(
                    this.mapToModels(
                        Mappings.EpicrisisFirstExamination.ClinicalImpression,
                        this.composition?.fullUrl ?? ""
                    )
                );
            });
        });

        return this.sectionWithContent(
            "Erste Untersuchung nach Entbindung (Wochenbett)",
            content,
            "h2"
        );
    }

    protected getSecondExamination(
        section: MR.V1_1_0.Profile.CompositionUntersuchungenEpikrise | undefined
    ): Content {
        const content: Content = [];

        const slices =
            ParserUtil.getSlices<MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindung>(
                [MR_PR.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindung],
                section?.section
            );

        slices.forEach((subSection) => {
            subSection.entry?.forEach((entry) => {
                const ref = entry.reference;
                const res =
                    ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.ClinicalImpressionSecondExaminationAfterChildbirth>(
                        this.value,
                        [MR_PR.ClinicalImpressionSecondExaminationAfterChildbirth],
                        new Reference(ref, this.composition?.fullUrl)
                    );

                if (res) {
                    const entryModel = new Models.MP.Basic.ClinicalImpressionModel(
                        res.resource,
                        res.fullUrl,
                        this.value
                    );

                    content.push(entryModel.toPDFContent(), horizontalLine);

                    const mother = new Models.MP.InformationAboutMotherModel(
                        res.resource,
                        res.fullUrl,
                        this.value
                    );

                    content.push(mother.toPDFContent(), horizontalLine);

                    const childSection =
                        ParserUtil.getSlices<MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindungAngabenZumKind>(
                            [
                                MR_PR.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindungAngabenZumKind
                            ],
                            subSection.section
                        );

                    const childrenContent = this.mapChildren(
                        res.resource,
                        res.fullUrl,
                        childSection
                    );

                    console.log(childSection);

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
            | MR.V1_1_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation
            | MR.V1_1_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirthMother
            | MR.V1_1_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirthChild
            | MR.V1_1_0.Profile.ClinicalImpressionSecondExaminationAfterChildbirth,

        fullUrl: string,
        section:
            | MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseGeburtSection[]
            | MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseWochenbettAngabenZurMutter[]
            | MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseWochenbettAngabenZumKind[]
            | MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindungAngabenZumKind[]
    ): Content[] {
        const content: Content = [];

        if (
            MR.V1_1_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation.is(
                resource
            )
        ) {
            const model = new Models.MP.InformationAboutChildModelBirth(
                resource,
                fullUrl,
                this.value
            );

            model.getChildInformation().forEach((i) => {
                const childContent: Content = [];

                const ref = i.resource.subject.reference;
                const res = Util.MP.getPatientChild(
                    this.value,
                    new Reference(ref, this.composition?.fullUrl)
                );

                if (res) {
                    const entryModel = new Models.MP.Basic.PatientChildModel(
                        res.resource,
                        res.fullUrl,
                        this.value
                    );

                    childContent.push(entryModel.toPDFContent());

                    const investigation =
                        new Models.MP.Basic.ClinicalImpressionInvestigationModel(
                            i.resource,
                            i.fullUrl,
                            this.value
                        );

                    if (childContent.length) {
                        content.push(
                            childContent,
                            investigation.toPDFContent(),
                            horizontalLine
                        );
                    }
                }
            });
        } else if (
            MR.V1_1_0.Profile.ClinicalImpressionSecondExaminationAfterChildbirth.is(
                resource
            )
        ) {
            const model = new Models.MP.InformationAboutChildModel(
                resource,
                fullUrl,
                this.value
            );

            model.getChildren().forEach((child) => {
                const childContent: Content = [];

                const res = Util.MP.getPatientChild(this.value, child);
                console.log(res);

                if (res) {
                    const childModel = new Models.MP.Basic.PatientChildModel(
                        res.resource,
                        res.fullUrl,
                        this.value
                    );

                    childContent.push(childModel.toPDFContent());

                    const items = ChildInformation.getListGroups(
                        this.value,
                        this.composition?.fullUrl ?? "",
                        section[0],
                        child.toString()
                    );

                    childContent.push(...items.map((value) => modelValueToPDF(value)));

                    if (childContent.length) {
                        content.push(childContent, horizontalLine);
                    }
                }
            });
        }

        return content;
    }

    protected getHints(): Content {
        const content: Content[] = [];

        const hints = ParserUtil.getSlice<MR.V1_1_0.Profile.CompositionHinweise>(
            MR.V1_1_0.Profile.CompositionHinweise,
            this.composition?.resource?.extension
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
