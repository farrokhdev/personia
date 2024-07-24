import { useGlobalContext } from "../../contexts";
import { CButton } from "../mui";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { loginCheck } from "../../apis/auth.apis";
import { ApiErrorData } from "../../apis/http.api";
import { UserModel } from "../../models/user.model";
import { CModalTwo } from "../mui/ModalTwo";
import { Welcome } from "./login-wallet-connect-steps/welcome";
import { SignupQuestion } from "./login-wallet-connect-steps/signup-question";
import { Signup } from "./login-wallet-connect-steps/signup";
import { Loading } from "./login-wallet-connect-steps/loading";
import WalletIframe from "./login-wallet-connect-steps/walletIframe";

interface Props {
  color: string;
  textColor: string;
  size: string;
  setMainLoginState: (state: boolean) => void;
}

export function LoginWalletConnect(props: Props) {
  const { color, textColor, size } = props;

  const socket = io(process.env.REACT_APP_API_BASE_URL_SOCKET);
  const [loginState, setLoginState] = useState<boolean>(false);
  const [randomUuid, setUuid] = useState<string>(uuid());
  const [user, setUser] = useState<UserModel>();
  const [loading, setLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<
    | "welcome"
    | "signup-question"
    | "signup"
    | "none"
    | "loading"
    | "walletIframe"
  >("none");
  const [newLogin, setNewLogin] = useState(false);
  const [wallet, setWallet] = useState<string>("");
  const [did, setDid] = useState<string>("");

  function onConnect() {
    socket.emit("join", { randomString: "login-" + randomUuid });
  }

  function onDisconnect() {
    setLoginStep("none");
    setLoading(false);
    setLoginState(false);
  }

  function onLogin(value: any) {
    console.log(value);
    if (value.session) {
      setLoginStep("loading");
      localStorage.setItem("token", value.session);
      setLoading(true);
      loginCheck()
        .then((result) => {
          setLoading(false);
          setDid(result.data.did.pkh);
          setWallet(result.data.wallet);
          if (result.data.user) {
            setUser(result.data.user);
            setLoginStep("welcome");
            socket.emit('disconnect', {})
          } else {
            setLoginStep("signup-question");
          }
        })
        .catch((error: ApiErrorData) => {
          setLoading(false);
        });
    }
  }

  function onJoinEvent(value: any) {
    console.log("join event", value);
  }

  useEffect(() => {
    if (newLogin || loginState) {
      setNewLogin(false);
      setLoginStep("walletIframe");

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("join", onJoinEvent);
      socket.on("walletLogin", onLogin);

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("join", onJoinEvent);
        socket.off("walletLogin", onLogin);
      };
    }
  }, [newLogin, loginState]);

  const startLogin = () => {
    setLoginStep("walletIframe");
    setLoginState(true);
  };

  const closeLoginModal = () => {
    setLoginStep("none");
    setLoading(false);
    setLoginState(false);
  };

  return (
    <>

      {loginState && (
        <CModalTwo
          open={loginState}
          onClose={closeLoginModal}
          title="login modal"
          width={"540"}
        >
          {loginStep === "walletIframe" && (
            <WalletIframe randomString={randomUuid} />
          )}
          {loginStep === "loading" && <Loading />}
          {loginStep === "welcome" && (
            <Welcome
              loading={loading}
              user={user}
              onClose={closeLoginModal}
              wallet={wallet}
              did={did}
            />
          )}
          {loginStep === "signup-question" && (
            <SignupQuestion
              loading={loading}
              onClose={closeLoginModal}
              setLoginStep={setLoginStep}
              setNewLogin={setNewLogin}
            />
          )}

          {loginStep === "signup" && <Signup wallet={wallet} did={did} />}
        </CModalTwo>
      )}

      <CButton
        fullWidth
        size={"s"}
        background={color}
        backgroundHover={color}
        color={textColor}
        loadingColor={textColor}
        onClick={startLogin}
      >
        <p style={{ marginLeft: "10px" }}>Connect wallet</p>
      </CButton>
    </>
  );
}
