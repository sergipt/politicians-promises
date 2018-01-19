import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import '../App.css';
// import { addLists } from '../actions';
import ListItem from './ListItem';

class Lists extends React.Component {
  state = {}

  renderLists () {
  console.log('lists',this.props.lists);
    // return this.props.order.map((id, i) => {
    return Object.keys(this.props.lists).map((id, i) => {
      return (
        <ListItem key={i} id={i} list={this.props.lists[id] }/>
      )
    })
  }

  render () {
    return (
      <div className="lists">
        {this.renderLists()}
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  lists: state.lists,
});

const mapDispatchToProps = (dispatch) => ({
  // addLists: (lists) => dispatch(addLists(lists)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lists));