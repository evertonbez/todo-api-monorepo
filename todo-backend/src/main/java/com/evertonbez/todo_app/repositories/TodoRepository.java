package com.evertonbez.todo_app.repositories;

import com.evertonbez.todo_app.entities.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT MAX(t.reOrder) FROM Todo t")
    Optional<Integer> findMaxReOrder();
}
