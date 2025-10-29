package org.example.contactapi.repository;

import org.example.contactapi.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    boolean existsByPhone(String phone);
    List<Contact> findByIsBlockedTrue();
}

