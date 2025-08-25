package com.evertonbez.todo_app.services;

import com.evertonbez.todo_app.dtos.ReorderRequest;
import com.evertonbez.todo_app.entities.Todo;
import com.evertonbez.todo_app.repositories.TodoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TodoServices {
    private final TodoRepository repository;

    public List<Todo> findAll() {
        return repository.findAll();
    }

    public Optional<Todo> findById(Long id) {
        return repository.findById(id);
    }

    public Todo save(Todo todo) {
        if (todo.getReOrder() == null) {
            todo.setReOrder(getNextOrderIndex());
        }
        return repository.save(todo);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    private Integer getNextOrderIndex() {
        return repository.findMaxReOrder()
                .map(maxOrder -> maxOrder + 1)
                .orElse(1);
    }

    @Transactional
    public void reorderItems(List<ReorderRequest> items) {
        for (ReorderRequest req : items) {
            Todo todo = repository.findById(req.getId())
                    .orElseThrow(() -> new RuntimeException("Item não encontrado: " + req.getId()));
            todo.setReOrder(req.getOrderIndex());
            repository.save(todo);
        }
    }
}
