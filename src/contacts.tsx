import * as React from 'react';
import { Button, Table, Grid, Header, Icon } from 'semantic-ui-react';
import './sass/contacts.scss';

export default class Contacts extends React.Component<{}, any> {
  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column floated="left" width={5}>
              <Header as="h2" className="contact-header">Contacts</Header>
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Button primary floated="right" icon labelPosition="left"><Icon name='plus' /> New Contact</Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Phone Number</Table.HeaderCell>
                    <Table.HeaderCell>Context</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
