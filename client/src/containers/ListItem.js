import React from 'react';
import '../App.css';
import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class ListItem extends React.Component {
  state = {}

  render () {
    return (
      <div className="list-item">
        <Link to={`/lists/${this.props.list._id}`}>
          <Card>
            <Card.Content>
              <Card.Header>
                {this.props.list.politician}
              </Card.Header>
              <Card.Description>
                {this.props.list.position} ({this.props.list.party})
              </Card.Description>
            </Card.Content>
          </Card>
        </Link>
      </div>
    )
  }
}


export default ListItem;