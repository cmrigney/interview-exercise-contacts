import React from 'react';
import "jest";
import { shallow, mount, render, configure as EnzymeConfigure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as sinon from "sinon";
import ContactService from '../src/services/contact-service';
import LoggingService from "../src/services/logging-service";
import { Contact } from '../src/models/contact';
import Contacts from '../src/contacts';
import { Table } from 'semantic-ui-react';

EnzymeConfigure({ adapter: new Adapter() })

describe('<Contacts />', () => {
  let stubs = [];

  const fakeContacts: Array<Contact> = [
    {
      name: 'Bob',
      number: '+13304281234',
      context: 'work'
    },
    {
      name: 'Jim',
      number: '+13335551234',
      context: 'home'
    },
    {
      name: 'Matt',
      number: '+15555551234',
      context: 'home'
    },
  ]

  afterEach(() => {
    stubs.forEach((s) => s.restore());
  });

  test('Renders 3 contacts', (done) => {
    const fetchStub = sinon.stub(ContactService, 'fetchContacts').returns(Promise.resolve(fakeContacts));
    stubs.push(fetchStub);

    const wrapper = shallow(<Contacts />);
    // Let fake data fetch occur
    setTimeout(() => {
      wrapper.update(); // re-render
      expect(fetchStub.calledOnce).toBeTruthy();
      expect(wrapper.find(Table.Body).find(Table.Row)).toHaveLength(3);
      done();
    });
  });
  
  test('Fails contact fetch with user friendly error and log', (done) => {
    const fetchStub = sinon.stub(ContactService, 'fetchContacts').returns(Promise.reject(new Error('Fake error happened.')));
    stubs.push(fetchStub);
    const logSpy = sinon.spy(LoggingService, 'logError');
    stubs.push(logSpy);

    const wrapper = shallow(<Contacts />);
    // Let fake data fetch occur
    setTimeout(() => {
      wrapper.update(); // re-render
      expect(fetchStub.calledOnce).toBeTruthy();
      expect(logSpy.calledOnce).toBeTruthy();
      expect(wrapper.html()).toContain('error occured');
      done();
    });
  });
});