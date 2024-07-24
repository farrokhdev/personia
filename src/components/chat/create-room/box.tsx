import React, { useEffect, useState } from 'react'
import { breakpoints } from '../../../config/global-styles'
import styled from 'styled-components'
import { ProfileModel } from '../../../models/profile.model'
import { Avatar } from '@mui/material'
import { CSvgButton } from '../../mui/SvgButton'
import { ReactComponent as AddIcon } from '../../../assets/svg/add.svg'
import { ReactComponent as RemoveIcon } from '../../../assets/svg/remove.svg'
import { ReactComponent as ArrowLeft } from '../../../assets/svg/arrow-left.svg'
import { useNavigate } from 'react-router-dom'
import { forEach } from 'lodash'
import { createChat, sendChatMessage } from '../../../apis/chat.apis'
import { encryptionService } from '../../../services'
import { v4 as uuid } from "uuid";
import { CButton, CModal, CTextField } from '../../mui'


export interface StyledInputType {
  $background: string
  right: number
}

const SelectionSStyle = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;

  > .column {
    align-items: center;
    align-content: center;
    align-self: center;
    margin: 0 auto 0 auto;
    width: 100%;
    flex: 1;
    text-align: center;
    height: 170px;

    &:last-child {
      border-left: 1px solid ${(props) => props.theme.black100};
    }

    > p {
      font-size: 16px;
      font-weight: 500;
      font-family: Inter;
      color: ${(props) => props.theme.black100};
      text-align: center;
      flex: 1;
      padding: 10px;
      vertical-align: top;
    }

    > button {
      vertical-align: bottom;
    }
  }
`;

const RoomBoxStyle = styled.div<StyledInputType>`
  padding: 8px 16px 8px 16px;
  background: ${({ theme, $background }) => theme[$background]};
  border: 0.5px solid ${props => props.theme.gray60};
  width: 350px;
  border-radius: 16px 16px 0 0;
  position: absolute;
  right: ${({ right }) => right};
  bottom: 0;
  box-shadow: -1px -1px 4px 0 rgba(255, 255, 255, 0.1);
  z-index: 30;
  @media only screen and (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    /* min-height: 766px;//// */
    position: static;
  }

  @media only screen and (min-width: ${breakpoints.minDesktop}) and (max-width: ${breakpoints.maxDesktop}) {
    width: 300px;
  }

  > .header {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    position: relative;
    height: fit-content;
    > .buttonBack {
      position: absolute;
      left: -10px;
      top: -5px;
    }
    > p {
      font-size: 16px;
      font-weight: 500;
      font-family: Inter;
      color: ${props => props.theme.black100};
      text-align: justify;
      flex: 1;
      @media only screen and (max-width: ${breakpoints.tablet}) {
        text-align: center;
        height: 56px;
      }

      &.green {
        color: ${props => props.theme.green100};
      }
    }
  }
  > .nav {
    width: 100%;
    display: flex;
    justify-content: center;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 95%;
      > .plus {
        width: 44px;
        height: 44px;
        border-radius: 8px;
        background: #2f1775;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        font-size: 25px;
        font-weight: 100;
        color: #201a31;
      }
      > .deActive {
        width: 44px;
        height: 44px;
        border-radius: 8px;
        background: #b8b7b7a3;
        color: #201a31;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        font-size: 25px;
        font-weight: 100;
      }
      > p {
        color: ${props => props.theme.white100};
        text-align: center;
        font-size: 16px;
      }
    }
  }
  > .body {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
    justify-content: center;
    > p {
      margin-top: 54px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
    }
    > .profile {
      width: 95%;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #40404a;
      padding-bottom: 12px;
      padding-top: 12px;
      align-items: center;
      color: white;
      font-size: 14px;
      > div {
        display: flex;
        align-items: center;
        font-weight: 400;
        p {
          margin-left: 20px;
        }
      }
    }
    > .butStyle {
      width: 103px;
      height: 32px;
      background: #39dbb2;
      color: black;
      font-size: 14px;
      border-radius: 6px;
    }
    > p {
      width: 100%;
      color: ${props => props.theme.white50};
      text-align: center;
    }
    > button {
      width: 103px;
      height: 32px;
      margin-top: 50px;
      font-size: 14px;
      border-radius: 8px;
      border: none;
    }
  }
