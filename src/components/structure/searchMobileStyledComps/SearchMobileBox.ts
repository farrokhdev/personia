import styled from "styled-components";
import { breakpoints } from "../../../config/global-styles";

export const SearchMobileBox = styled.div<{
  $marginBottom: string;
  left: number;
}>`
/* position: relative; */
  > .mobile-search-box {
  width: 100%;
  position: absolute;
  top: 110px;
  left: 0;
  z-index: 200;
  background: ${(props) => props.theme.navy80};
  border-radius: 8px;
  padding: 15px;
  z-index: 200;
  height: 600px;
  overflow-y: scroll;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  /* @media only screen and ((max-width: ${breakpoints.tablet})) {
    width: 100%;
  } */

  .body {
    padding: 10px;
    display: block;
    position: relative;

    >.view-all {
        width:100%;
     display: flex;
     flex-direction: column;
     gap: 8px;
     /* overflow-y: scroll; */
     >.title-box{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        gap: 1rem;
        >.tag{
            display: flex;
            gap:8px;
            align-items: center;
        >.tag-before{
            width: 16px;
            height: 5px;
            border-radius: 50px;
            background-color: ${({ theme }) => theme.green100};
        }
        }
        a{
            font-size: 14px;
            color: ${({ theme }) => theme.green100};
            text-decoration: none;
        }
     }

     >.content-box{
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.gray50};
    overflow:hidden;
    padding:10px 0px;

     }
     >.content-box:last-child{
    border-bottom: none;
     }

    }
  }
}
`;
