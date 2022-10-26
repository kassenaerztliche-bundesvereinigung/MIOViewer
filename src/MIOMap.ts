import { MIOClassName } from "./components/UI";
import { Vaccination, ZAEB, MR, CMR, PKA, KBVBundleResource } from "@kbv/mioparser";
import { Util } from "./components";

export type BundleType =
    | typeof Vaccination.V1_1_0.Profile.BundleEntry
    | typeof ZAEB.V1_1_0.Profile.Bundle
    | typeof MR.V1_0_0.Profile.Bundle
    | typeof MR.V1_1_0.Profile.Bundle
    | typeof CMR.V1_0_1.Profile.CMRBundle
    | typeof CMR.V1_0_1.Profile.PCBundle
    | typeof CMR.V1_0_1.Profile.PNBundle
    | typeof PKA.V1_0_0.Profile.NFDxDPEBundle;

export type BundleMapType = {
    className: MIOClassName;
    headline: string;
    labelGrouped: string;
    label: (mio: KBVBundleResource) => string;
    subline: (mio: KBVBundleResource) => string;
    bundles: BundleType[];
    compare?: (a: KBVBundleResource, b: KBVBundleResource) => number;
};

const compareUH = (a: KBVBundleResource, b: KBVBundleResource): number => {
    const compositionA = Util.UH.getComposition(
        a as
            | CMR.V1_0_1.Profile.CMRBundle
            | CMR.V1_0_1.Profile.PCBundle
            | CMR.V1_0_1.Profile.PNBundle
    )?.resource;

    const compositionB = Util.UH.getComposition(
        b as
            | CMR.V1_0_1.Profile.CMRBundle
            | CMR.V1_0_1.Profile.PCBundle
            | CMR.V1_0_1.Profile.PNBundle
    )?.resource;

    if (compositionA && compositionB) {
        return (
            new Date(compositionB.date).getTime() - new Date(compositionA.date).getTime()
        );
    } else {
        return 0;
    }
};

const bundleMap: BundleMapType[] = [
    {
        className: "impfpass",
        headline: "Impfpass",
        labelGrouped: "Impfpass",
        label: () => "Impfpass",
        subline: (m: KBVBundleResource): string => {
            const mio = m as Vaccination.V1_1_0.Profile.BundleEntry;
            const patient = Util.IM.getPatient(mio);
            return patient ? Util.IM.getPatientName(patient.resource) : "";
        },
        bundles: [Vaccination.V1_1_0.Profile.BundleEntry]
    },
    {
        className: "zaeb",
        headline: "Bonusheft",
        labelGrouped: "Zahnärztliches Bonusheft",
        label: () => "Zahnärztliches Bonusheft",
        subline: (m: KBVBundleResource): string => {
            const mio = m as ZAEB.V1_1_0.Profile.Bundle;
            const patient = Util.ZB.getPatient(mio);
            return patient ? Util.ZB.getPatientName(patient.resource) : "";
        },
        bundles: [ZAEB.V1_1_0.Profile.Bundle]
    },
    {
        className: "mutterpass",
        headline: "Mutterpass",
        labelGrouped: "Mutterpass",
        label: () => "Mutterpass",
        subline: (m: KBVBundleResource): string => {
            const mio = m as MR.V1_1_0.Profile.Bundle;
            const patient = Util.MP.getPatientMother(mio);
            return patient ? Util.MP.getPatientMotherName(patient.resource) : "";
        },
        bundles: [MR.V1_0_0.Profile.Bundle, MR.V1_1_0.Profile.Bundle]
    },
    {
        className: "uheft",
        headline: "U-Heft",
        labelGrouped: "Kinderuntersuchungsheft",
        label: (m: KBVBundleResource): string => {
            if (CMR.V1_0_1.Profile.PCBundle.is(m)) {
                const type = Util.UH.getEncounterTypeFromBundle(m);
                return "Teilnahmekarte " + type;
            } else if (CMR.V1_0_1.Profile.PNBundle.is(m)) {
                const type = Util.UH.getEncounterTypeFromBundle(m);
                return "Elternnotiz " + type;
            } else {
                const mio = m as CMR.V1_0_1.Profile.CMRBundle;
                const type = Util.UH.getTypeFromBundle(mio);
                return type ? type : "Undefined";
            }
        },
        subline: (m: KBVBundleResource): string => {
            const mio = m as CMR.V1_0_1.Profile.CMRBundle;
            const patient = Util.UH.getPatient(mio);
            return patient ? Util.UH.getPatientName(patient.resource) : "";
        },
        bundles: [
            CMR.V1_0_1.Profile.CMRBundle,
            CMR.V1_0_1.Profile.PCBundle,
            CMR.V1_0_1.Profile.PNBundle
        ],
        compare: compareUH
    },
    {
        className: "pka",
        headline: "Patientenkurzakte",
        labelGrouped: "Patientenkurzakte",
        label: (m: KBVBundleResource) => {
            const mio = m as PKA.V1_0_0.Profile.NFDxDPEBundle;
            const types = mio.identifier.type.coding.map((c) => c.code);

            return types
                .map((t) => t?.replace("DPE_", "").replaceAll("_", " "))
                .join(", ");
        },
        subline: (m: KBVBundleResource): string => {
            const mio = m as PKA.V1_0_0.Profile.NFDxDPEBundle;
            const patient = Util.PK.getPatient(mio);
            return patient ? Util.PK.getPatientName(patient.resource) : "";
        },
        bundles: [PKA.V1_0_0.Profile.NFDxDPEBundle]
    }
];

export default bundleMap;
