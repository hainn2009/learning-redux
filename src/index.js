import React from 'react'
import ReactDOM from 'react-dom'
// import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'

import { worker } from './api/server'
// import { fetchUsers } from './features/users/usersSlice'
// import { apiSlice } from './features/api/apiSlice'
import { extendedApiSlice } from './features/users/usersSlice'

// Wrap app rendering so we can wait for the mock API to initialize
async function main() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: 'bypass' })

  //old code
  // store.dispatch(fetchUsers())

  // store.dispatch(apiSlice.endpoints.getUsers.initiate())
  store.dispatch(extendedApiSlice.endpoints.getUsers.initiate())

  // const container = document.getElementById('root')
  // const root = createRoot(container)
  // root.render(
  //   <React.StrictMode>
  //     <Provider store={store}>
  //       <App />
  //     </Provider>
  //   </React.StrictMode>
  // )
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

main()
