package org.example.contactapi.service;

import org.example.contactapi.dto.ContactRequest;
import org.example.contactapi.dto.ContactResponse;

import java.util.List;

public interface ContactService {
    ContactResponse createContact(ContactRequest request);
    List<ContactResponse> getAllContacts();
    List<ContactResponse> getBlockedContacts();
    ContactResponse getContactById(Long id);
    ContactResponse updateContact(Long id, ContactRequest request);
    ContactResponse toggleBlock(Long id);
    void deleteContact(Long id);
}

