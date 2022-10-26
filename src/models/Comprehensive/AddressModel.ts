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

import { KBVBundleResource, ParserUtil } from "@kbv/mioparser";
import {
    addressLineAdresszusatzTypes,
    addressLineHausnummerTypes,
    addressLineStrasseTypes,
    addressLineTypes,
    addressTypeArray,
    addressTypeLineAdresszusatzArray,
    addressTypeLineArray,
    addressTypeLineHausnummerArray,
    addressTypeLineStrasseArray,
    addressTypes,
    codecsWithAddressArray,
    finalAdressType,
    postfachLineTypes,
    postfachTypeArray,
    postfachTypeLineArray,
    postfachTypes,
    typesWithAdress
} from "./AddressModelTypes";
import { UI } from "../../components/";

import BaseModel from "../BaseModel";
import { ModelValue } from "../Types";
import { Extension } from "@kbv/mioparser/dist/Definitions/FHIR/4.0.1/Extension";

export default class AddressModel<T extends typesWithAdress> extends BaseModel<T> {
    constructor(value: T, fullUrl: string, parent: KBVBundleResource, history?: History) {
        super(value, fullUrl, parent, history);

        this.headline = "Anschrift";
        if (codecsWithAddressArray.some((e) => e.is(value))) {
            this.values = this.getAddress();
        } else {
            this.values = [
                {
                    value: `Unter „${this.headline}“ sind derzeit keine Inhalte vorhanden.`,
                    label: "Hinweis",
                    renderAs: UI.ListItem.Hint
                }
            ];
        }
    }

    protected getAddress(): ModelValue[] {
        const address = ParserUtil.getSlices<addressTypes>(
            addressTypeArray,
            this.value.address
        );

        if (address.length) {
            const finalAddress: finalAdressType = address[0] as finalAdressType;

            const strassenAnschrift = ParserUtil.getSlices<addressLineTypes>(
                addressTypeLineArray,
                finalAddress?._line
            )[0];

            const streetObject = ParserUtil.getSlices<addressLineStrasseTypes>(
                addressTypeLineStrasseArray,
                strassenAnschrift?.extension
            );

            const street = streetObject
                ? streetObject.map((so) => so.valueString).join(", ")
                : undefined;

            const numberObject = ParserUtil.getSlices<addressLineHausnummerTypes>(
                addressTypeLineHausnummerArray,
                strassenAnschrift?.extension
            );

            const number = numberObject
                ? numberObject.map((no) => no.valueString).join(", ")
                : undefined;

            const additionObject = ParserUtil.getSlices<addressLineAdresszusatzTypes>(
                addressTypeLineAdresszusatzArray,
                strassenAnschrift?.extension
            );

            const addition = additionObject
                ? additionObject.map((ao) => ao.valueString).join(", ")
                : undefined;

            return this.fillValues(
                finalAddress?.line,
                street,
                number,
                addition,
                finalAddress?.postalCode,
                finalAddress?.city,
                finalAddress?.country,
                finalAddress?.use
            );
        } else {
            const postbox = ParserUtil.getSlices<postfachTypes>(
                postfachTypeArray,
                this.value.address
            );

            if (postbox.length) {
                const finalPostbox: finalAdressType = postbox[0] as finalAdressType;

                //TODO: figure out why this doesn't work without "as any[]"
                const postfachExtension = ParserUtil.getSlices<postfachLineTypes>(
                    postfachTypeLineArray,
                    finalPostbox?.extension
                ) as any[];

                console.log(postfachExtension);

                return this.fillValuesPostBox(
                    finalPostbox.line?.join(", "),
                    postfachExtension,
                    finalPostbox?.postalCode,
                    finalPostbox?.city,
                    finalPostbox?.country,
                    finalPostbox?.use
                );
            }

            return [];
        }
    }

    /**
     * TODO
     * else if (PKA.V1_0_0.Profile.NFDOrganization.is(this.value)) {
     *             return [
     *                 {
     *                     value: this.value.address.map((a) => a.city).join(", "),
     *                     label: "Stadt"
     *                 }
     *             ];
     *         }
     *
     *
     *         else if (PKA.V1_0_0.Profile.NFDPractitionerPhysician.is(this.value)) {
     *             return this.value.address.map((a: baseAddress) => {
     *                 return {
     *                     value: a.text ?? a.city ?? "-",
     *                     label: "Anschrift"
     *                 };
     *             });
     */

    public toString(): string {
        throw new Error("Method not implemented.");
    }

    protected fillValues(
        line?: string[],
        street?: string,
        number?: string,
        addition?: string,
        postalCode?: string,
        city?: string,
        country?: string,
        use?: string
    ): ModelValue[] {
        const values: ModelValue[] = [];

        if (use) {
            values.push({
                value: this.getAddressUse(use),
                label: "Art"
            });
        }

        if (street && number) {
            values.push({
                value: `${street} ${number}` + (addition ? `, ${addition}` : ""),
                label: "Adresszeile"
            });
        } else {
            values.push({
                value: line ? line.join(" ") : "-",
                label: "Adresszeile"
            });
        }

        values.push(
            {
                value: postalCode ? postalCode : "-",
                label: "Postleitzahl"
            },
            {
                value: city ? city : "-",
                label: "Stadt"
            },
            {
                value: country ? country : "-",
                label: "Land"
            }
        );

        return values;
    }

    protected fillValuesPostBox(
        line?: string,
        extensionContent?: (Extension | undefined)[],
        postalCode?: string,
        city?: string,
        country?: string,
        use?: string
    ): ModelValue[] {
        const values: ModelValue[] = [];

        if (use) {
            values.push({
                value: this.getAddressUse(use),
                label: "Art"
            });
        }

        values.push(
            {
                value: line ? line : "-",
                label: "Postfach"
            },
            {
                value: postalCode ? postalCode : "-",
                label: "Postleitzahl"
            },
            {
                value: city ? city : "-",
                label: "Stadt"
            },
            {
                value: country ? country : "-",
                label: "Land"
            }
        );

        extensionContent?.forEach((extension) => {
            // Adds Stadtteil
            if (
                extension?.url ===
                "http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-precinct"
            ) {
                values.push({
                    value: extension.valueString ?? "-",
                    label: "Stadtteil"
                });
                // default
            } else if (extension?.valueString) {
                values.push({
                    value: extension.valueString ?? "-",
                    label: "Zuatzinformation"
                });
            }
        });

        return values;
    }

    protected getAddressUse(use: string): string {
        /**
         * https://simplifier.net/packages/hl7.fhir.r4.core/4.0.1/files/79935
         *
         * home (Home): A communication address at a home.
         * work	(Work):	An office address. First choice for business related contacts during business hours.
         * temp	(Temporary): A temporary address. The period can provide more detailed information.
         * old (Old / Incorrect): This address is no longer in use (or was never correct but retained for records).
         * billing (Billing): An address to be used to send bills, invoices, receipts etc.
         *
         * Übersetzungen:
         * Postanschrift, Arbeit, Temporär, Veraltet, Rechnungsanschrift
         */

        const values = [
            {
                in: "home",
                out: "Postanschrift"
            },
            {
                in: "work",
                out: "Arbeit"
            },
            {
                in: "temp",
                out: "Temporär"
            },
            {
                in: "old",
                out: "Veraltet"
            },
            {
                in: "billing",
                out: "Rechnungsanschrift"
            }
        ];
        const result = values.filter((v) => v.in === use);

        if (result.length) {
            return result[0].out;
        }
        return "-";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.values.length ? this.values.map((v) => v.value).join(", ") : "-",
            label: this.headline
        };
    }
}
