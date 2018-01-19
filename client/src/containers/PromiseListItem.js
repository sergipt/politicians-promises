import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import '../App.css';
import { addMyVotes } from '../actions'
import serverHost from '../serverHost.js'
import DonutChart from "react-svg-donut-chart"
import PieChart from "react-svg-piechart"
import { Card, Button, Icon } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
// import VoteButton from './VoteButton';

class PromiseListItem extends React.Component {
  state = {
  }

  voteButtonClick = async (e, { name }) => {
    let vote_value = null;
    Object.keys(this.props.votes).find( key => {
      if (this.props.votes[key].user_id === this.props.user._id) {
        vote_value = this.props.votes[key].value.value;
      }
    })
    console.log('current vote value', vote_value);
    console.log('voteButtonClick', name);
    if (vote_value === name) await this.votePromise({value: name}, true);
    else if (vote_value === null) await this.votePromise({value: name}, false);
  }

  votePromise = async (data, unvote) => {
    let path = unvote ? 'unvote' : 'vote';
    console.log('votePromise', data, 'unvote', unvote);
    fetch(`${serverHost}/promise/${this.props.promise._id}/${path}`, {
      method: 'POST',
      mode: 'CORS',
      body: JSON.stringify({value: data}),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      }
    })
    .then(res => res)
    .then( () =>  {
      let value  = unvote ? -1 : 1;
      if ( data.value === 'yes' ) this.props.promise.votes_yes = this.props.promise.votes_yes + value;
      else if ( data.value === 'no' ) this.props.promise.votes_no = this.props.promise.votes_no + value;
      else if ( data.value === 'idk' ) this.props.promise.votes_idk = this.props.promise.votes_idk + value;
    })
    .then(() => this.getMyVotes())
    .catch(err => err);
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
      this.props.addMyVotes(data);
    })
  }

  onSectorHover = (d, i, e) => {
    if (d) {
      console.log("Mouse enter - Index:", i, "Data:", d, "Event:", e)
    } else {
      console.log("Mouse leave - Index:", i, "Event:", e)
    }
  }

  renderButtons() {
    let btnDisable = true;
    let yesIconColor = 'green';
    let idkIconColor = 'yellow';
    let noIconColor = 'red';
    let yesButtonColor = null;
    let idkButtonColor = null;
    let noButtonColor = null;
    let vote_value = null;
    if (this.props.user._id) {
      Object.keys(this.props.votes).find( key => {
        if (this.props.votes[key].promise_id === this.props.promise._id) {
          vote_value = this.props.votes[key].value.value;
        }
      })
      btnDisable = false;
      console.log('current vote', vote_value);
      if (vote_value === 'yes') {yesButtonColor = 'green'; yesIconColor = 'black';}
      else if (vote_value === 'idk') {idkButtonColor = 'yellow'; idkIconColor = 'black';}
      else if (vote_value === 'no') {noButtonColor = 'red'; noIconColor = 'black';}
    }
    return (
      <div className="buttons">
        <Button icon name='yes' disabled={btnDisable} onClick={this.voteButtonClick} color={yesButtonColor}>
          <Icon name='checkmark' color={yesIconColor}/>
        </Button>
        <Button icon name='idk' disabled={btnDisable} onClick={this.voteButtonClick} color={idkButtonColor}>
          <Icon name='radio' color={idkIconColor}/>
        </Button>
        <Button icon  name='no' disabled={btnDisable} onClick={this.voteButtonClick} color={noButtonColor}>
          <Icon name='remove' color={noIconColor}/>
        </Button>
      </div>
    )
  }

  render () {
    console.log('render');
    console.log(this.props.promise.votes_yes, this.props.promise.votes_idk, this.props.promise.votes_no);
    let donutData = [
      {value: this.props.promise.votes_yes, stroke: "#a8ca81", title: "Yes"},
      {value: this.props.promise.votes_idk, stroke: "#fbbd08", title: "I don't know"},
      {value: this.props.promise.votes_no, stroke: "#db2828", title: "No"},
    ];
    return (
       <div className="promise-list-item">
         <Card>
          <Card.Content>
            <DonutChart data={donutData} spacing="0"/>
            <Card.Header>
              {this.props.promise.text}
            </Card.Header>
            <Card.Description>
              {this.props.promise.date}
            </Card.Description>
            {this.renderButtons()}
          </Card.Content>
         </Card>
     </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  votes: state.votes,
});

const mapDispatchToProps = (dispatch) => ({
  addMyVotes: (votes) => dispatch(addMyVotes(votes)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PromiseListItem));