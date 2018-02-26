import axios from 'axios';
import { Contact } from '../models/contact';

/**
 * Provides services for managing contacts
 * 
 * @class ContactService
 */
class ContactService {

  /**
   * Gets contacts from the server and maps and sorts those contacts
   * 
   * @returns {Promise<Array<Contact>>} 
   * @memberof ContactService
   */
  async fetchContacts(): Promise<Array<Contact>> {
    const result = await axios.get<Array<Contact>>('/contacts/');
    if(result.status !== 200) {
      throw new Error(`Bad Status: ${result.status}`);
    }
    return result.data.sort((a, b) => a.name > b.name ? 1 : -1);
  }
  
  /**
   * Sends a request to the server to create a contact
   * 
   * @param {Contact} contact 
   * @returns {Promise<void>} 
   * @memberof ContactService
   */
  async createContact(contact: Contact): Promise<void> {
    const result = await axios.post('/contacts/', contact);
    if(result.status !== 200 && result.status !== 201) {
      throw new Error(`Bad Status: ${result.status}`);
    }
  }
}

export default new ContactService();


