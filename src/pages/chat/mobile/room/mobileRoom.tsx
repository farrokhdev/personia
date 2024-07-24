import React, { useEffect, useState } from "react";
import { Page } from "../../../../components/structure";
import RoomBox from "../../../../components/chat/create-room/box";
import UserList from "../../../../components/chat/create-room/userList";
import { ProfileModel } from "../../../../models/profile.model";
import { useNavigate } from "react-router-dom";
import { isDesktop } from "../../../../utils/detect-screen";

type Props = {};

const MobileRoom = (props: Props) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (isDesktop()) {
      navigate("/");
    }
  }, []);
  const [searchUser, setSearchUser] = useState<'noUser' | 'search' >('noUser');
  const [users, setUsers] = useState<Array<ProfileModel>>([])
  return (
    <Page title="Personia" sidebar={<></>} sidebar2={<></>} mainHeight="650px">
      {searchUser === 'search' ? <UserList setSearchUser={setSearchUser} setAddedUsers={setUsers} addedUsers={users} /> : null}
      {searchUser === 'noUser' ? <RoomBox setSearchUser={setSearchUser} setUserList={setUsers} usersList={users} /> : null}
    </Page>
  );
};

export default MobileRoom;
