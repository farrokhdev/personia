import React, { useEffect } from "react";
import { ChatBox } from "../../../components/chat";
import { Page } from "../../../components/structure";
import { useNavigate } from "react-router-dom";
import { isDesktop } from "../../../utils/detect-screen";

type Props = {};

const MobileChatPage = (props: Props) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isDesktop()) {
      navigate("/");
    }
  }, []);
  return (
    <Page title="Personia" sidebar={<></>} sidebar2={<></>} mainHeight="650px">
      <ChatBox mobileChat={true} />
    </Page>
  );
};

export default MobileChatPage;
