import axios from 'axios';
import { Contact } from '../models/contact';


export async function fetchContacts(): Promise<Array<Contact>> {
  const result = await axios.get<Array<Contact>>('/contacts');
  return result.data;
}
