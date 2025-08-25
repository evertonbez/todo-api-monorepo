package com.evertonbez.todo_app.exception;

public class NameExistsException extends RuntimeException {
    public NameExistsException(String name) {
        super("NameExists: " + name);
    }
}
