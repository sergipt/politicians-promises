import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { Card, Input, Button } from 'semantic-ui-react'

class AddPromise extends React.Component {
  state = {
  }

  constructor (props) {
    super(props)
    this.state = {
      startDate: moment()
    };
  }

  handDateleSelect = () => {

  }

  handleDateChange = (date) => {
    this.setState({
      startDate: date
    });
  }

  handleAddPromise = () => {
   
  }

  render () {
    return (
      <div className="add-promise">
        <Card>
          <Card.Content>
            <Input placeholder='Add a promise' />
            <DatePicker selected={this.state.date}
              onSelect={this.handDateleSelect}
              onChange={this.handleDateChange}
            />
            <Button name='add-romise-btn' onClick={this.handleAddPromise}>Add</Button>
          </Card.Content>
        </Card>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});


export default connect(mapStateToProps, mapDispatchToProps)(AddPromise);