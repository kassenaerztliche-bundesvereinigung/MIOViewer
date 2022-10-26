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

import {
    PKA,
    MIOEntry,
    ParserUtil,
    Reference,
    DPEResource,
    NFDResource,
    NFDxDPEResource
} from "@kbv/mioparser";
import { Util } from "../index";
import * as Models from "../../models";
import { History } from "history";

type Bundle = PKA.V1_0_0.Profile.NFDxDPEBundle;
const PR = PKA.V1_0_0.Profile;

export function getComposition(
    mio: Bundle
):
    | MIOEntry<
          PKA.V1_0_0.Profile.DPECompositionDPE | PKA.V1_0_0.Profile.NFDCompositionNFD
      >
    | undefined {
    return ParserUtil.getEntry<
        PKA.V1_0_0.Profile.DPECompositionDPE | PKA.V1_0_0.Profile.NFDCompositionNFD
    >(mio, [PKA.V1_0_0.Profile.DPECompositionDPE, PKA.V1_0_0.Profile.NFDCompositionNFD]);
}

export function getCompositionTitle(mio: Bundle): string {
    const composition = getComposition(mio);
    const title = composition?.resource.title;
    return title ? title : "-";
}

export function getPatient(
    mio: Bundle
):
    | MIOEntry<PKA.V1_0_0.Profile.DPEPatientDPE | PKA.V1_0_0.Profile.NFDPatientNFD>
    | undefined {
    const composition = Util.PK.getComposition(mio);
    const subject = composition?.resource.subject.reference;
    return Util.PK.getPatientByRef(mio, new Reference(subject, composition?.fullUrl));
}

export function getPatientByRef(
    mio: Bundle,
    ref?: Reference
):
    | MIOEntry<PKA.V1_0_0.Profile.DPEPatientDPE | PKA.V1_0_0.Profile.NFDPatientNFD>
    | undefined {
    if (!ref) {
        return;
    }
    return ParserUtil.getEntryWithRef<
        PKA.V1_0_0.Profile.DPEPatientDPE | PKA.V1_0_0.Profile.NFDPatientNFD
    >(mio, [PKA.V1_0_0.Profile.DPEPatientDPE, PKA.V1_0_0.Profile.NFDPatientNFD], ref);
}

export function getPatientName(
    patient: PKA.V1_0_0.Profile.DPEPatientDPE | PKA.V1_0_0.Profile.NFDPatientNFD
): string {
    if (patient && patient.name) {
        let nameStr = "-";
        // TODO: PKA.V1_0_0.Profile.NFDPatientNFDName
        const nameSlice = ParserUtil.getSlice<PKA.V1_0_0.Profile.DPEPatientDPEName>(
            PKA.V1_0_0.Profile.DPEPatientDPEName,
            patient.name
        );

        if (nameSlice) {
            const parts = [];

            if (nameSlice.prefix) {
                parts.push(nameSlice.prefix);
            }

            parts.push(nameSlice.given.join(" "));

            if (nameSlice.family) {
                parts.push(nameSlice.family);
            } else if (nameSlice._family) {
                const partsFamily = [];

                const addition =
                    ParserUtil.getSlice<PKA.V1_0_0.Profile.DPEPatientDPENameFamilyNamenszusatz>(
                        PKA.V1_0_0.Profile.DPEPatientDPENameFamilyNamenszusatz,
                        nameSlice._family.extension
                    )?.valueString;

                if (addition) {
                    partsFamily.push(addition);
                }

                const pre =
                    ParserUtil.getSlice<PKA.V1_0_0.Profile.DPEPatientDPENameFamilyVorsatzwort>(
                        PKA.V1_0_0.Profile.DPEPatientDPENameFamilyVorsatzwort,
                        nameSlice._family.extension
                    )?.valueString;

                if (pre) {
                    partsFamily.push(pre);
                }

                const family =
                    ParserUtil.getSlice<PKA.V1_0_0.Profile.DPEPatientDPENameFamilyNachname>(
                        PKA.V1_0_0.Profile.DPEPatientDPENameFamilyNachname,
                        nameSlice._family.extension
                    )?.valueString;

                if (family) {
                    partsFamily.push(family);
                }

                parts.push(partsFamily.join(" "));
            }

            nameStr = parts.join(" ");
        }

        return nameStr;
    }

    return "-";
}

