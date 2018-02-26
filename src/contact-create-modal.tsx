import * as React from 'react';
import { Contact } from './models/contact';
import ContactService from "./services/contact-service";
import PhoneFormatterService from "./services/phone-formatter-service";
import { Button, Modal, Container, Icon, Form, Message, Dimmer, Loader } from 'semantic-ui-react';
import MaskedInput from "react-maskedinput";
import './sass/contact-create-modal.scss';

export interface ContactCreateModalProps {
  onContactAdded?: (contact: Contact) => void;
  onClose: () => void;
  open: boolean;
}

export interface ContactCreateModelState {
  contact: Contact;
  fullNameValid: boolean;
  phoneNumberValid: boolean;
  contextValid: boolean;
  loading?: boolean;
  error?: string;
}

export default class ContactCreateModal extends React.Component<ContactCreateModalProps, ContactCreateModelState> {
  
  constructor(props: ContactCreateModalProps) {
    super(props);

    this.state = {
      contact: { name: '', number: '', context: '' },
      fullNameValid: true,
      phoneNumberValid: true,
      contextValid: true
    }
  }
  
  resetState = () => {
    this.setState({
      contact: { name: '', number: '', context: '' },
      fullNameValid: true,
      phoneNumberValid: true,
      contextValid: true,
      error: '',
      loading: false
    });
  }

  fullNameChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      contact: { ...this.state.contact, name: evt.target.value }
    });
  }
  
  phoneNumberChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      contact: { ...this.state.contact, number: evt.target.value }
    });
  }
  
  contextChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      contact: { ...this.state.contact, context: evt.target.value }
    });
  }

  validateForm = (): boolean => {
    this.setState({
      error: ''
    });

    let fullNameValid = true, phoneNumberValid = true, contextValid = true;

    if(!this.state.contact.name.trim()) {
      fullNameValid = false;
    }
    if(!this.state.contact.number.trim() ||
       !PhoneFormatterService.isValidLocalPhoneNumber(this.state.contact.number)) {
      phoneNumberValid = false;
    }
    if(!this.state.contact.context.trim()) {
      contextValid = false;
    }

    const valid = fullNameValid && phoneNumberValid && contextValid;

    this.setState({
      fullNameValid: fullNameValid,
      phoneNumberValid: phoneNumberValid,
      contextValid: contextValid
    });

    if(!valid) {
      this.setState({
        error: 'Please fill out the fields in red completely.'
      });
    }

    return valid;
  }

  create = async () => {
    if(!this.validateForm())
      return;
    
    this.setState({
      loading: true
    });

    const standardizedNumber = PhoneFormatterService.localToStandardFormat(this.state.contact.number);

    try {
      await ContactService.createContact({
        name: this.state.contact.name,
        number: standardizedNumber,
        context: this.state.contact.context
      });
      this.setState({
       loading: false
      });
      this.props.onContactAdded(this.state.contact);
      this.props.onClose();
    }
    catch(err) {
      this.setState({
        loading: false,
        error: 'Failed to create contact. Please try again.'
      });
    }
  }

  render() {
    return (
      <div>
        <Modal size={"tiny"} open={this.props.open} onMount={() => this.resetState()} className="center-modal">
          <Dimmer inverted active={this.state.loading}>
            <Loader>Creating...</Loader>
          </Dimmer>
          <Modal.Header>Create A New Contact</Modal.Header>
          <Modal.Content>
            <Form onSubmit={() => this.create()}>
              <Form.Field>
                <Form.Input label='Full Name' maxLength='32' placeholder='Full Name' autoFocus onChange={this.fullNameChanged} error={!this.state.fullNameValid} />
              </Form.Field>
              <Form.Field control={MaskedInput} label='Phone Number' mask='(111)-111-1111' onChange={this.phoneNumberChanged} error={!this.state.phoneNumberValid}>
              </Form.Field>
              <Form.Field>
                <Form.Input label='Context' maxLength='32' placeholder='Context' onChange={this.contextChanged} error={!this.state.contextValid} />
              </Form.Field>
              <input type='submit' style={{ display: 'none' }}/> {/* workaround to make ENTER work */}
            </Form>
            {this.state.error && <Message
              error
              content={this.state.error}
            />}
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={() => this.props.onClose()}><Icon name='cancel' /> Cancel</Button>
            <Button color='green' onClick={() => this.create()}><Icon name='checkmark' /> Create</Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
