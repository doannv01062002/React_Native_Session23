package org.example.contactapi.dto;

import lombok.*;
import org.example.contactapi.model.Tag;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactResponse {
    private Long id;
    private String name;
    private String phone;
    private Tag tag;
    private Boolean isBlocked;
}

