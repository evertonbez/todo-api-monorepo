package com.evertonbez.todo_app.controller;

import com.evertonbez.todo_app.dtos.ReorderRequest;
import com.evertonbez.todo_app.entities.Todo;
import com.evertonbez.todo_app.services.TodoServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
public class TodoController {

    @Autowired
    private TodoServices service;

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

    @GetMapping
    public List<Todo> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Todo> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Todo create(@RequestBody Todo todo) {
        return service.save(todo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> update(@PathVariable Long id, @RequestBody Todo updatedTodo) {
        return service.findById(id)
                .map(todo -> {
                    todo.setName(updatedTodo.getName());
                    todo.setPrice(updatedTodo.getPrice());
                    todo.setLimitDate(updatedTodo.getLimitDate());
                    todo.setReOrder(updatedTodo.getReOrder());
                    service.save(todo);
                    return ResponseEntity.ok(todo);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reOrder(@RequestBody List<ReorderRequest> items) {
        service.reorderItems(items);
        return ResponseEntity.noContent().build();
    }
}