export function getEntriesDPE(mio: Bundle): MIOEntry<DPEResource | NFDxDPEResource>[] {
    const entries: MIOEntry<DPEResource | NFDxDPEResource>[] = [];

    const composition = getComposition(mio);

    if (composition && PKA.V1_0_0.Profile.DPECompositionDPE.is(composition.resource)) {
        const section = composition.resource.section;
        const refs = section?.map((s) => s.entry.map((e) => e.reference)).flat();

        refs.forEach((ref) => {
            const resource = ParserUtil.getEntryWithRef<
                | PKA.V1_0_0.Profile.DPEConsentPersonalConsent
                | PKA.V1_0_0.Profile.NFDxDPEConsentActiveAdvanceDirective
            >(
                mio,
                [PR.DPEConsentPersonalConsent, PR.NFDxDPEConsentActiveAdvanceDirective],
                new Reference(ref, composition.fullUrl)
            );
            if (resource) {
                entries.push(resource);
            }
        });
    }

    return entries;
}

export function getEntriesNFD(mio: Bundle): MIOEntry<NFDResource | NFDxDPEResource>[] {
    const entries: MIOEntry<NFDResource | NFDxDPEResource>[] = [];

    const composition = getComposition(mio);

    if (composition && PKA.V1_0_0.Profile.NFDCompositionNFD.is(composition.resource)) {
        const section = composition.resource.section;
        const refs = section?.map((s) => s.entry?.map((e) => e.reference)).flat();

        refs?.forEach((ref) => {
            const resource = ParserUtil.getEntryWithRef<
                | PKA.V1_0_0.Profile.NFDObservationPregnancyStatus
                | PKA.V1_0_0.Profile.NFDObservationPregnancyCalculatedDeliveryDate
                | PKA.V1_0_0.Profile.NFDAllergyIntolerance
                | PKA.V1_0_0.Profile.NFDDeviceImplant
                | PKA.V1_0_0.Profile.NFDConditionCommunicationDisorder
                | PKA.V1_0_0.Profile.NFDConditionRunawayRisk
                | PKA.V1_0_0.Profile.NFDObservationNote
                | PKA.V1_0_0.Profile.NFDCondition
                | PKA.V1_0_0.Profile.NFDProcedure
                | PKA.V1_0_0.Profile.NFDObservationVoluntaryAdditionalInformation
                | PKA.V1_0_0.Profile.NFDMedicationStatementAdministrationInstruction
                | PKA.V1_0_0.Profile.NFDMedicationRecipe
                | PKA.V1_0_0.Profile.NFDxDPEConsentActiveAdvanceDirective
                | PKA.V1_0_0.Profile.NFDPractitionerRole
            >(
                mio,
                [
                    PR.NFDObservationPregnancyStatus,
                    PR.NFDObservationPregnancyCalculatedDeliveryDate,
                    PR.NFDAllergyIntolerance,
                    PR.NFDDeviceUseStatementImplant,
                    PR.NFDDeviceImplant,
                    PR.NFDConditionCommunicationDisorder,
                    PR.NFDConditionRunawayRisk,
                    PR.NFDObservationNote,
                    PR.NFDCondition,
                    PR.NFDProcedure,
                    PR.NFDObservationVoluntaryAdditionalInformation,
                    PR.NFDMedicationStatementAdministrationInstruction,
                    PR.NFDMedicationRecipe,
                    PR.NFDxDPEConsentActiveAdvanceDirective,
                    PR.NFDPractitionerRole
                ],
                new Reference(ref, composition.fullUrl)
            );
            if (resource) {
                entries.push(resource);
            }
        });
    }

    return entries;
}

