package com.evertonbez.todo_app.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReorderRequest {
    private Long id;
    private Integer orderIndex;
}
