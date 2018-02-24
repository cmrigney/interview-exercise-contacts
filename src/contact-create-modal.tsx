import * as React from 'react';
import { Contact } from './models/contact';
import { Button, Modal, Container, Icon, Form } from 'semantic-ui-react';
import './sass/contact-create-modal.scss';

export interface ContactCreateModalProps {
  onContactAdded?: (contact: Contact) => void;
  onClose: () => void;
  open: boolean;
}

export interface ContactCreateModelState {
  contact: Contact;
}

export default class ContactCreateModal extends React.Component<ContactCreateModalProps, ContactCreateModelState> {
  constructor(props: ContactCreateModalProps) {
    super(props);

    this.state = {
      contact: { name: '', number: '', context: '' }
    }
  }

  resetState = () => {
    this.setState({
      contact: { name: '', number: '', context: '' }
    });
  }

  create = async () => {
  }

  render() {
    return (
      <Modal size={"tiny"} open={this.props.open} onOpen={this.resetState} className="center-modal">
        <Modal.Header>Create A New Contact</Modal.Header>
        <Modal.Content>
          <Form onSubmit={() => this.create()} error act>
            <Form.Field>
              <label>Full Name</label>
              <input placeholder='Full Name' autoFocus />
            </Form.Field>
            <Form.Field>
              <label>Phone Number</label>
              <input placeholder='Phone Number' />
            </Form.Field>
            <Form.Field>
              <label>Context</label>
              <input placeholder='Context' />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => this.props.onClose()}><Icon name="cancel" /> Cancel</Button>
          <Button color="green" onClick={() => this.create()}><Icon name="checkmark" /> Create</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
