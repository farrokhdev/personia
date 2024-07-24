import React, { ReactNode } from 'react'
import { Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { ROUTES } from './route-path'

interface Properties {
    deactivate: boolean,
    element: ReactNode,
    path: string,
    prevent: boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const PrivateRoute = ({ path, element: Component, deactivate = false, prevent = false }: Properties) => {
    const { did } = useAppSelector((state) => state.user)

    if (deactivate) {
        return <Route path={path} element={<Navigate to={ROUTES.NOT_FOUND} />} />
    }

    return (
        <Route
            path={path}
            // @ts-expect-error: Unreachable code error
            element={(properties) =>
                did !== ''
                    ? (
                        prevent
                            ? <Navigate to={ROUTES.INDEX} />
                            // @ts-expect-error: Unreachable code error
                            : <Component {...properties} />
                    )
                    : <Navigate to={ROUTES.INDEX} />
            }
        />
    )
}
