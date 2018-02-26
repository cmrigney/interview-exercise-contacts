import React, { ReactEventHandler } from 'react';
import "jest";
import { shallow, mount, render, ReactWrapper, configure as EnzymeConfigure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as sinon from "sinon";
import ContactService from '../src/services/contact-service';
import LoggingService from "../src/services/logging-service";
import { Contact } from '../src/models/contact';
import Contacts from '../src/contacts';
import ContactCreateModal from '../src/contact-create-modal';
import { Message } from 'semantic-ui-react';

EnzymeConfigure({ adapter: new Adapter() });

describe('<ContactCreateModal />', () => {
  let stubs = [];

  afterEach(() => {
    stubs.forEach((s) => s.restore());
  });

  test('Good text input creates contact', (done) => {
    const createContactStub = sinon.stub(ContactService, 'createContact').returns(Promise.resolve());
    stubs.push(createContactStub);

    const closeSpy = sinon.spy();
    const contactAddedSpy = sinon.spy();
    const wrapper = mount(<ContactCreateModal onClose={closeSpy} onContactAdded={contactAddedSpy} open={true} />);
    
    const elm = document.querySelector(`form`);
    expect(elm).toBeTruthy();

    // Required for dialog to render
    wrapper.update();
    const instance = (wrapper.instance() as ContactCreateModal);
    instance.fullNameChanged({target: {value: 'Cody Rigney'}} as React.ChangeEvent<HTMLInputElement>);
    instance.phoneNumberChanged({target: {value: '(330)-555-1234'}} as React.ChangeEvent<HTMLInputElement>);
    instance.contextChanged({target: {value: 'work'}} as React.ChangeEvent<HTMLInputElement>);
    instance.create(); // form submit calls create

    // defer to allow create contact to be called
    setTimeout(() => {
      wrapper.update();
      expect(createContactStub.calledOnce).toBeTruthy();
      expect(closeSpy.calledOnce).toBeTruthy();
      expect(contactAddedSpy.calledOnce).toBeTruthy();
      wrapper.unmount();
      done();
    });
  });
  
  test('Missing text input fails to save and shows error', (done) => {
    const createContactStub = sinon.stub(ContactService, 'createContact').returns(Promise.resolve());
    stubs.push(createContactStub);

    const closeSpy = sinon.spy();
    const contactAddedSpy = sinon.spy();
    const wrapper = mount(<ContactCreateModal onClose={closeSpy} onContactAdded={contactAddedSpy} open={true} />);
    
    const elm = document.querySelector(`form`).parentElement;
    expect(elm).toBeTruthy();

    // Required for dialog to render
    wrapper.update();
    const instance = (wrapper.instance() as ContactCreateModal);
    instance.fullNameChanged({target: {value: 'Cody Rigney'}} as React.ChangeEvent<HTMLInputElement>);
    instance.phoneNumberChanged({target: {value: '(330)-555-1234'}} as React.ChangeEvent<HTMLInputElement>);
    // Don't add context
    instance.create(); // form submit calls create

    // defer to allow create contact to be called
    setTimeout(() => {
      wrapper.update();
      expect(createContactStub.notCalled).toBeTruthy();
      expect(closeSpy.notCalled).toBeTruthy();
      expect(contactAddedSpy.notCalled).toBeTruthy();
      expect(elm.innerHTML).toMatch('fill out'); // Error message
      wrapper.unmount();
      done();
    });
  });
});