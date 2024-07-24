import React, {useEffect, useState} from "react";
import {LoginChildSec} from "../../newStructures/LoginChild.style";
import {CLoader} from "../../custom";
import {v4 as uuid} from "uuid";

type Props = {};

export const Loading = (props: Props) => {
    return (
        <LoginChildSec>
            <div className="top-heading">
                <h3 className="title">Loading</h3>
                <div className="subtitle">It takes a few seconds, please wait.</div>
            </div>
            <div className="loading">
                <CLoader
                    width={50}
                    height={100}
                    central={true}
                    margin="0"
                    color="green100"
                />
            </div>
        </LoginChildSec>
    );
};
