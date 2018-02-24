import * as React from 'react';
import { Container, Header, Button, Segment } from 'semantic-ui-react';
import Contacts from './contacts';
import './sass/app.scss';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Container text>
          <Header as="h1">Contact Manager</Header>
          <Segment>
            <Contacts/>
          </Segment>
        </Container> 
      </div>
    );
  }
}

export default App;
