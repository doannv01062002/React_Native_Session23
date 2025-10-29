package org.example.contactapi.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.contactapi.dto.ContactRequest;
import org.example.contactapi.dto.ContactResponse;
import org.example.contactapi.exception.ContactNotFoundException;
import org.example.contactapi.model.Contact;
import org.example.contactapi.repository.ContactRepository;
import org.example.contactapi.service.ContactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository repository;

    private ContactResponse toResponse(Contact contact) {
        return ContactResponse.builder()
                .id(contact.getId())
                .name(contact.getName())
                .phone(contact.getPhone())
                .tag(contact.getTag())
                .isBlocked(contact.getIsBlocked())
                .build();
    }

    @Override
    public ContactResponse createContact(ContactRequest request) {
        // uniqueness constraint is enforced at DB level; optionally check here
        if (repository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone already exists");
        }
        Contact c = Contact.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .tag(request.getTag())
                .isBlocked(false)
                .build();
        Contact saved = repository.save(c);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponse> getAllContacts() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponse> getBlockedContacts() {
        return repository.findByIsBlockedTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ContactResponse getContactById(Long id) {
        return repository.findById(id).map(this::toResponse).orElseThrow(() -> new ContactNotFoundException(id));
    }

    @Override
    public ContactResponse updateContact(Long id, ContactRequest request) {
        Contact contact = repository.findById(id).orElseThrow(() -> new ContactNotFoundException(id));
        // if phone changed, check uniqueness
        if (!contact.getPhone().equals(request.getPhone()) && repository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone already exists");
        }
        contact.setName(request.getName());
        contact.setPhone(request.getPhone());
        contact.setTag(request.getTag());
        Contact updated = repository.save(contact);
        return toResponse(updated);
    }

    @Override
    public ContactResponse toggleBlock(Long id) {
        Contact contact = repository.findById(id).orElseThrow(() -> new ContactNotFoundException(id));
        contact.setIsBlocked(!Boolean.TRUE.equals(contact.getIsBlocked()));
        Contact updated = repository.save(contact);
        return toResponse(updated);
    }

    @Override
    public void deleteContact(Long id) {
        if (!repository.existsById(id)) {
            throw new ContactNotFoundException(id);
        }
        repository.deleteById(id);
    }
}

