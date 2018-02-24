import * as React from 'react';
import { Button, Table, Grid, Header, Icon, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';
import { Contact } from './models/contact';
import * as ContactService from './services/contact-service';
import * as LoggingService from "./services/logging-service";
import ContactCreateModal from './contact-create-modal';

interface ContactsState {
  contacts?: Array<Contact>;
  loading: boolean;
  error?: string;
  createModalOpen: boolean;
}

export default class Contacts extends React.Component<{}, ContactsState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      loading: true,
      createModalOpen: false
    };

    this.fetchContactData();
  }

  fetchContactData = async () => {
    try {
      const contacts = await ContactService.fetchContacts();
      this.setState({
        loading: false,
        contacts: contacts 
      });
    }
    catch(err) {
      this.setState({
        loading: false,
        error: 'An error occured retreiving the contacts. Please refresh the page and try again.'
      });
      LoggingService.logError(err);
    }
  }

  render() {
    const dimmerOpts = (this.state.loading ? { active: true } : {});

    return (
      <div>
        <ContactCreateModal open={this.state.createModalOpen} onContactAdded={() => this.fetchContactData()} onClose={() => this.setState({ createModalOpen: false })} />
        <Grid>
          <Grid.Row>
            <Grid.Column floated="left" width={5} verticalAlign="middle">
              <Header as="h2">Contacts</Header>
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Button primary floated="right" icon labelPosition="left" onClick={() => this.setState({ createModalOpen: true })}><Icon name='plus' /> New Contact</Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Dimmer inverted {...dimmerOpts}>
                <Loader>Loading</Loader>
              </Dimmer>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Phone Number</Table.HeaderCell>
                    <Table.HeaderCell>Context</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {(this.state.contacts || []).map((contact) =>
                    <Table.Row key={contact.name}>
                      <Table.Cell>{contact.name}</Table.Cell>
                      <Table.Cell>{contact.number}</Table.Cell>
                      <Table.Cell>{contact.context}</Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
