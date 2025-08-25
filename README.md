# Todo API - Aplicação Full Stack

Este projeto é uma aplicação completa de Todo List com:

- **Backend**: Spring Boot (Java 21) com PostgreSQL
- **Frontend**: Angular 20 com TailwindCSS
- **Containerização**: Docker e Docker Compose

## Estrutura do Projeto

```
todo-api/
├── todo-backend/          # API Spring Boot
├── todo-frontend/         # Aplicação Angular
└── docker-compose.yml     # Orquestração dos containers
```

## Pré-requisitos

- Docker
- Docker Compose

## Como Executar com Docker

### 1. Executar toda a aplicação

```bash
# Clonar o repositório (se necessário)
git clone <seu-repositorio>
cd todo-api

# Construir e executar todos os serviços
docker-compose up --build

# Ou executar em background
docker-compose up --build -d
```

### 2. Acessar a aplicação

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Banco PostgreSQL**: localhost:5432

### 3. Gerenciar os containers

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (limpar dados do banco)
docker-compose down -v

# Ver logs de um serviço específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Reconstruir apenas um serviço
docker-compose up --build backend
```

## Serviços

### PostgreSQL

- **Container**: `postgres-dev`
- **Porta**: 5432
- **Banco**: `todo`
- **Usuário**: `postgres`
- **Senha**: `123456`

### Backend (Spring Boot)

- **Container**: `todo-backend`
- **Porta**: 8080
- **Perfil**: `docker`
- **Dependências**: PostgreSQL

### Frontend (Angular + Nginx)

- **Container**: `todo-frontend`
- **Porta**: 80
- **Dependências**: Backend

## Desenvolvimento

### Executar apenas o banco de dados

```bash
# Executar apenas PostgreSQL
docker-compose up postgres
```

### Executar backend localmente

```bash
cd todo-backend
./mvnw spring-boot:run
```

### Executar frontend localmente

```bash
cd todo-frontend
npm install
npm start
```

## Comandos Úteis

```bash
# Limpar containers, redes e volumes não utilizados
docker system prune -a

# Ver status dos containers
docker-compose ps

# Executar comando dentro de um container
docker-compose exec backend bash
docker-compose exec frontend sh

# Ver logs em tempo real
docker-compose logs -f
```

## Solução de Problemas

### Porta já em uso

Se alguma porta estiver em uso, você pode alterar no `docker-compose.yml`:

```yaml
ports:
  - "8081:8080" # Backend na porta 8081
  - "8080:80" # Frontend na porta 8080
```

### Problemas de permissão

```bash
# Dar permissão ao Maven wrapper (Linux/Mac)
chmod +x todo-backend/mvnw
```

### Rebuild completo

```bash
# Parar tudo e remover containers
docker-compose down

# Remover imagens antigas
docker-compose build --no-cache

# Executar novamente
docker-compose up
```

## Tecnologias Utilizadas

- **Backend**: Spring Boot 3.5.4, Java 21, Spring Data JPA, PostgreSQL
- **Frontend**: Angular 20, TailwindCSS, TypeScript
- **Containerização**: Docker, Docker Compose, Nginx
- **Banco de Dados**: PostgreSQL 16.4
