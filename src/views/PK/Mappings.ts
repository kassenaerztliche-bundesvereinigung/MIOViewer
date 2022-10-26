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

import { PKA } from "@kbv/mioparser";
import * as Models from "../../models";
import { DetailMapping } from "../Comprehensive/Detail/Types";

const PR = PKA.V1_0_0.Profile;

export default class Mappings {
    static Basic: DetailMapping[] = [
        {
            profile: PR.DPEPatientDPE,
            header: "Patient/-in",
            models: [Models.PK.Patient]
        },
        {
            profile: PR.NFDPatientNFD,
            header: "Patient/-in",
            models: [Models.PK.Patient, Models.TelecomModel, Models.ContactModel]
        },
        {
            profile: PR.NFDPractitioner,
            header: "Behandelnde Person",
            models: [Models.PK.Practitioner, Models.TelecomModel, Models.AddressModel]
        },
        {
            profile: PR.NFDPractitionerPhysician,
            header: "Behandelnde Person",
            models: [Models.PK.Practitioner, Models.AddressModel]
        },
        {
            profile: PR.NFDPractitionerRoleWithOrganization,
            header: "Details",
            models: [Models.PK.PractitionerRole]
        },
        {
            profile: PR.NFDOrganization,
            header: "Details",
            models: [Models.PK.Organization, Models.AddressModel]
        },
        {
            profile: PR.DPERelatedPersonContactPerson,
            header: "Bevollmächtigte Person",
            models: [Models.PK.RelatedPerson, Models.AddressModel, Models.TelecomModel]
        }
    ];

    static Consent: DetailMapping[] = [
        {
            profile: PR.DPEConsentPersonalConsent,
            header: "Details",
            models: [Models.PK.Consent]
        },
        {
            profile: PR.NFDxDPEConsentActiveAdvanceDirective,
            header: "Details",
            models: [Models.PK.Consent]
        }
    ];

    static Pregnancy: DetailMapping[] = [
        {
            profile: PR.NFDObservationPregnancyStatus,
            header: "Details",
            models: [Models.PK.Observation]
        },
        {
            profile: PR.NFDObservationPregnancyCalculatedDeliveryDate,
            header: "Details",
            models: [Models.PK.Observation]
        }
    ];

    static AllergyIntolerance: DetailMapping[] = [
        {
            profile: PR.NFDAllergyIntolerance,
            header: "Details",
            models: [Models.PK.AllergyIntolerance, Models.PK.AllergyIntoleranceReaction]
        }
    ];

    static Implant: DetailMapping[] = [
        {
            profile: PR.NFDDeviceImplant,
            header: "Details",
            models: [Models.PK.DeviceImplant]
        },
        {
            profile: PR.NFDDeviceUseStatementImplant,
            header: "Details",
            models: [Models.PK.DeviceUseStatement]
        }
    ];

    static CommunicationDisorder: DetailMapping[] = [
        {
            profile: PR.NFDConditionCommunicationDisorder,
            header: "Details",
            models: [Models.PK.Condition]
        }
    ];

    static RunawayRisk: DetailMapping[] = [
        {
            profile: PR.NFDConditionRunawayRisk,
            header: "Details",
            models: [Models.PK.Condition]
        }
    ];

    static Note: DetailMapping[] = [
        {
            profile: PR.NFDObservationNote,
            header: "Details",
            models: [Models.PK.Observation]
        }
    ];

    static Condition: DetailMapping[] = [
        {
            profile: PR.NFDCondition,
            header: "Details",
            models: [Models.PK.Condition]
        }
    ];

    static Procedure: DetailMapping[] = [
        {
            profile: PR.NFDProcedure,
            header: "Details",
            models: [Models.PK.Procedure]
        }
    ];

    static VoluntaryAdditionalInformation: DetailMapping[] = [
        {
            profile: PR.NFDObservationVoluntaryAdditionalInformation,
            header: "Details",
            models: [Models.PK.Observation]
        }
    ];

    static Medication: DetailMapping[] = [
        {
            profile: PR.NFDMedication,
            header: "Details",
            models: [Models.PK.Medication]
        },
        {
            profile: PR.NFDMedicationRecipe,
            header: "Details",
            models: [Models.PK.Medication]
        },
        {
            profile: PR.NFDMedicationStatementAdministrationInstruction,
            header: "Details",
            models: [Models.PK.MedicationStatement]
        }
    ];

    static PractitionerRole: DetailMapping[] = [
        {
            profile: PR.NFDPractitionerRole,
            header: "Details",
            models: [Models.PK.PractitionerRole]
        }
    ];

    static Filterable: DetailMapping[] = [
        {
            profile: PR.NFDPatientNFD,
            header: "Kontaktperson",
            models: [Models.ContactDetailsModel]
        }
    ];
}
