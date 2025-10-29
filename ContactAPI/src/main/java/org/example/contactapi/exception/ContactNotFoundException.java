package org.example.contactapi.exception;

public class ContactNotFoundException extends RuntimeException {
    public ContactNotFoundException(Long id) {
        super("Contact not found with id: " + id);
    }
}

