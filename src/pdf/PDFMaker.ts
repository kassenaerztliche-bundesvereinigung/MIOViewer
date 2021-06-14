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

import {
    KBVResource,
    KBVBundleResource,
    Vaccination,
    ZAEB,
    MR,
    CMR
} from "@kbv/mioparser";
import { Util } from "../components";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import * as pdfMake from "pdfmake/build/pdfmake";
import { vfs } from "../assets/fonts/vfs_fonts";

import { horizontalLine } from "./PDFHelper";

import { IMtoPDF, ZBtoPDF, MRtoPDF, CMRtoPDF, PCtoPDF, PNtoPDF } from "./toPDF";

import splashLogos from "../assets/img/logos-pdf.png";

export default class PDFMaker {
    public static async create(
        value: KBVResource | KBVBundleResource | undefined
    ): Promise<pdfMake.TCreatedPdf> {
        const headingGreen = "#65b3b6";

        let style = "";
        let exportHeader = "";
        let valueContent: Content = [];
        if (Vaccination.V1_00_000.Profile.BundleEntry.is(value)) {
            valueContent = new IMtoPDF(value).getContent();
            style = "vaccination";
            exportHeader = "Impfpass";
        } else if (ZAEB.V1_00_000.Profile.Bundle.is(value)) {
            valueContent = new ZBtoPDF(value).getContent();
            style = "zaeb";
            exportHeader = "Zahnärztliches Bonusheft";
        } else if (MR.V1_00_000.Profile.Bundle.is(value)) {
            valueContent = new MRtoPDF(value).getContent();
            style = "mr";
            exportHeader = "Mutterpass";
        } else if (CMR.V1_00_000.Profile.CMRBundle.is(value)) {
            valueContent = new CMRtoPDF(value).getContent();
            style = "cmr";
            exportHeader = "Kinderuntersuchungsheft";
        } else if (CMR.V1_00_000.Profile.PCBundle.is(value)) {
            valueContent = new PCtoPDF(value).getContent();
            style = "cmr";
            exportHeader = "Kinderuntersuchungsheft";
        } else if (CMR.V1_00_000.Profile.PNBundle.is(value)) {
            valueContent = new PNtoPDF(value).getContent();
            style = "cmr";
            exportHeader = "Kinderuntersuchungsheft";
        }

        const baseContent: Content = [
            {
                text: "",
                margin: [4, 4, 4, 4]
            },
            {
                layout: "noBorders",
                table: {
                    widths: ["40%", "*"],
                    body: [
                        [
                            {
                                svg: this.mioViewerLogo(),
                                margin: [-10, -1, 0, 0]
                            },
                            {
                                text: [
                                    exportHeader,
                                    "\n",
                                    { text: "PDF-Export", bold: false }
                                ],
                                style: ["h1", style],
                                margin: [0, 28, 4, 4],
                                fontSize: 20
                            }
                        ]
                    ]
                }
            },
            horizontalLine,
            {
                text: "",
                margin: [0, -16, 0, 0]
            }
        ];

        const docDefinition: TDocumentDefinitions = {
            info: {
                title: "MIO PDF Export",
                author: "",
                subject: "MIO, KBV, Export",
                keywords: ""
            },
            defaultStyle: {
                font: "Yantramanav"
            },
            pageMargins: [40, 40, 40, 70],
            footer: (currentPage, pageCount) => {
                return {
                    margin: [0, 30, 0, 0],
                    columns: [
                        {
                            image: splashLogos,
                            margin: [37, -3, 0, 0],
                            height: 29,
                            width: 70
                        },
                        {
                            text: "",
                            width: 24
                        },
                        {
                            text:
                                "Ein Service der Kassenärztlichen Bundesvereinigung (KBV) \n Generiert durch MIO Viewer " +
                                process.env.REACT_APP_VERSION,
                            margin: [24, 0, 0, 0],
                            fontSize: 9,
                            color: "#000000",
                            width: "*"
                        },
                        {
                            text: [
                                exportHeader + " | ",
                                "Seite ",
                                { text: currentPage.toString(), bold: true },
                                " von ",
                                { text: pageCount.toString(), bold: true },
                                "\n",
                                Util.Misc.formatDate(new Date().toISOString(), true),
                                " Uhr"
                            ],
                            alignment: "right",
                            width: 200,
                            fontSize: 9,
                            color: "#000000"
                        },
                        {
                            text: "",
                            width: 39
                        }
                    ]
                };
            },
            content: [...baseContent, valueContent],
            styles: {
                logo: {
                    alignment: "right"
                },
                h1: {
                    fontSize: 20,
                    color: headingGreen,
                    bold: true,
                    margin: [0, 16, 0, 4]
                },
                h2: {
                    fontSize: 16,
                    color: headingGreen,
                    bold: true,
                    margin: [0, 16, 0, 4]
                },
                h3: {
                    fontSize: 13,
                    color: headingGreen,
                    bold: true,
                    margin: [0, 16, 0, 4]
                },
                p: {
                    fontSize: 13,
                    margin: [0, 5],
                    lineHeight: 1.2
                },
                hint: {
                    fontSize: 12,
                    color: "#23519d",
                    margin: [0, 5, 0, 20]
                },
                zaeb: {
                    color: headingGreen
                },
                vaccination: {
                    color: headingGreen
                },
                mr: {
                    color: headingGreen
                },
                filledHeader: {
                    bold: false,
                    fontSize: 13,
                    alignment: "left",
                    color: headingGreen
                },
                subTable: {
                    fontSize: 9
                },
                footerPageCount: {
                    alignment: "left",
                    margin: [0, 0, 24, 0],
                    fontSize: 8,
                    color: "#646464"
                }
            }
        };

        return pdfMake.createPdf(
            docDefinition,
            {},
            {
                Yantramanav: {
                    normal: "Yantramanav-Light.ttf",
                    bold: "Yantramanav-Medium.ttf"
                }
            },
            vfs
        );
    }

