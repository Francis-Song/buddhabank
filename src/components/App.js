import React, {Component} from "react";
import {Navbar} from "react-bootstrap";
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
   <Navbar >
      Signed in as: {this.state.account}
  </Navbar>
      <div className="App">
        <header className="App-header">
          <h2>Buddha Bank</h2>
          <h4>Deposit Ether and Earn BuddhaToken (10% APY)</h4>
          <img src={logo} className="App-logo" alt="logo" />
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              Deposit Ether 
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      let amount = this.depositAmount.value
                      amount = amount * 10**18 
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
                  <br></br>
                    Withdraw Balance
                    <br></br>
                  <div>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                  </div>
            
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
