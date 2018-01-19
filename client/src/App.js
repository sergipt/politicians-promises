import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
// import axios from 'axios';
import logo from './logo.svg'
import serverHost from './serverHost.js'
import './App.css'
import { addLists, addPromises, addMyVotes, setUser } from './actions'
// import { Link } from 'react-router-dom'
import Lists from './containers/Lists'
import PromisesList from './containers/PromisesList'
// import AddLidt from './containers/AddList';
import FacebookLogin from 'react-facebook-login';

import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Container, Image, List, Menu, Segment, Input, Modal, Button, Icon, Dropdown } from 'semantic-ui-react'
// import FontAwesome from 'react-fontawesome';
import TiSocialFacebook from 'react-icons/lib/ti/social-facebook';
// import TiSocialGoogle from 'react-icons/lib/ti/social-google-plus';



class App extends Component {
  state = {
    activeItem: 'home',
    loading: false,
    error: null,
    loginModalOpen: false,
    user: null,
  }

  constructor (props) {
    super(props);
    this.login();
    this.showAllLists();
  }

  // authGoogle = (response) => {
  //   console.log(response);
  //   this.login(response);
  // }

  authFacebook = async (response) => {
    console.log('authFacebook', response);
    fetch(`${serverHost}/auth/facebook`, {
      method: 'POST',
      mode: 'CORS',
      body: JSON.stringify(response),
      headers: {
          'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log('authFacebook response', data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      this.login();
    })
    .then(() => {
      this.handleLoginModalClose();
    })
    .catch(err => err);
  }

  login = async () => {
    fetch(`${serverHost}/login`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      }
    })
    .then(res => res.json())
    .then(data => {
      this.props.setUser(data);
      console.log('user login', this.props.user);
      this.getMyVotes();
    })
    .catch(err => err);
  }

  handleLogout  = () => {
    this.props.setUser({});
    localStorage.removeItem('accessToken');
    console.log('user logout', this.props.user);
  }

  handleGoogleLoginClick = (response) => {
  }

  handleFacebookLoginClick = async (response) => {
  }

  handleMenuItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    console.log(name);
    switch (name) {
      case 'home':
        this.props.history.push('/');
        break;
      default:
        break;
    }
  }

  handleLoginModalOpen = () => {
    this.props.history.push('/login');
    this.setState({ loginModalOpen: true });
  }

  handleLoginModalClose = () => {
    this.props.history.goBack();
    if ( this.props.history.location === '/login') this.props.history.push('/');
    this.setState({ loginModalOpen: false });
    console.log('handleLoginModalClose');
  }

  createList = (data) => {
    fetch(`${serverHost}/lists`, {
      method: 'POST',
      mode: 'CORS',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      }
    })
    .then(res => res)
    .then(() => this.showAllLists())
    .catch(err => err);
  }

  deleteList = (data) => {
    fetch(`${serverHost}/list/:id/delete`, {
      method: 'POST',
      mode: 'CORS',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      }
    })
    .then(res => res)
    .then(() => this.showAllLists())
    .catch(err => err);
  }

  createPromise = (data) => {
    fetch(`${serverHost}/list/:id/promise`, {
      method: 'POST',
      mode: 'CORS',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      }
    })
    .then(res => res)
    .then(() => this.showAllLists())
    .catch(err => err);
  }

  deletePromise = (data) => {
    fetch(`${serverHost}/promis/:id/delete`, {
      method: 'POST',
      mode: 'CORS',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      }
    })
    .then(res => res)
    .then(() => this.showAllLists())
    .catch(err => err);
  }

  showAllLists = () => {
    fetch(`${serverHost}/lists`)
    .then(response => response.json())
    .then(data => {
      this.props.addLists(data)
    })
  }

  getMyVotes = () => {
    fetch(`${serverHost}/votes`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('getMyVotes', data);
      this.props.addMyVotes(data)
    })
  }

  // showList = () => {
  //   fetch(`${serverHost}/lists/:id`)
  //   .then(response => response.json())
  //   .then(data => {
  //     this.props.addPromises(data)
  //   })
  // }

  showPromise = () => {
    fetch(`${serverHost}/promise/:id`)
    .then(response => response.json())
    .then(data => {
      this.props.showPromise(data)
    })
  }

  renderLoginMenuItem() {
    if (this.props.user._id) {
      return (
        <div className="logout">
          <Menu.Item >
            <Image
              size='mini'
              src={this.props.user.profile_picture}
            />
            <Dropdown simple item text={this.props.user.name}>
              <Dropdown.Menu>
                <Dropdown.Item name={'logout'} onClick={this.handleLogout} >Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </div>
      )
    } else {
      return (
        <div className="login">
          <Menu.Item name='login' onClick={this.handleLoginModalOpen} />
        </div>
      )
    }
  }

  render() {
    const { activeItem } = this.state.activeItem;
    return (
      <div className="App">
        <Menu fixed='top'>
          <Container>
            <Menu.Item header as='a' name='home' active={activeItem === 'home'} onClick={this.handleMenuItemClick}>
              <Image
                size='mini'
                src={logo}
              />
              Politicians Promises
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item>
                <Input icon='search' placeholder='Search...' />
              </Menu.Item>
              {this.renderLoginMenuItem()}
              <Modal 
                className='login-modal'
                size='mini'
                open={this.state.loginModalOpen}
                onClose={this.handleLoginModalClose}
                >
                <Modal.Header>Login</Modal.Header>
                <Modal.Content>
                  <Button
                    className='google-login-button social-login-button'
                    color='google plus'
                    onClick={this.handleGoogleLoginClick}>
                    <Icon name='google' />
                    Login with Google
                  </Button>
                  <FacebookLogin
                    cssClass='facebook-login-button social-login-button'
                    appId="166886444041133"
                    autoLoad={false}
                    fields="name,email,picture"
                    onClick={this.componentClicked}
                    callback={this.authFacebook} 
                    icon={<TiSocialFacebook />} />
                </Modal.Content>
              </Modal>
            </Menu.Menu>
          </Container>
        </Menu>
        <Container text className="main">
          <Switch>
            <Route exact={true} path="/" component={Lists} />
            <Route path="/lists/:id" component={PromisesList} />
          </Switch>
        </Container>
        <Segment
          inverted
          vertical
          className="footer"
        >
          <Container textAlign='center'>
            <Image
              centered
              size='mini'
              src={logo}
            />
            <List horizontal inverted divided link>
              <List.Item as='a' href='#'>Site Map</List.Item>
              <List.Item as='a' href='#'>Contact Us</List.Item>
              <List.Item as='a' href='#'>Terms and Conditions</List.Item>
              <List.Item as='a' href='#'>Privacy Policy</List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  addLists: (lists) => dispatch(addLists(lists)),
  addPromises: (promises) => dispatch(addPromises(promises)),
  addMyVotes: (votes) => dispatch(addMyVotes(votes)),
  setUser: (user) => dispatch(setUser(user)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
