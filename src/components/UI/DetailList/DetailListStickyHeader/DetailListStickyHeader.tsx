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

import React from "react";

import "./DetailListStickyHeader.scss";

export type DetailListStickyHeaderProps = {
    className?: string;
};

export type DetailListStickyHeaderState = {
    stuck: boolean;
};

export default class DetailListStickyHeader<
    P extends DetailListStickyHeaderProps,
    S extends DetailListStickyHeaderState
> extends React.Component<P, S> {
    protected ref: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount(): void {
        this.observeTop();
        // this.observeBottom();
    }

    observeTop(): void {
        const sentinel = this.ref.current?.querySelector(".sentinel-top");
        if (sentinel) {
            const observer = new IntersectionObserver(
                (records) => {
                    for (const record of records) {
                        const targetInfo = record.boundingClientRect;
                        const stickyTarget = this.ref.current?.querySelector(".sticky");
                        const rootBoundsInfo = record.rootBounds;

                        if (rootBoundsInfo) {
                            if (targetInfo.bottom < rootBoundsInfo.top && stickyTarget) {
                                this.addClass(true, stickyTarget);
                            }

                            if (
                                targetInfo.bottom >= rootBoundsInfo.top &&
                                targetInfo.bottom < rootBoundsInfo.bottom &&
                                stickyTarget
                            ) {
                                this.addClass(false, stickyTarget);
                            }
                        }
                    }
                },
                { threshold: [0] }
            );
            observer.observe(sentinel);
        }
    }

    /*
  observeBottom = () => {
    const sentinel = this.ref.current?.querySelector(".sentinel-bottom");

    if (sentinel) {
      const observer = new IntersectionObserver(
        (records) => {
          for (const record of records) {
            const targetInfo = record.boundingClientRect;
            const stickyTarget = this.ref.current?.querySelector(".sticky");
            const rootBoundsInfo = record.rootBounds;
            const ratio = record.intersectionRatio;

            if (rootBoundsInfo) {
              if (targetInfo.bottom > rootBoundsInfo.top && ratio === 1) {
                this.addClass(true, stickyTarget);
              }

              if (
                targetInfo.top < rootBoundsInfo.top &&
                targetInfo.bottom < rootBoundsInfo.bottom
              ) {
                this.addClass(false, stickyTarget);
              }
            }
          }
        },
        { threshold: [1] }
      );

      observer.observe(sentinel);
    }
  };
   */

    addClass(stuck: boolean, target: Element): void {
        target.classList.toggle("stuck", stuck);

        this.setState({
            stuck: stuck
        });
    }

    render(): JSX.Element {
        const { children, className } = this.props;

        const classes = className ? " " + className : "";

        return (
            <div
                className={"detail-list-sticky-header" + classes}
                ref={this.ref}
                data-testid={"detail-list"}
            >
                <div className={"sentinel-top"} />
                {children}
                <div className={"sentinel-bottom"} />
            </div>
        );
    }
}
