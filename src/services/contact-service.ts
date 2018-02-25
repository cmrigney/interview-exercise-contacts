import axios from 'axios';
import { Contact } from '../models/contact';


export async function fetchContacts(): Promise<Array<Contact>> {
  const result = await axios.get<Array<Contact>>('/contacts/');
  if(result.status !== 200) {
    throw new Error(`Bad Status: ${result.status}`);
  }
  return result.data.sort((a, b) => a.name > b.name ? 1 : -1);
}

export async function createContact(contact: Contact): Promise<void> {
  const result = await axios.post('/contacts/', contact);
  if(result.status !== 200 && result.status !== 201) {
    throw new Error(`Bad Status: ${result.status}`);
  }
}
