import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { FullLoader } from '../components/custom'
import { set } from '../redux/slices/user'
import { loginCheck, loginPersonia } from '../apis/auth.apis'
import { ApiErrorData } from '../apis/http.api'

interface Props {
  children: ReactNode
}

export function AuthProxyProvider(props: Props) {
  const { children } = props
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      loginPersonia()
        .then(result => {
          if (result.data.user) {
            dispatch(set({ ...result.data.user }))
          }
          setLoading(false)
        })
        .catch((error: ApiErrorData) => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  return <>{loading ? <FullLoader loaderStatus={loading} /> : children}</>
}
