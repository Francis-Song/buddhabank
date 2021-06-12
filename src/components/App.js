import React, {Component} from "react";
import {Navbar, Tabs, Tab} from "react-bootstrap";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from "web3"

import logo from '../logo.png';
import BuddhaBank from "../build/BuddhaBank.json";
import BuddhaToken from "../build/BuddhaToken.json";
import './App.css';



class App extends Component {

  async componentWillMount() {
    await this.connectBlockchain(this.props.dispatch)
  }

  async connectBlockchain(dispatch) {
    const provider = await detectEthereumProvider();

    if (provider) {
      startApp(provider); 
    } else {
      console.log('Please install MetaMask!');
    }

    function startApp(provider) {
      if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
      }
    }

    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const accounts = await web3.eth.getAccounts();

    if(typeof accounts[0] !=='undefined'){
      const balance = await web3.eth.getBalance(accounts[0])
      this.setState({account: accounts[0], balance: balance, web3: web3})
    } else {
      window.alert('Please login with MetaMask')
    }

    const buddhaBank = new web3.eth.Contract(BuddhaBank.abi, BuddhaBank.networks[networkId].address);
    const buddhaToken = new web3.eth.Contract(BuddhaToken.abi, BuddhaToken.networks[networkId].address);
    const buddhaBankAddress = BuddhaBank.networks[networkId].address
    this.setState({buddhaToken: buddhaToken, buddhaBank: buddhaBank, buddhaBankAddress: buddhaBankAddress})
  }

  async deposit(amount) {
    await this.state.buddhaBank.methods.deposit().send({value: amount.toString(), from: this.state.account})
  }

  async withdraw(e) {
    e.preventDefault()
    
    await this.state.buddhaBank.methods.withdraw().send({from: this.state.account})
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      buddhaToken: null,
      buddhaBank: null,
      balance: 0,
      buddhaBankAddress: null
    }
  }

  render() {
    return (
      <div>
   <Navbar style={{backgroundColor: "#FFEDB1"}}>
   <img
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="Buddha Bank logo"
      />
      Signed in as: {this.state.account}
  </Navbar>
      <br></br>
      <div className="App">
        <header className="App-header">
          <h3>Buddha Bank</h3>
          <h5>Deposit Ether and Earn BuddhaToken (10% APY)</h5>
          <p>*Ropsten Testnet Required</p>
          <img src={logo} className="App-logo" alt="logo" />
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="Deposit">
                  <div>
                  <br></br>
                    Deposit Ether (min. 0.01)
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      let amount = this.depositAmount.value
                      amount = amount * 10**18 //convert to wei
                      this.deposit(amount)
                    }}>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='depositAmount'
                          step="0.01"
                          type='number'
                          ref={(input) => { this.depositAmount = input }}
                          className="form-control form-control-md"
                          placeholder='amount...'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>DEPOSIT</button>
                    </form>

                  </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <br></br>
                    Withdraw Ether + BuddhaToken?
                    <br></br>
                    <br></br>
                  <div>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                  </div>
                </Tab> 
              </Tabs>
              </div>
            </main>
          </div>
        </header>
      </div>
      </div>
    );
  }
}

export default App;
