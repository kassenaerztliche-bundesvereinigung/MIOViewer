/*
 * Copyright (c) 2020. Kassenärztliche Bundesvereinigung, KBV
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

import React from "react";

import { withIonLifeCycle, IonContent, IonPage } from "@ionic/react";
import { MIOClassName } from "../Statics";

import Header from "../Header";

type BasicViewProps = {
    headline: string;
    headerClass?: MIOClassName;
    className?: string;
    back?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    pdfDownload?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    padding?: boolean;
    testId?: string;
    id: string;
};

type BasicViewState = {
    headerPercent: number;
};

class BasicView extends React.Component<BasicViewProps, BasicViewState> {
    static defaultProps = {
        headerClass: "",
        padding: true
    };

    protected contentRef: React.RefObject<HTMLIonContentElement>;
    protected header: Element | null = null;
    protected headerHeight = 192;
    protected totalContentHeight = 0;
    protected viewportHeight = 0;

    constructor(props: BasicViewProps) {
        super(props);

        this.contentRef = React.createRef();

        this.state = {
            headerPercent: 0
        };
    }

    onScroll = async (e: CustomEvent): Promise<void> => {
        const scrollPosition = e.detail.scrollTop;
        this.updateScrollValues();

        const maxScroll =
            this.totalContentHeight - this.viewportHeight - this.headerHeight;

        const threshold = 64.0;

        if (maxScroll > 0) {
            let percent = scrollPosition / maxScroll;
            if (maxScroll >= threshold) {
                percent = scrollPosition / threshold;
            }

            const percentClamped = Math.min(1, Math.max(0, percent));
            /*
            console.log("header:    " + this.headerHeight);
            console.log("content:   " + this.totalContentHeight);
            console.log("viewport:  " + this.viewportHeight);
            console.log("maxScroll: " + maxScroll);
            console.log("scrollPos: " + scrollPosition);

            console.log(percentClamped);
            */

            this.setState({
                headerPercent: percentClamped
            });
        }
    };

    private async updateScrollValues(): Promise<void> {
        const content = this.contentRef.current;

        if (content) {
            const scrollElement = await content.getScrollElement();

            if (scrollElement) {
                // this.header = document.querySelector("ion-header.miov");
                // if (this.header) this.headerHeight = this.header.clientHeight;
                this.totalContentHeight = scrollElement.scrollHeight;
                this.viewportHeight = content.offsetHeight;
            }
        }
    }

    ionViewDidEnter(): void {
        this.setState({ headerPercent: 0 });
        this.updateScrollValues();
    }

    render(): JSX.Element {
        const {
            headline,
            headerClass,
            className,
            back,
            pdfDownload,
            children,
            padding,
            testId,
            id
        } = this.props;

        return (
            <IonPage className={className} id={"view-" + id}>
                <Header
                    headline={headline}
                    headerClass={headerClass}
                    percent={this.state.headerPercent}
                    back={back}
                    pdfDownload={pdfDownload}
                />
                <IonContent
                    fullscreen
                    scrollEvents={true}
                    onIonScroll={this.onScroll}
                    className={padding ? "ion-padding" : ""}
                    id={"page-content"}
                    data-testid={"page-content"}
                    ref={this.contentRef}
                >
                    <div className={"page-content-inner"} data-testid={testId}>
                        {children}
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}

export default withIonLifeCycle(BasicView);
