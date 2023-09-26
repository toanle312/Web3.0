/* eslint-disable no-unused-vars */
import {
  Footer, Services, Transactions, Loading, Navbar, Welcome
} from "./Components"

import { TransactionsContext } from "./Context/TransactionsContext"
import { useContext } from "react"

const App = () => {
  const { currentAccount, connectWallet } = useContext(TransactionsContext);
  return (
    <>
      {(connectWallet !== undefined || currentAccount) ?
        <div className="min-h-screen">
          <div className="gradient-bg-welcome">
            <Navbar />
            <Welcome />
          </div>
          <Services />
          <Transactions />
          <Footer />
        </div> : <Loading />}
    </>)
}

export default App
