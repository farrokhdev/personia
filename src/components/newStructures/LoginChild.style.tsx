import styled from 'styled-components'
import { breakpoints } from '../../config/global-styles'
import { isDesktop } from '../../utils/detect-screen'

export const LoginChildSec = styled.div<{}>`
    width: 100%;
    height: fit-content;
    /* min-height: 600px; */
    background: #140e26;
    padding: 40px 0px 40px 0px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 60px;
    color: #fff;
    padding: 55px;

    > .top-heading {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
        text-align: center;

        >.title {
            font-size: 30px !important;
            font-weight: bold;
        }

        .subtitle {
            font-size: 20px !important;
        }
        .Loading{
            font-size: 18px !important
        }
    }

    > .loading {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    > .preWelcome {
        flex-wrap: nowrap;
        display: flex;
        justify-content: space-between;
        padding: 0 !important;
        width: 100%;
        flex-direction: column;

        > button {
            width: 48%;
        }

        @media only screen and (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            > button {
                height: 64px;
                color: black;
                width: 90%;
            }

            > button:nth-of-type(2) {
                margin-top: 32px;
            }
        }
    }

    > .items-box-row {
        width: 100%;
        display: flex;
        flex-direction: ${isDesktop() ? 'row' : 'column'};
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    > .link-box {
        margin-top: -30px;

        > span {
            cursor: pointer;
            color: #39dbb2;
        }
    }

    > .items-box-col {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 1rem;
    }

    > form {
        width: 100%;
        padding: 40px 0px 40px 0px;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 60px;

        > .loading {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        > .items-box-row {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }

        > .link-box {
            margin-top: -30px;

            > span {
                cursor: pointer;
                color: #39dbb2;
            }
        }

        > .items-box-col {
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 1rem;
        }
    }
`
