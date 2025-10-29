package org.example.contactapi.controller;

import lombok.RequiredArgsConstructor;
import org.example.contactapi.dto.ContactRequest;
import org.example.contactapi.dto.ContactResponse;
import org.example.contactapi.service.ContactService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
@Validated
public class ContactController {

    private final ContactService service;

    @PostMapping
    public ResponseEntity<ContactResponse> create(@Valid @RequestBody ContactRequest request) {
        ContactResponse response = service.createContact(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAll() {
        return ResponseEntity.ok(service.getAllContacts());
    }

    @GetMapping("/blocked")
    public ResponseEntity<List<ContactResponse>> getBlocked() {
        return ResponseEntity.ok(service.getBlockedContacts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getContactById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> update(@PathVariable Long id, @Valid @RequestBody ContactRequest request) {
        return ResponseEntity.ok(service.updateContact(id, request));
    }

    @PatchMapping("/{id}/toggle-block")
    public ResponseEntity<ContactResponse> toggleBlock(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleBlock(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}

