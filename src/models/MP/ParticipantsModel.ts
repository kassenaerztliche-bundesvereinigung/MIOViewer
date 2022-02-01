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
import { Util } from "../../components";

import MPBaseModel from "./MPBaseModel";
import { ModelValue } from "../Types";

export type ParticipantsType =
    | MR.V1_1_0.Profile.EncounterGeneral
    | MR.V1_1_0.Profile.AppointmentPregnancy;

export default class ParticipantsModel extends MPBaseModel<ParticipantsType> {
    constructor(
        value: ParticipantsType,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Teilnehmer";
        const participants = this.value.participant as {
            individual?: { reference: string };
            actor: { reference: string };
        }[];

        this.values = participants
            ? participants.map((p, index) => {
                  const part = p.individual ? p.individual : p.actor;
                  const ref = part.reference;

                  const result = ParserUtil.getEntryWithRef<
                      | MR.V1_1_0.Profile.Organization
                      | MR.V1_1_0.Profile.PatientMother
                      | MR.V1_1_0.Profile.Practitioner
                  >(
                      this.parent,
                      [
                          MR.V1_1_0.Profile.Organization,
                          MR.V1_1_0.Profile.PatientMother,
                          MR.V1_1_0.Profile.Practitioner
                      ],
                      new Reference(ref, this.fullUrl)
                  );

                  let participantValue = undefined;
                  let label = "Teilnehmer";
                  let onClick = undefined;

                  const resource = result?.resource;
                  const key = `item_${index}`;

                  if (result) {
                      onClick = Util.Misc.toEntry(history, parent, result, true);

                      if (MR.V1_1_0.Profile.Organization.is(resource)) {
                          participantValue = resource.name;
                          label = "Einrichtung";
                      } else if (MR.V1_1_0.Profile.PatientMother.is(resource)) {
                          participantValue = Util.MP.getPatientMotherName(resource);
                          label = "Patient/-in";
                      } else if (MR.V1_1_0.Profile.Practitioner.is(resource)) {
                          participantValue = Util.MP.getPractitionerName(resource);
                          label = "Behandelnde Person";
                      }
                  }

                  return {
                      value: participantValue ? participantValue : "-",
                      label,
                      onClick: onClick,
                      key
                  };
              })
            : [];
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.values.map((v) => v.value).join(", "),
            label: this.headline
        };
    }
}