    public static mioViewerLogo(): string {
        return `<svg width="182px" height="110px" viewBox="0 0 182 110" xmlns="http://www.w3.org/2000/svg">
                    <title>Export Layer MIO Viewer Logo</title>
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="mio42-keyvisual-rgb" fill-rule="nonzero">
                            <path d="M73.7822892,11.22 C73.4069366,10.8565796 73.0213159,10.5089074 72.6356952,10.1672922 L72.7965607,9.96256532 C73.1844631,10.3053919 73.5723656,10.6615439 73.95,11.0213302 L73.7822892,11.22 Z M22.0828792,9.16061758 L21.93,8.94983373 C22.3315931,8.62154394 22.7445951,8.29809976 23.158738,7.98071259 L23.303631,8.19876485 C22.8917699,8.51978622 22.4810497,8.8432304 22.0828792,9.16667458 L22.0828792,9.16061758 Z M71.4537337,9.16061758 C71.0555632,8.83475059 70.6459839,8.51130641 70.2364045,8.20118765 L70.3824384,7.98313539 C70.7942995,8.29567696 71.2061606,8.62154394 71.6066129,8.95225653 L71.4537337,9.16061758 Z M24.5631731,7.30111639 L24.4251254,7.07821853 C24.8495364,6.78384798 25.2853562,6.49311164 25.7200351,6.21691211 L25.8489556,6.44586698 C25.4131358,6.72085511 24.9795978,7.00916865 24.5586095,7.30111639 L24.5631731,7.30111639 Z M68.991694,7.28900238 C68.5707058,6.99463183 68.1405904,6.70510689 67.7116159,6.42769596 L67.8416773,6.19995249 C68.2729336,6.47857482 68.7064716,6.77052257 69.1297416,7.06610451 L68.991694,7.28900238 Z M27.1598377,5.64149644 L27.0389034,5.40769596 C27.4838503,5.14845606 27.9379244,4.89406176 28.3908575,4.65299287 L28.5049465,4.89527316 C28.0485907,5.13149644 27.601362,5.38346793 27.1598377,5.64149644 Z M66.3961703,5.61726841 C65.9580687,5.3580285 65.5074173,5.1024228 65.0590477,4.86014252 L65.1731367,4.61786223 C65.6294925,4.86014252 66.0778621,5.11817102 66.5193863,5.37983373 L66.3961703,5.61726841 Z M29.8740139,4.19629454 L29.770193,3.95401425 C30.2265488,3.73232779 30.7022998,3.51548694 31.1712054,3.3107601 L31.2658992,3.55304038 C30.7981345,3.75534442 30.3303698,3.97460808 29.8740139,4.19629454 Z M63.6968256,4.15631829 C63.2404698,3.93220903 62.7727051,3.71415677 62.3095039,3.50942993 L62.4064795,3.26714964 C62.8731033,3.47429929 63.3420089,3.69356295 63.8029283,3.92009501 L63.6968256,4.15631829 Z M32.6771796,2.9715677 L32.5916129,2.7208076 C33.0662229,2.53546318 33.5522419,2.35738717 34.0336973,2.19021378 L34.1112777,2.44339667 C33.6321041,2.60935867 33.1506487,2.78622328 32.6771796,2.9715677 Z M60.8970826,2.91705463 C60.4247544,2.72928741 59.943299,2.5536342 59.4664071,2.3828266 L59.5451285,2.12964371 C60.0243021,2.2980285 60.5091802,2.47852732 60.9849311,2.66750594 L60.8970826,2.91705463 Z M35.5624893,1.97216152 L35.492895,1.71534442 C35.9789139,1.56876485 36.4752009,1.42824228 36.9680652,1.29983373 L37.0285323,1.55786223 C36.5379498,1.68627078 36.0450855,1.82558195 35.5624893,1.97216152 L35.5624893,1.97216152 Z M58.0186183,1.90674584 C57.5348811,1.75895487 57.0420168,1.6184323 56.5537161,1.49002375 L56.6141833,1.23078385 C57.1059067,1.3604038 57.6010527,1.50092637 58.0882126,1.64992874 L58.0186183,1.90674584 Z M38.509407,1.20171021 L38.4592078,0.940047506 C38.9543539,0.831021378 39.4586271,0.729263658 39.9583367,0.639619952 L40.0005496,0.902494062 C39.5019809,0.992137767 39.0011304,1.09026128 38.5071252,1.20171021 L38.509407,1.20171021 Z M55.077405,1.13266033 C54.5845407,1.0236342 54.0836902,0.924299287 53.5874033,0.835866983 L53.6284753,0.572992874 C54.1281849,0.661425178 54.6324581,0.761971496 55.1287451,0.870997625 L55.077405,1.13266033 Z M41.5008194,0.660213777 L41.4677336,0.396128266 C41.969725,0.324655582 42.4797026,0.262874109 42.9839758,0.210783848 L43.0079345,0.47608076 C42.5025204,0.52695962 41.9959654,0.589952494 41.4973967,0.660213777 L41.5008194,0.660213777 Z M52.0848517,0.605700713 C51.5851421,0.537862233 51.0785872,0.48456057 50.5777366,0.432470309 L50.6005544,0.165961995 C51.1036867,0.213206651 51.6136644,0.272565321 52.1167966,0.3404038 L52.0848517,0.605700713 Z M44.5173313,0.34888361 L44.5013589,0.0823752969 C45.006773,0.0496674584 45.5201733,0.0266508314 46.0267282,0.0121140143 L46.0324327,0.278622328 C45.5293004,0.293159145 45.0193227,0.316175772 44.5173313,0.34888361 Z M49.0649171,0.316175772 C48.5617848,0.289524941 48.0518072,0.272565321 47.5498158,0.266508314 L47.557802,0 C48.0632161,0.00605700713 48.5766164,0.0218052257 49.0831713,0.0496674584 L49.0649171,0.316175772 Z" id="Shape" fill="#239398" />
                            <path d="M75.352704,12.24 C75.226224,12.1116774 75.098112,11.985 74.97,11.8599677 L75.094032,11.73 C75.223776,11.8558548 75.351888,11.9825323 75.48,12.1116774 L75.352704,12.24 Z" id="Path" fill="#239398" />
                            <path d="M47.0180337,109.65 C46.7503918,109.65 46.4835125,109.65 46.2173957,109.65 L46.2173957,109.390246 C46.7145538,109.395756 47.2128556,109.395756 47.7123011,109.390246 L47.7123011,109.65 L47.0180337,109.65 Z M49.2186442,109.613398 L49.2106378,109.353644 C49.7081771,109.337115 50.2114352,109.315862 50.7055432,109.287525 L50.7181246,109.547279 C50.2228729,109.574435 49.718471,109.596869 49.2186442,109.613398 Z M44.7167715,109.613398 C44.2192323,109.596869 43.7148304,109.574435 43.2172911,109.546098 L43.2321601,109.286345 C43.7274118,109.314681 44.2295262,109.337115 44.7259217,109.354825 L44.7167715,109.613398 Z M52.2164613,109.451643 L52.198161,109.191889 C52.6945565,109.152926 53.1955271,109.10924 53.68506,109.05965 L53.7102229,109.318223 C53.2184025,109.364271 52.7151443,109.41386 52.2164613,109.4481 L52.2164613,109.451643 Z M41.7200982,109.443378 C41.2237027,109.404415 40.7215883,109.358367 40.2251928,109.308778 L40.2503557,109.050205 C40.7444637,109.099794 41.2454343,109.145841 41.7372547,109.184804 L41.7200982,109.443378 Z M55.2039845,109.151745 L55.1742465,108.893172 C55.6672107,108.832956 56.1670375,108.765656 56.6611455,108.693633 L56.6966023,108.951026 C56.2002068,109.019507 55.7015238,109.086806 55.2039845,109.148203 L55.2039845,109.151745 Z M38.7337187,109.139938 C38.2373232,109.077361 37.7374964,109.010061 37.2468198,108.936858 L37.2822766,108.679465 C37.7706657,108.751488 38.2693487,108.819968 38.7691756,108.881365 L38.7337187,109.139938 Z M58.1777825,108.717247 L58.1366068,108.461036 C58.624996,108.378387 59.1213915,108.288654 59.6109244,108.195378 L59.6566751,108.450409 C59.1648547,108.541323 58.6673154,108.631056 58.1777825,108.713705 L58.1777825,108.717247 Z M35.7599208,108.701898 C35.2715316,108.618069 34.7739923,108.527155 34.2833157,108.432699 L34.3290664,108.176487 C34.8185993,108.272124 35.3138511,108.361857 35.8010964,108.444506 L35.7599208,108.701898 Z M61.1264176,108.150512 L61.074948,107.895481 C61.5610496,107.791579 62.05287,107.679413 62.5355403,107.563704 L62.5927287,107.817555 C62.1066271,107.929721 61.618238,108.041887 61.1298489,108.14697 L61.1264176,108.150512 Z M32.814717,108.126898 C32.3263279,108.020635 31.8333637,107.908468 31.3506934,107.791579 L31.4078818,107.538909 C31.8882645,107.656979 32.380085,107.766784 32.8661866,107.873047 L32.814717,108.126898 Z M64.0510335,107.446815 L63.98927,107.195326 C64.4662215,107.070172 64.952323,106.935572 65.4349933,106.79743 L65.5024757,107.047739 C65.0220929,107.187061 64.5337038,107.321661 64.0510335,107.446815 Z M29.8889573,107.424382 C29.406287,107.296866 28.9190416,107.162266 28.4398026,107.022944 L28.507285,106.772636 C28.9842364,106.910777 29.470338,107.045377 29.9507208,107.171712 L29.8889573,107.424382 Z M66.9470552,106.615603 L66.8738541,106.366475 C67.3473742,106.218888 67.8277569,106.064216 68.3024209,105.903641 L68.3801971,106.151588 C67.906677,106.310982 67.4240067,106.468015 66.9493428,106.615603 L66.9470552,106.615603 Z M27.0020857,106.590808 C26.5217029,106.439678 26.0401764,106.283826 25.5712314,106.118528 L25.6501514,105.871762 C26.1168089,106.029976 26.5960479,106.185828 27.0752869,106.335777 L27.0020857,106.590808 Z M69.8030451,105.654513 L69.7206937,105.408928 C70.1896388,105.238907 70.6631589,105.061802 71.1275289,104.882336 L71.2155991,105.12556 C70.7523729,105.306207 70.2765652,105.484493 69.8053326,105.654513 L69.8030451,105.654513 Z M24.1518147,105.627357 C23.6840134,105.457336 23.2093495,105.279051 22.742692,105.097223 L22.8307621,104.853999 C23.2962759,105.034646 23.7686523,105.208209 24.2353098,105.381772 L24.1518147,105.627357 Z M72.6167155,104.564728 L72.5229265,104.328588 C72.9804338,104.138495 73.4482351,103.940138 73.9068863,103.738238 L74.0052504,103.974378 C73.5443117,104.173916 73.0799417,104.373454 72.619003,104.564728 L72.6167155,104.564728 Z M21.3450069,104.536391 C20.8874995,104.343937 20.4162669,104.144399 19.9599033,103.946041 L20.0594112,103.709901 C20.5169186,103.91062 20.9744259,104.108978 21.4387959,104.300251 L21.3450069,104.536391 Z M75.3812038,103.347427 L75.2771209,103.111287 C75.7346283,102.899942 76.185273,102.680331 76.634774,102.45836 L76.7491509,102.6945 C76.289356,102.920013 75.8318486,103.136081 75.3834914,103.347427 L75.3812038,103.347427 Z M18.5885249,103.31909 C18.1367364,103.107745 17.679229,102.886954 17.229728,102.663802 L17.3441049,102.427662 C17.7924621,102.649633 18.2476819,102.869243 18.6983267,103.079408 L18.5885249,103.31909 Z M78.0907913,102.006152 L77.9764144,101.770012 C78.4201966,101.533872 78.8674101,101.297732 79.3043296,101.061593 L79.4187065,101.290648 C78.9875058,101.532692 78.5391485,101.773554 78.0930788,102.006152 L78.0907913,102.006152 Z M15.8880876,101.975454 C15.4420179,101.739314 14.9948045,101.503174 14.5590287,101.25995 L14.6734055,101.030894 C15.1068938,101.267034 15.5529635,101.511439 15.9978894,101.739314 L15.8880876,101.975454 Z M80.739759,100.539723 L80.6208071,100.322475 C81.0520078,100.072166 81.4877836,99.8112319 81.9178405,99.5479359 L82.0459426,99.7710881 C81.6147419,100.029661 81.1766786,100.291777 80.750053,100.542085 L80.739759,100.539723 Z M13.2425512,100.514929 C12.8102067,100.262259 12.3732872,100.001324 11.9455177,99.7392092 L12.0736198,99.516057 C12.5002454,99.7769916 12.9348775,100.036745 13.3660782,100.288234 L13.2425512,100.514929 Z M83.3269633,98.9564055 L83.1942861,98.7367954 C83.6163367,98.4652346 84.0406748,98.1842281 84.4524314,97.9044023 L84.5896837,98.121651 C84.1813583,98.4050189 83.7558765,98.687206 83.3315384,98.9587669 L83.3269633,98.9564055 Z M10.6656408,98.9351529 C10.2424465,98.6624114 9.81810842,98.3825856 9.40749555,98.1015791 L9.54474776,97.8843304 C9.95879194,98.1641562 10.3819863,98.4428013 10.8028931,98.71082 L10.6656408,98.9351529 Z M85.8443977,97.2573791 L85.7025704,97.0424918 C86.1131832,96.7520397 86.5260837,96.4521421 86.9286901,96.1534251 L87.0750925,96.3647703 C86.6759173,96.6682101 86.2607294,96.9681077 85.8489727,97.2597405 L85.8443977,97.2573791 Z M8.15850039,97.2408493 C7.75017505,96.9515779 7.33841841,96.6504996 6.93238061,96.3517826 L7.07992674,96.1404374 C7.483677,96.4403351 7.89428988,96.7378713 8.30032768,97.025962 L8.15850039,97.2408493 Z M88.2874871,95.4450055 L88.1410847,95.2454673 C88.5356848,94.9384854 88.9417226,94.6208773 89.3294601,94.3009078 L89.4850126,94.5051688 C89.0892688,94.8204155 88.6889498,95.1392043 88.2920621,95.4473669 L88.2874871,95.4450055 Z M5.72684866,95.4355599 C5.32767347,95.1250359 4.92621074,94.8074278 4.539617,94.4910004 L4.69516951,94.2867394 C5.08176325,94.6008054 5.47979467,94.9172329 5.87782609,95.2312989 L5.72684866,95.4355599 Z M90.6528002,93.5228269 L90.4926727,93.322108 C90.8769789,92.9962349 91.2624288,92.6609163 91.6364411,92.3255977 L91.8,92.5227745 C91.4305628,92.8616352 91.0439691,93.1981345 90.6573753,93.5251883 L90.6528002,93.5228269 Z M3.37297318,93.5228269 C2.99209828,93.1981345 2.60664831,92.8639966 2.22920472,92.5274973 L2.40191376,92.3326819 C2.77935735,92.6680005 3.16366355,93.0009577 3.54568221,93.3244694 L3.37297318,93.5228269 Z M1.10488033,91.5061923 C0.734299348,91.1626087 0.3625746,90.8107603 0,90.4589119 L0.171565268,90.27 C0.5329961,90.6242098 0.90357708,90.9713354 1.27301429,91.3125576 L1.10488033,91.5061923 Z" id="Shape" fill="#239398" />
                            <circle id="Oval" fill="#FFCC00" cx="16.575" cy="14.025" r="6.375" />
                            <circle id="Oval" fill="#239398" cx="96.645" cy="88.485" r="6.375" />
                            <ellipse id="Oval" fill="#91C9CB" cx="46.41" cy="40.545" rx="18.36" ry="18.615" />
                        </g>
                        <path d="M85.70142,47 L85.70142,39.87326 L89.25612,45.71684 L90.52194,45.71684 L94.09398,39.7172 L94.11132,47 L96.747,47 L96.71232,34.862 L94.4061,34.862 L89.93238,42.4049 L85.3893,34.862 L83.06574,34.862 L83.06574,47 L85.70142,47 Z M102.43452,47 L102.43452,34.862 L99.62544,34.862 L99.62544,47 L102.43452,47 Z M111.19122,47.20808 C112.45126,47.20808 113.58414,46.93642 114.58986,46.3931 C115.59558,45.84978 116.38744,45.10127 116.96544,44.14757 C117.54344,43.19387 117.83244,42.12168 117.83244,40.931 C117.83244,39.74032 117.54344,38.66813 116.96544,37.71443 C116.38744,36.76073 115.59558,36.01222 114.58986,35.4689 C113.58414,34.92558 112.45126,34.65392 111.19122,34.65392 C109.93118,34.65392 108.79541,34.92558 107.78391,35.4689 C106.77241,36.01222 105.98055,36.76073 105.40833,37.71443 C104.83611,38.66813 104.55,39.74032 104.55,40.931 C104.55,42.12168 104.83611,43.19387 105.40833,44.14757 C105.98055,45.10127 106.77241,45.84978 107.78391,46.3931 C108.79541,46.93642 109.93118,47.20808 111.19122,47.20808 Z M111.19122,44.81516 C110.4745,44.81516 109.82714,44.65043 109.24914,44.32097 C108.67114,43.99151 108.21741,43.532 107.88795,42.94244 C107.55849,42.35288 107.39376,41.6824 107.39376,40.931 C107.39376,40.1796 107.55849,39.50912 107.88795,38.91956 C108.21741,38.33 108.67114,37.87049 109.24914,37.54103 C109.82714,37.21157 110.4745,37.04684 111.19122,37.04684 C111.90794,37.04684 112.5553,37.21157 113.1333,37.54103 C113.7113,37.87049 114.16503,38.33 114.49449,38.91956 C114.82395,39.50912 114.98868,40.1796 114.98868,40.931 C114.98868,41.6824 114.82395,42.35288 114.49449,42.94244 C114.16503,43.532 113.7113,43.99151 113.1333,44.32097 C112.5553,44.65043 111.90794,44.81516 111.19122,44.81516 Z M130.10916,47 L135.48456,34.862 L134.18406,34.862 L129.50226,45.40472 L124.85514,34.862 L123.46794,34.862 L128.84334,47 L130.10916,47 Z M137.54802,35.88506 C137.80234,35.88506 138.0162,35.79836 138.1896,35.62496 C138.363,35.45156 138.4497,35.2377 138.4497,34.98338 C138.4497,34.75218 138.363,34.55277 138.1896,34.38515 C138.0162,34.21753 137.80234,34.13372 137.54802,34.13372 C137.2937,34.13372 137.07984,34.22042 136.90644,34.39382 C136.73304,34.56722 136.64634,34.76952 136.64634,35.00072 C136.64634,35.24348 136.73304,35.45156 136.90644,35.62496 C137.07984,35.79836 137.2937,35.88506 137.54802,35.88506 Z M138.15492,47 L138.15492,37.87916 L136.92378,37.87916 L136.92378,47 L138.15492,47 Z M145.45506,47.0867 C146.18334,47.0867 146.85093,46.95954 147.45783,46.70522 C148.06473,46.4509 148.57048,46.08098 148.97508,45.59546 L148.97508,45.59546 L148.28148,44.79782 C147.93468,45.19086 147.5243,45.48853 147.05034,45.69083 C146.57638,45.89313 146.05618,45.99428 145.48974,45.99428 C144.48402,45.99428 143.6517,45.70239 142.99278,45.11861 C142.33386,44.53483 141.96972,43.76898 141.90036,42.82106 L141.90036,42.82106 L149.52996,42.82106 L149.5473,42.43958 C149.5473,41.5379 149.35656,40.73737 148.97508,40.03799 C148.5936,39.33861 148.06762,38.7924 147.39714,38.39936 C146.72666,38.00632 145.96948,37.8098 145.1256,37.8098 C144.28172,37.8098 143.52165,38.00632 142.84539,38.39936 C142.16913,38.7924 141.63737,39.3415 141.25011,40.04666 C140.86285,40.75182 140.66922,41.54946 140.66922,42.43958 C140.66922,43.3297 140.87152,44.12734 141.27612,44.8325 C141.68072,45.53766 142.24427,46.08965 142.96677,46.48847 C143.68927,46.88729 144.5187,47.0867 145.45506,47.0867 Z M148.36818,41.90204 L141.90036,41.90204 C141.98128,41.00036 142.31941,40.26919 142.91475,39.70853 C143.51009,39.14787 144.24704,38.86754 145.1256,38.86754 C146.01572,38.86754 146.75845,39.14787 147.35379,39.70853 C147.94913,40.26919 148.28726,41.00036 148.36818,41.90204 L148.36818,41.90204 Z M154.90536,47 L157.7838,39.52646 L160.66224,47 L161.82402,47 L165.27468,37.87916 L164.14758,37.87916 L161.2518,45.63014 L158.33868,37.87916 L157.28094,37.87916 L154.35048,45.63014 L151.48938,37.87916 L150.31026,37.87916 L153.74358,47 L154.90536,47 Z M170.73678,47.0867 C171.46506,47.0867 172.13265,46.95954 172.73955,46.70522 C173.34645,46.4509 173.8522,46.08098 174.2568,45.59546 L174.2568,45.59546 L173.5632,44.79782 C173.2164,45.19086 172.80602,45.48853 172.33206,45.69083 C171.8581,45.89313 171.3379,45.99428 170.77146,45.99428 C169.76574,45.99428 168.93342,45.70239 168.2745,45.11861 C167.61558,44.53483 167.25144,43.76898 167.18208,42.82106 L167.18208,42.82106 L174.81168,42.82106 L174.82902,42.43958 C174.82902,41.5379 174.63828,40.73737 174.2568,40.03799 C173.87532,39.33861 173.34934,38.7924 172.67886,38.39936 C172.00838,38.00632 171.2512,37.8098 170.40732,37.8098 C169.56344,37.8098 168.80337,38.00632 168.12711,38.39936 C167.45085,38.7924 166.91909,39.3415 166.53183,40.04666 C166.14457,40.75182 165.95094,41.54946 165.95094,42.43958 C165.95094,43.3297 166.15324,44.12734 166.55784,44.8325 C166.96244,45.53766 167.52599,46.08965 168.24849,46.48847 C168.97099,46.88729 169.80042,47.0867 170.73678,47.0867 Z M173.6499,41.90204 L167.18208,41.90204 C167.263,41.00036 167.60113,40.26919 168.19647,39.70853 C168.79181,39.14787 169.52876,38.86754 170.40732,38.86754 C171.29744,38.86754 172.04017,39.14787 172.63551,39.70853 C173.23085,40.26919 173.56898,41.00036 173.6499,41.90204 L173.6499,41.90204 Z M178.57446,47 L178.57446,42.35288 C178.57446,41.28936 178.84612,40.46282 179.38944,39.87326 C179.93276,39.2837 180.68416,38.98892 181.64364,38.98892 L181.64364,38.98892 L181.93842,39.00626 L181.93842,37.8098 C181.09454,37.8098 180.38649,37.96586 179.81427,38.27798 C179.24205,38.5901 178.81144,39.0525 178.52244,39.66518 L178.52244,39.66518 L178.52244,37.87916 L177.34332,37.87916 L177.34332,47 L178.57446,47 Z" id="MIOViewer" fill="#65B3B6" />
                    </g>
                </svg>`;
    }
}
