import React, { useEffect, useState } from 'react'
import { LoginChildSec } from '../../newStructures/LoginChild.style'
import { CLoader } from '../../custom'
import { v4 as uuid } from 'uuid'

type Props = {}

export const QrLoading = (props: Props) => {
  return (
    <LoginChildSec>
      <div className="top-heading">
        <h3 className="title">Generating Your Secure QR Code</h3>
        <div className="Loading">
          Please hold on a moment while we prepare your secure login.This won't
          take long!
        </div>
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
  )
}