`

type Props = {
  setSearchUser: (searchUser: 'search') => void
  usersList: Array<ProfileModel>
  setUserList: (userList: Array<ProfileModel>) => void
}

export default function RoomBox(props: Props) {
  const { usersList, setSearchUser, setUserList } = props
  const handleRemoveUser = (user: ProfileModel, index: number) => {
    setUserList(usersList.filter(u => u.id !== user.id))
  }
  const navigate = useNavigate()

  const [openModal, setOpenModal] = useState(false);
const [loading, setLoading]=useState<boolean>(false)
const [password, setPassword]=useState<string>('')
const handleSetPassword = (event: any) => {
  setPassword(event.target.value);
};

const createRoom = async() =>{
  setOpenModal(false)
  setLoading(true)
  const roomId = uuid();
  const encoded = await encryptionService.encodePassword(roomId, password);
  const params = new URLSearchParams();
  params.set("secret", encoded);
  
  var message = "Private video chat request";
  message +=
    "\n Room Link:\n\n" +
    "https://" +
    window.location.host +
    "/chat/private/" +
    roomId +
    "#" +
    params;
  message += "\n\n Click on link to join room";
  for(const user of usersList){
  createChat(user.id).then(result=>{
    if(result.data.chat){
      sendChatMessage(result.data.chat.id, {
        content: encodeURIComponent(message),
        messageType: "text",
      })
        .then((result) => {
          console.log('done')
        })
        .catch((error: any) => {
          console.error(error, "error");
        });
    }
  }).catch(error=>{
    setLoading(false)
  })
  
  setLoading(false)
  navigate("/chat/private/" + roomId + "#" + params);
}
}

const handleCreateRoom = ()=>{
setOpenModal(true)
}

  return (
    <RoomBoxStyle $background={'navy60'} right={window.innerWidth}>
      <div className="header">
        <div className="buttonBack">
          <CSvgButton
            backgroundColor="navy60"
            icon={<ArrowLeft />}
            onClick={() => navigate('/')}
          />
        </div>
        <p className="green">New video calls</p>
      </div>
      <div className="nav">
        <div>
          <p>Call with:</p>

          <div className={usersList.length == 4 ? 'deActive' : 'plus'}>
            <CSvgButton
              backgroundColor={usersList.length == 4 ? 'transparent' : 'navy30'}
              customColorHover={
                usersList.length == 4 ? 'transparent' : 'navy30'
              }
              backgroundColorHover={
                usersList.length == 4 ? 'transparent' : 'navy30'
              }
              badgeColor={usersList.length == 4 ? 'navy80' : 'navy30'}
              icon={<AddIcon />}
              onClick={() =>
                usersList.length == 4 ? null : setSearchUser('search')
              }
            />
          </div>
        </div>
      </div>
      <div className="body">
        {usersList.length ? (
          usersList.map((user, i) => {
            return (
              <>
                <div className="profile" key={user.id}>
                  <div>
                    <Avatar
                      alt={user.displayName}
                      src={`https://greenia.infura-ipfs.io/ipfs/${user.avatar}`}
                    />
                    <p>{user.displayName}</p>
                  </div>

                  <CSvgButton
                    backgroundColor="navy30"
                    customColorHover="navy30"
                    backgroundColorHover="navy30"
                    icon={<RemoveIcon />}
                    onClick={() => handleRemoveUser(user, i)}
                  />
                </div>
              </>
            )
          })
        ) : (
          <>
            <p>
              There is no user in the call yet. Please add new user to start.
            </p>
          </>
        )}
        <button onClick={usersList.length !== 0 ? handleCreateRoom : null} className={usersList.length !== 0 ? 'butStyle' : null}>
          Create call
        </button>


        <CModal
              open={openModal}
              onClose={() => {
                setOpenModal(false);
              }}
              title="Select type of video chat"
            >
              <SelectionSStyle>
                <div className={"column"}>
                  <p>Private video chat</p>

                  <div
                    style={{
                      marginLeft: "20px",
                      marginRight: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <CTextField
                      label={"Password"}
                      value={password}
                      onChange={(event: any) => handleSetPassword(event)}
                      placeholder={"Set password to chat"}
                      background={"navy100"}
                    />
                  </div>

                  <CButton
                    background={"navy60"}
                    size={"s"}
                    backgroundHover={"navy100"}
                    onClick={createRoom}
                  >
                    Generate Room
                  </CButton>
                </div>
              </SelectionSStyle>
            </CModal>
      </div>
    </RoomBoxStyle>
  )
}
