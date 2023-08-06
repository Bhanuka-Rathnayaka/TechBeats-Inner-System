package com.bitproject.techbeats.login.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data//create setters and getters
@AllArgsConstructor
@NoArgsConstructor
public class LoggeUser {
    private String username;
    private String role;
    private String photopath;
    private String photoname;
}