export function handlePractitionerRoleWithOrganization(
    mio: Bundle,
    ref?: string,
    compositionUrl?: string,
    history?: History<unknown>,
    labelPractitioner = "Dokumentiert durch",
    labelOrganization = "Dokumentiert durch"
): Models.ModelValue[] {
    const roleRef = new Reference(ref, compositionUrl);

    const values: string[] = [];
    const labels: string[] = [];
    let onClick = undefined;

    const role =
        ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.NFDPractitionerRoleWithOrganization>(
            mio,
            [PR.NFDPractitionerRoleWithOrganization],
            roleRef
        )?.resource;

    if (role) {
        onClick = Util.Misc.toEntryByRef(history, mio, roleRef, true);
    }

    /*
    const practitionerRef = new Reference(role?.practitioner?.reference, compositionUrl);

    const practitioner =
        ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.NFDPractitionerPhysician>(
            mio,
            [PR.NFDPractitionerPhysician],
            practitionerRef
        );

    if (practitioner) {
        name = practitioner
            ? practitioner?.resource.name.map((n) => n.text).join(", ")
            : "-";
        onClick = Util.Misc.toEntryByRef(history, mio, practitionerRef, true);
    }

    values.push({
        value: name,
        label: labelPractitioner,
        onClick,
        subEntry: practitioner,
        subModels: [Models.PK.Practitioner, Models.AddressModel]
    });

    const organizationRef = new Reference(role?.organization?.reference, compositionUrl);

    const organization = ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.NFDOrganization>(
        mio,
        [PR.NFDOrganization],
        organizationRef
    )?.resource;

    if (organization) {
        name = organization.name;
        onClick = Util.Misc.toEntryByRef(history, mio, organizationRef, true);
    }

    values.push({
        value: name,
        label: labelOrganization,
        onClick,
        subModels: [Models.PK.Organization, Models.AddressModel]
    });
    */

    const practitionerRef = new Reference(role?.practitioner?.reference, compositionUrl);

    const practitioner =
        ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.NFDPractitionerPhysician>(
            mio,
            [PR.NFDPractitionerPhysician],
            practitionerRef
        );

    if (practitioner) {
        values.push(
            practitioner ? practitioner?.resource.name.map((n) => n.text).join(", ") : "-"
        );
        labels.push(labelPractitioner);
    }

    const organizationRef = new Reference(role?.organization?.reference, compositionUrl);

    const organization = ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.NFDOrganization>(
        mio,
        [PR.NFDOrganization],
        organizationRef
    )?.resource;

    if (organization) {
        values.push(organization.name);
        labels.push(labelOrganization);
    }

    if (!labels.length) {
        labels.push(labelPractitioner, labelOrganization);
    }
    let uniqueLabels = Array.from(new Set(labels));

    if (uniqueLabels.length === 2) {
        const pParts = uniqueLabels[0].split(" ");
        const oParts = uniqueLabels[1].split(" ");
        const pl = pParts[0];
        const ol = oParts[0];
        if (pl === ol) {
            uniqueLabels = [pl + " " + [pParts.pop(), oParts.pop()].join(", ")];
        }
    }

    return [
        {
            value: values.length ? values.join(", ") : "-",
            label: uniqueLabels.join(", "),
            onClick
        }
    ];
}

export function getPractitionerName(
    practitioner:
        | PKA.V1_0_0.Profile.NFDPractitioner
        | PKA.V1_0_0.Profile.NFDPractitionerPhysician
        | undefined
): string {
    if (practitioner && practitioner.name) {
        let nameStr = "-";

        const nameSlice = ParserUtil.getSlice<
            | PKA.V1_0_0.Profile.NFDPractitionerName
            | PKA.V1_0_0.Profile.NFDPractitionerPhysicianName
        >(PKA.V1_0_0.Profile.NFDPractitionerName, practitioner.name);

        if (nameSlice) {
            const parts = [];

            if (nameSlice.prefix) {
                parts.push(nameSlice.prefix);
            } else if (nameSlice._prefix) {
                parts.push(nameSlice._prefix.map((p) => p.value).join(" "));
            }

            parts.push(nameSlice.given.join(" "));

            if (nameSlice.family) {
                parts.push(nameSlice.family);
            } else if (nameSlice._family) {
                const partsFamily = [];

                const addition = ParserUtil.getSlice<
                    | PKA.V1_0_0.Profile.NFDPractitionerNameFamilyNamenszusatz
                    | PKA.V1_0_0.Profile.NFDPractitionerPhysicianNameFamilyNamenszusatz
                >(
                    PKA.V1_0_0.Profile.NFDPractitionerNameFamilyNamenszusatz,
                    nameSlice._family.extension
                )?.valueString;

                if (addition) {
                    partsFamily.push(addition);
                }

                const pre = ParserUtil.getSlice<
                    | PKA.V1_0_0.Profile.NFDPractitionerNameFamilyVorsatzwort
                    | PKA.V1_0_0.Profile.NFDPractitionerPhysicianNameFamilyVorsatzwort
                >(
                    PKA.V1_0_0.Profile.NFDPractitionerNameFamilyVorsatzwort,
                    nameSlice._family.extension
                )?.valueString;

                if (pre) {
                    partsFamily.push(pre);
                }

                const family = ParserUtil.getSlice<
                    | PKA.V1_0_0.Profile.NFDPractitionerNameFamilyNachname
                    | PKA.V1_0_0.Profile.NFDPractitionerPhysicianNameFamilyNachname
                >(
                    PKA.V1_0_0.Profile.NFDPractitionerNameFamilyNachname,
                    nameSlice._family.extension
                )?.valueString;

                if (family) {
                    partsFamily.push(family);
                }

                parts.push(partsFamily.join(" "));
            }

            nameStr = parts.join(" ");
        }

        return nameStr;
    }

    return "-";
}
