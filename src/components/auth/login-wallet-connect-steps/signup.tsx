import React, { useState } from "react";
import { LoginChildSec } from "../../newStructures/LoginChild.style";
import { CButtonTwo } from "../../mui/ButtonTwo";
import { MyInputTwo } from "../../custom/inputTwo";
import MetamaskIcon from "../../../assets/svg/metamask.svg";
import { registerAcc } from "../../../apis/auth.apis";
import { ApiErrorData } from "../../../apis/http.api";
import { useAppDispatch } from "../../../redux/hooks";
import { useGlobalContext } from "../../../contexts";
import { set } from "../../../redux/slices/user";

type Props = {
  wallet: string;
  did: string;
};

export const Signup = ({ wallet, did }: Props) => {
  const dispatch = useAppDispatch();
  const { makeAlert } = useGlobalContext();

  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const register = (event: any, username: string) => {
    event.preventDefault();
    setLoading(true);
    var goOn = true;
    setUserNameError("");

    if (!userName) {
      setUserNameError("Required field");
      goOn = false;
    }

    if (!goOn) setLoading(false);
    else {
      registerAcc(username)
        .then((result) => {
          setLoading(false);
          if (result.data.user) {
            dispatch(
              set({
                ...result.data.user,
                wallet: wallet,
                did: did
              })
            );
            makeAlert("success", "Register account successfully done");
          }
        })
        .catch((error: ApiErrorData) => {
          setLoading(false);
          makeAlert("error", error.message);
        });
    }
  };

  const onChange = (e: any) => {
    e.preventDefault();
    setUserNameError("");
    setUserName(e.target.value);
  };

  return (
    <LoginChildSec>
      <div className="top-heading">
        <h3 className="title">Sign up</h3>
      </div>
      <form onSubmit={(event) => register(event, userName)}>
        <div className="items-box-col">
          <MyInputTwo
            placeholder={"Enter Your Name"}
            label={"Name"}
            value={userName}
            onChange={onChange}
            name={"name"}
            boxIcon={MetamaskIcon}
            background={"gray70"}
            border={"gray60"}
            color={"white100"}
            alert={userNameError}
          />
          <MyInputTwo
            placeholder={""}
            label={"Wallet"}
            name={"name"}
            boxIcon={MetamaskIcon}
            background={"gray70"}
            border={"gray60"}
            color={"white100"}
            boxType="metamask"
            boxText={`${wallet}`}
          />
        </div>
        <div className="loading">
          <CButtonTwo
            color={"#140E26"}
            background={"#39DBB2"}
            backgroundHover={"#2aaa8a"}
            variant={"filled"}
            fullWidth={true}
            type={"submit"}
            size="s"
            fontWeight={600}
            fontSize={"12px"}
            maxWidth={"296px"}
            loadingColor={"black100"}
            loading={loading}
            height={"40px"}
          >
            Sign up
          </CButtonTwo>
        </div>
      </form>
    </LoginChildSec>
  );
};
