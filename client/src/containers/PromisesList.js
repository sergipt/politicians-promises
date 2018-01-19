import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import serverHost from '../serverHost.js';
import PromiseListItem from './PromiseListItem';
import AddPromise from './AddPromise';
import '../App.css';
import { addPromises } from '../actions';

class PromisesList extends React.Component {
  state = {
    list:{},
  }

  constructor (props) {
    super(props);
    this.showListDetails();
    this.showListPromises();
  }

   showListDetails = () => {
    fetch(`${serverHost}/list/${this.props.match.params.id}`)
    .then(response => response.json())
    .then(data => {
      this.setState({ list: data });
    })
  }

  showListPromises = () => {
    fetch(`${serverHost}/list/${this.props.match.params.id}/promises`)
    .then(response => response.json())
    .then(data => {
      this.props.addPromises(data)
    })
  }

  renderAddPromise () {
    if (this.props.user._id) {
      return (
        <AddPromise list={this.props.match.params.id}/>
      )
    }
  }

  renderPromises () {
    return Object.keys(this.props.promises).map((id, i) => {
      return (
        <PromiseListItem key={i} id={i} promise={this.props.promises[id]}/>
      )
    })
  }

  render () {
    return (
      <div className="promises-list">
        <h1>{this.state.list.politician}</h1>
        <p>{this.state.list.position}</p>
        {this.renderAddPromise()}
        {this.renderPromises()}
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  promises: state.promises,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  addPromises: (promises) => dispatch(addPromises(promises)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PromisesList));