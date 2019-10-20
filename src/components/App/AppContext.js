import React from 'react'

const AppContext = React.createContext({})

AppContext.displayName = 'AppContext'

export default AppContext

export const withAppContext = Component => props =>
  <AppContext.Consumer>
    {appContext => <Component {...{ ...props, appContext }} />}
  </AppContext.Consumer>
