import * as React from 'react';
import { Button, Table, Grid, Header, Icon, Dimmer, Loader, Menu } from 'semantic-ui-react';
import axios from 'axios';
import { Contact } from './models/contact';
import * as ContactService from './services/contact-service';
import * as LoggingService from "./services/logging-service";
import * as PhoneFormatterService from "./services/phone-formatter-service";
import ContactCreateModal from './contact-create-modal';
import './sass/contacts.scss';

const CONTACTS_PER_PAGE = 10;

interface ContactsState {
  contacts?: Array<Contact>;
  currentPage: number;
  loading: boolean;
  error?: string;
  createModalOpen: boolean;
}

export default class Contacts extends React.Component<{}, ContactsState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      loading: true,
      createModalOpen: false,
      currentPage: 1
    };

    this.fetchContactData();
  }

  fetchContactData = async () => {
    try {
      let contacts = await ContactService.fetchContacts();

      //pre-format the numbers to local format for performance reasons
      contacts = contacts.map((c): Contact => {
        return {
          name: c.name,
          context: c.context,
          number: PhoneFormatterService.standardToLocalFormat(c.number)
        };
      });

      this.setState({
        loading: false,
        contacts: contacts,
        currentPage: 1
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

  getNumberOfPages = () => {
    if(!this.state.contacts)
      return 1;
    else
      return Math.ceil(this.state.contacts.length / CONTACTS_PER_PAGE);
  }

  getPagedContacts = () => {
    if(!this.state.contacts)
      return this.state.contacts;
    
    const start = (this.state.currentPage - 1) * CONTACTS_PER_PAGE;
    const end = start + CONTACTS_PER_PAGE; // slice does bounds checking for us, so it's ok if it goes over
    return this.state.contacts.slice(start, end);
  }

  render() {
    return (
      <div>
        <ContactCreateModal open={this.state.createModalOpen} onContactAdded={() => this.fetchContactData()} onClose={() => this.setState({ createModalOpen: false })} />
        <Grid>
          <Grid.Row>
            <Grid.Column floated="left" width={5} verticalAlign="middle">
              <Header as="h2" className="contact-header">Contacts</Header>
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Button primary floated="right" icon labelPosition="left" onClick={() => this.setState({ createModalOpen: true })}><Icon name='plus' /> New Contact</Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="contacts-row">
            <Grid.Column>
              <Dimmer inverted active={this.state.loading}>
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
                  {(this.getPagedContacts() || []).map((contact) =>
                    <Table.Row key={contact.name}>
                      <Table.Cell>{contact.name}</Table.Cell>
                      <Table.Cell>{contact.number}</Table.Cell>
                      <Table.Cell>{contact.context}</Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
                  <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan='3'>
                      <Menu floated='right' pagination>
                        <Menu.Item as='a' icon disabled={this.state.currentPage == 1} onClick={() => this.setState({ currentPage: this.state.currentPage - 1 })}>
                          <Icon name='chevron left' />
                        </Menu.Item>
                        {Array.from(Array(this.getNumberOfPages()).keys(), (k) => k + 1).map((n) => 
                          // Array.from(Array(...).keys()) maps 1...N
                          <Menu.Item key={n} as='a' active={this.state.currentPage == n} onClick={() => this.setState({ currentPage: n })}>{n}</Menu.Item>
                        )}
                        <Menu.Item as='a' icon disabled={this.state.currentPage == Math.ceil((this.state.contacts || []).length / CONTACTS_PER_PAGE)} onClick={() => this.setState({ currentPage: this.state.currentPage + 1 })}>
                          <Icon name='chevron right' />
                        </Menu.Item>
                      </Menu>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
