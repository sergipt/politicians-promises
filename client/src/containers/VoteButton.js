import React from 'react';
import '../App.css';
import serverHost from '../serverHost.js'
import { Button, Icon } from 'semantic-ui-react';

class VoteButton extends Button {
  state = {
    'yesButtonColor':  'grey',
    'noButtonColor':  'grey',
  }

  constructor (props) {
    super(props);
    this.setButtonsColor();
  }

  setButtonsColor = () => {
    console.log('setButtonsColor');
    if (this.props.promise.vote === 'true') this.yesButtonColor = 'green';
    else if (this.props.promise.vote === 'false') this.yesButtonColor = 'red';
  }

  voteButtonClick = async (e, { name }) => {
    console.log('voteButtonClick');
    if (this.props.promise.vote != null) {
      await this.votePromise(name);
      this.setButtonsColor();
    }
  }

  votePromise = async (data) => {
    fetch(`${serverHost}/promise/:id/vote`, {
      method: 'POST',
      mode: 'CORS',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      }
    })
    .then(res => res)
    .catch(err => err);
  }

  render () {
    return (
       <div className="">
        <Icon name='thumbs outline up' color={this.yesButtonColor}/>
     </div>
    )
  }
}


export default VoteButton;