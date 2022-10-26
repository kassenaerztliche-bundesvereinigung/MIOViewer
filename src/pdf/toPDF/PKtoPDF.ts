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

import { ParserUtil, MIOEntry, PKA } from "@kbv/mioparser";
import { Util } from "../../components";

import * as Models from "../../models";

import { horizontalLine } from "../PDFHelper";
import PDFRepresentation from "../PDFRepresentation";
import Mappings from "../../views/PK/Mappings";

export default class ZBtoPDF extends PDFRepresentation<PKA.V1_0_0.Profile.NFDxDPEBundle> {
    protected composition?: MIOEntry<
        PKA.V1_0_0.Profile.DPECompositionDPE | PKA.V1_0_0.Profile.NFDCompositionNFD
    >;
    protected fullUrl: string;

    constructor(value: PKA.V1_0_0.Profile.NFDxDPEBundle) {
        super(value, "Patientenkurzakte", "");
        this.composition = Util.PK.getComposition(this.value);
        this.fullUrl = this.composition?.fullUrl ?? "";
    }

    public getContent(): Content {
        if (PKA.V1_0_0.Profile.DPECompositionDPE.is(this.composition?.resource)) {
            return this.getContentDPE();
        } else {
            return this.getContentNFD();
        }
    }

    public getHeading(): Content {
        const composition = ParserUtil.getEntry<
            PKA.V1_0_0.Profile.DPECompositionDPE | PKA.V1_0_0.Profile.NFDCompositionNFD
        >(this.value, [
            PKA.V1_0_0.Profile.DPECompositionDPE,
            PKA.V1_0_0.Profile.NFDCompositionNFD
        ]);

        const title = composition ? composition.resource.title : "-";

        const date = composition?.resource.date;

        const patient = Util.PK.getPatient(this.value);

        let patientContent = undefined;
        if (patient) {
            const model = new Models.PK.Patient(
                patient.resource,
                patient.fullUrl,
                this.value
            );
            patientContent = [model.toPDFContent()];

            const patientRes = patient.resource;
            if (patientRes && PKA.V1_0_0.Profile.NFDPatientNFD.is(patientRes)) {
                const address = new Models.TelecomModel(
                    patientRes,
                    patient.fullUrl,
                    this.value
                );
                patientContent.push(address.toPDFContent());

                const contact = new Models.ContactModel(
                    patientRes,
                    patient.fullUrl,
                    this.value
                );
                patientContent.push(contact.toPDFContent());
            }
        }

        return this.headingContent(
            title,
            date,
            undefined,
            patientContent,
            undefined,
            true
        );
    }

    public getContentDPE(): Content {
        const entries = Util.PK.getEntriesDPE(this.value);
        const contentDPE: Content[] = [];
        entries.forEach((entry) => {
            if (
                PKA.V1_0_0.Profile.DPEConsentPersonalConsent.is(entry.resource) ||
                PKA.V1_0_0.Profile.NFDxDPEConsentActiveAdvanceDirective.is(entry.resource)
            ) {
                const model = new Models.PK.Consent(
                    entry.resource,
                    entry.fullUrl,
                    this.value
                );
                contentDPE.push(model.toPDFContent());
            }
        });

        return [
            this.getHeading(),
            {
                text: "Persönliche Erklärungen",
                margin: [0, 0, 0, 0],
                style: "h2"
            },
            horizontalLine,
            contentDPE,
            horizontalLine
        ];
    }

    public getContentNFD(): Content {
        return [
            this.getHeading(),
            this.getContentPregnancy(),
            this.getContentAllergyIntolerance(),
            this.getContentImplant(),
            this.getContentCommunicationDisorder(),
            this.getContentRunawayRisk(),
            this.getContentNote(),
            this.getContentCondition(),
            this.getContentProcedure(),
            this.getContentVoluntaryAdditionalInformation(),
            this.getContentMedication(),
            this.getContentConsent(),
            this.getContentPractitionerRole()
        ];
    }

    public getContentPregnancy(): Content {
        const content = this.mapToModels(Mappings.Pregnancy, this.fullUrl);
        return this.sectionWithContent("Schwangerschaft", content);
    }

    public getContentAllergyIntolerance(): Content {
        const content = this.mapToModels(Mappings.AllergyIntolerance, this.fullUrl);
        return this.sectionWithContent("Allergie/Unverträglichkeit", content);
    }

    public getContentImplant(): Content {
        const content = this.mapToModels(Mappings.Implant, this.fullUrl);
        return this.sectionWithContent("Implantat", content);
    }

    public getContentCommunicationDisorder(): Content {
        const content = this.mapToModels(Mappings.CommunicationDisorder, this.fullUrl);
        return this.sectionWithContent("Kommunikationsstörung", content);
    }

    public getContentRunawayRisk(): Content {
        const content = this.mapToModels(Mappings.RunawayRisk, this.fullUrl);
        return this.sectionWithContent("Weglaufgefährdung/Hinlaufgefährdung", content);
    }

    public getContentNote(): Content {
        const content = this.mapToModels(Mappings.Note, this.fullUrl);
        return this.sectionWithContent("Sonstiger Hinweis", content);
    }

    public getContentCondition(): Content {
        const content = this.mapToModels(Mappings.Condition, this.fullUrl);
        return this.sectionWithContent("Diagnose", content);
    }

    public getContentProcedure(): Content {
        const content = this.mapToModels(Mappings.Procedure, this.fullUrl);
        return this.sectionWithContent("Prozedur", content);
    }

    public getContentVoluntaryAdditionalInformation(): Content {
        const content = this.mapToModels(
            Mappings.VoluntaryAdditionalInformation,
            this.fullUrl
        );
        return this.sectionWithContent("Freiwillige Zusatzinformationen", content);
    }

    public getContentMedication(): Content {
        const content = this.mapToModels(Mappings.Medication, this.fullUrl);
        return this.sectionWithContent("Medikationseinträge", content);
    }

    public getContentConsent(): Content {
        const content = this.mapToModels(Mappings.Consent, this.fullUrl);
        return this.sectionWithContent("NFD_Versicherter_Einwilligung", content);
    }

    public getContentPractitionerRole(): Content {
        const content = this.mapToModels(Mappings.PractitionerRole, this.fullUrl);
        return this.sectionWithContent("Behandelnde Person / Einrichtung", content);
    }
}
