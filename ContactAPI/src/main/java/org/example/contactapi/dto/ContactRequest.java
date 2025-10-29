package org.example.contactapi.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import org.example.contactapi.model.Tag;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must be at most 255 characters")
    private String name;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Phone must be digits (7-15) and may start with +")
    private String phone;

    @NotNull(message = "Tag is required")
    private Tag tag;
}

