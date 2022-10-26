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

import { PKA, ParserUtil, Reference } from "@kbv/mioparser";
import { Util, UI } from "../../components";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { AddressModel } from "../Comprehensive";
import { Practitioner } from "./";

export default class PractitionerModel extends BaseModel<
    | PKA.V1_0_0.Profile.NFDPractitionerRole
    | PKA.V1_0_0.Profile.NFDPractitionerRoleWithOrganization
> {
    constructor(
        value:
            | PKA.V1_0_0.Profile.NFDPractitionerRole
            | PKA.V1_0_0.Profile.NFDPractitionerRoleWithOrganization,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Behandelnde Einrichtung";
        this.values = [
            this.getPractitioner(),
            this.getOrganization(),
            {
                value: this.getCoding(),
                label: "Einordnung"
            },
            {
                value: this.getSpeciality(),
                label: "Fachgruppe"
            }
        ];
    }

    protected getPractitioner(): ModelValue {
        const practitionerRef = this.value.practitioner?.reference;
        const ref = new Reference(practitionerRef, this.fullUrl);

        const practitioner = ParserUtil.getEntryWithRef<
            | PKA.V1_0_0.Profile.NFDPractitioner
            | PKA.V1_0_0.Profile.NFDPractitionerPhysician
        >(
            this.parent,
            [
                PKA.V1_0_0.Profile.NFDPractitioner,
                PKA.V1_0_0.Profile.NFDPractitionerPhysician
            ],
            ref
        );

        let name = "-";
        const practitionerRes = practitioner?.resource;
        if (practitionerRes) {
            name = Util.PK.getPractitionerName(practitionerRes);
        }

        return {
            value: name,
            label: "Behandelnde Person",
            onClick: Util.Misc.toEntryByRef(this.history, this.parent, ref),
            subEntry: practitioner,
            subModels: [Practitioner, AddressModel]
        };
    }

    protected getOrganization(): ModelValue {
        let name = "-";
        let onClick = undefined;

        if (PKA.V1_0_0.Profile.NFDPractitionerRoleWithOrganization.is(this.value)) {
            const organizationRef = this.value.organization?.reference;
            const ref = new Reference(organizationRef, this.fullUrl);

            const organization =
                ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.NFDOrganization>(
                    this.parent,
                    [PKA.V1_0_0.Profile.NFDOrganization],
                    ref
                )?.resource;

            if (organization) {
                name = organization.name;
                onClick = Util.Misc.toEntryByRef(this.history, this.parent, ref);
            }
        } else {
            name = this.value.organization?.display ?? "-";
        }

        return {
            value: name,
            label: "Organisation",
            onClick
        };
    }

    protected getSpeciality(): string {
        return (
            this.value.specialty?.map((c) => Util.FHIR.handleCode(c)).join(", ") ?? "-"
        );
    }

    public getCoding(): string {
        return this.value.code
            .map((c) =>
                Util.FHIR.handleCode(c, [
                    PKA.V1_0_0.ConceptMap.NFDPersonInstitutionGerman
                ])
            )
            .join(", ");
    }

    public getMainValue(): ModelValue {
        return {
            value: [this.getPractitioner().value, this.getOrganization().value]
                .filter((v) => v !== "-")
                .join(", "),
            label: this.getCoding(),
            renderAs: UI.ListItem.NoLabel
        };
    }
}
