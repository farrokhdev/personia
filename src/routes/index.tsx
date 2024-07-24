import React, {type ReactElement} from 'react'
import {BrowserRouter as Router, Navigate, Route, Routes as Switch} from 'react-router-dom'
import {NotFoundPage} from '../pages'
import {useAppSelector} from '../redux/hooks'
import {PAGE_ROUTES} from './page-routes'
import {ROUTES} from './route-path'

const Routes: React.FC = (): ReactElement => {
    const user = useAppSelector((state) => state.user)


    return (
        <Router>
            <Switch>
                {PAGE_ROUTES.map(({id, isPrivate, prevent, deactivate, path, element}) =>
                    isPrivate || deactivate
                        ? (
                            deactivate
                                ? <Route key={id} path={path} element={<NotFoundPage/>}/>
                                : (
                                    prevent
                                        ? (
                                            user.did !== ''
                                                ? <Route key={id} path={path} element={<Navigate to={ROUTES.INDEX}/>}/>
                                                : <Route key={id} path={path} element={element}/>
                                        )
                                        : (
                                            user.did === ''
                                                ? <Route key={id} path={path} element={<Navigate to={ROUTES.INDEX}/>}/>
                                                : <Route key={id} path={path} element={element}/>
                                        )
                                )
                        )
                        : <Route key={id} path={path} element={element}/>
                )}
                <Route path='*' element={<NotFoundPage/>}/>
            </Switch>
        </Router>
    )
}

export default Routes
