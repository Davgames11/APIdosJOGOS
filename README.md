# 🎮 GameHub API

Uma API REST para gerenciamento de catálogo de jogos com autenticação de usuários e funcionalidades administrativas.

**Versão:** 1.0.0  
**Tipo:** API REST com Express.js

---

## 📋 Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
  - [Públicos](#endpoints-públicos)
  - [Autenticação](#endpoints-de-autenticação)
  - [Perfil de Usuário](#endpoints-de-perfil)
  - [Gestão de Jogos](#endpoints-de-gestão-de-jogos)
- [Exemplos de Uso](#exemplos-de-uso)
- [Códigos de Erro](#códigos-de-erro)

---

## 🚀 Instalação

```bash
# Clonar o repositório
git clone <seu-repositorio>

# Instalar dependências
npm install

# Criar arquivo .env (veja a seção de Configuração)
cp .env.example .env
```

### Dependências

- **express**: ^4.18.2 - Framework web
- **jsonwebtoken**: ^9.0.2 - Autenticação JWT
- **bcryptjs**: ^3.0.3 - Hash de senhas
- **dotenv**: ^17.2.3 - Variáveis de ambiente

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
```

### Iniciar o servidor

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

O servidor iniciará em `http://localhost:3000`

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação.

### Fluxo de Autenticação

1. **Registre-se** ou **faça login** para obter um token
2. Adicione o token no header de requisições protegidas:
   ```
   Authorization: Bearer <seu_token_aqui>
   ```

### Tokens

- Tokens expiram em **24 horas**
- Sempre inclua o token no header `Authorization` para acessar endpoints protegidos

---

## 📡 Endpoints

### Endpoints Públicos

#### 1. **GET** `/`

Informações gerais da API

**Resposta (200 OK):**

```json
{
  "success": true,
  "message": "🎮 Bem-vindo ao GameHub API 🕹️",
  "version": "1.0.0",
  "timestamp": "2026-01-16T10:30:00.000Z"
}
```

---

#### 2. **GET** `/api/health`

Verifica o status da API

**Resposta (200 OK):**

```json
{
  "success": true,
  "status": "API está online"
}
```

---

### Endpoints de Jogos (Públicos)

#### 3. **GET** `/api/games`

Lista todos os jogos com filtros opcionais

**Parâmetros de Query:**

- `platform` (string, opcional): Filtrar por plataforma
- `category` (string, opcional): Filtrar por categoria
- `search` (string, opcional): Buscar por título
- `page` (number, opcional): Página (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 10)

**Exemplo de Requisição:**

```bash
GET /api/games?platform=PlayStation%205&category=Ação&page=1&limit=10
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "count": 5,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "id": 1,
      "titulo": "The Legend of Zelda: Breath of the Wild",
      "description": "Uma aventura épica...",
      "image-url": "https://storage.gamehub.com/images/zelda_botw.jpg",
      "platform": ["Nintendo Switch", "Wii U"],
      "categories": ["Ação", "Aventura", "Mundo Aberto"],
      "release": "2017-03-03"
    }
  ]
}
```

---

#### 4. **GET** `/api/games/:id`

Obter detalhes de um jogo específico

**Parâmetros:**

- `id` (number): ID do jogo

**Exemplo de Requisição:**

```bash
GET /api/games/1
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "titulo": "The Legend of Zelda: Breath of the Wild",
    "description": "Uma aventura épica...",
    "image-url": "https://storage.gamehub.com/images/zelda_botw.jpg",
    "platform": ["Nintendo Switch", "Wii U"],
    "categories": ["Ação", "Aventura", "Mundo Aberto"],
    "release": "2017-03-03"
  }
}
```

**Resposta (404 Not Found):**

```json
{
  "success": false,
  "message": "Jogo não encontrado"
}
```

---

#### 5. **GET** `/api/platforms`

Lista todas as plataformas disponíveis

**Exemplo de Requisição:**

```bash
GET /api/platforms
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": [
    "Nintendo Switch",
    "PC",
    "PlayStation 4",
    "PlayStation 5",
    "Wii U",
    "Xbox One",
    "Xbox Series X/S"
  ]
}
```

---

#### 6. **GET** `/api/categories`

Lista todas as categorias disponíveis

**Exemplo de Requisição:**

```bash
GET /api/categories
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": [
    "Ação",
    "Aventura",
    "Metroidvania",
    "Mundo Aberto",
    "Plataforma",
    "Roguelike",
    "RPG",
    "Sandbox",
    "Simulação",
    "Sobrevivência",
    "Terror"
  ]
}
```

---

### Endpoints de Autenticação

#### 7. **POST** `/api/register`

Registra um novo usuário

**Body (JSON):**

```json
{
  "username": "seu_usuario",
  "email": "seu_email@example.com",
  "password": "sua_senha_segura"
}
```

**Validações:**

- Username: obrigatório
- Email: obrigatório
- Password: mínimo 6 caracteres
- Username e email não podem estar duplicados

**Resposta (201 Created):**

```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "seu_usuario",
    "email": "seu_email@example.com",
    "role": "user"
  }
}
```

**Resposta (400 Bad Request):**

```json
{
  "success": false,
  "message": "A senha deve ter pelo menos 6 caracteres"
}
```

**Resposta (409 Conflict):**

```json
{
  "success": false,
  "message": "Usuário ou email já existe"
}
```

---

#### 8. **POST** `/api/login`

Faz login de um usuário existente

**Body (JSON):**

```json
{
  "username": "seu_usuario",
  "password": "sua_senha_segura"
}
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "seu_usuario",
    "email": "seu_email@example.com",
    "role": "user"
  }
}
```

**Resposta (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

---

### Endpoints de Perfil

#### 9. **GET** `/api/profile`

Obtém os dados do perfil do usuário autenticado

**Headers necessários:**

```
Authorization: Bearer <seu_token>
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "seu_usuario",
    "email": "seu_email@example.com",
    "role": "user",
    "createdAt": "2026-01-16T10:00:00.000Z"
  }
}
```

---

#### 10. **PUT** `/api/profile`

Atualiza dados do perfil do usuário

**Headers necessários:**

```
Authorization: Bearer <seu_token>
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "username": "novo_usuario",
  "email": "novo_email@example.com",
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```

**Observações:**

- Todos os campos são opcionais
- Para alterar senha, `currentPassword` é obrigatório
- A senha atual deve estar correta

**Resposta (200 OK):**

```json
{
  "success": true,
  "message": "Perfil atualizado com sucesso",
  "data": {
    "id": 1,
    "username": "novo_usuario",
    "email": "novo_email@example.com",
    "role": "user"
  }
}
```

---

### Endpoints de Gestão de Jogos (Admin)

#### 11. **POST** `/api/games`

Cria um novo jogo (apenas administradores)

**Headers necessários:**

```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "titulo": "Nome do Jogo",
  "description": "Descrição completa do jogo",
  "imageUrl": "https://exemplo.com/imagem.jpg",
  "platform": ["PlayStation 5", "PC"],
  "categories": ["Ação", "Aventura"],
  "release": "2024-01-15"
}
```

**Validações:**

- Requer role de administrador
- Todos os campos são obrigatórios
- Título não pode ser duplicado

**Resposta (201 Created):**

```json
{
  "success": true,
  "message": "Jogo criado com sucesso",
  "data": {
    "id": 26,
    "titulo": "Nome do Jogo",
    "description": "Descrição completa do jogo",
    "image-url": "https://exemplo.com/imagem.jpg",
    "platform": ["PlayStation 5", "PC"],
    "categories": ["Ação", "Aventura"],
    "release": "2024-01-15",
    "createdBy": 1,
    "createdAt": "2026-01-16T10:30:00.000Z"
  }
}
```

**Resposta (403 Forbidden):**

```json
{
  "success": false,
  "message": "Apenas administradores podem criar jogos"
}
```

---

#### 12. **PUT** `/api/games/:id`

Atualiza um jogo existente

**Headers necessários:**

```
Authorization: Bearer <token_autenticado>
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "titulo": "Nome Atualizado",
  "description": "Nova descrição",
  "imageUrl": "https://exemplo.com/nova-imagem.jpg",
  "platform": ["PlayStation 5"],
  "categories": ["RPG"],
  "release": "2024-01-15"
}
```

**Observações:**

- Todos os campos são opcionais
- Apenas campos fornecidos serão atualizados

**Resposta (200 OK):**

```json
{
  "success": true,
  "message": "Jogo atualizado com sucesso",
  "data": {
    "id": 1,
    "titulo": "Nome Atualizado",
    "description": "Nova descrição",
    "image-url": "https://exemplo.com/nova-imagem.jpg",
    "platform": ["PlayStation 5"],
    "categories": ["RPG"],
    "release": "2024-01-15",
    "updatedAt": "2026-01-16T10:35:00.000Z"
  }
}
```

---

#### 13. **DELETE** `/api/games/:id`

Deleta um jogo (apenas administradores)

**Headers necessários:**

```
Authorization: Bearer <token_admin>
```

**Exemplo de Requisição:**

```bash
DELETE /api/games/1
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "message": "Jogo deletado com sucesso",
  "data": {
    "id": 1,
    "titulo": "The Legend of Zelda: Breath of the Wild",
    "description": "Uma aventura épica...",
    "platform": ["Nintendo Switch", "Wii U"],
    "categories": ["Ação", "Aventura", "Mundo Aberto"],
    "release": "2017-03-03"
  }
}
```

**Resposta (403 Forbidden):**

```json
{
  "success": false,
  "message": "Apenas administradores podem deletar jogos"
}
```

---

## 💡 Exemplos de Uso

### 1. Registrar um novo usuário

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "gamer123",
    "email": "gamer@example.com",
    "password": "senhaSegura123"
  }'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "gamer123",
    "password": "senhaSegura123"
  }'
```

### 3. Buscar jogos por plataforma

```bash
curl http://localhost:3000/api/games?platform=PlayStation%205&limit=5
```

### 4. Buscar jogos por categoria

```bash
curl http://localhost:3000/api/games?category=RPG
```

### 5. Pesquisar jogos por título

```bash
curl http://localhost:3000/api/games?search=Zelda
```

### 6. Obter perfil do usuário

```bash
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 7. Criar um novo jogo (Admin)

```bash
curl -X POST http://localhost:3000/api/games \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Novo Jogo",
    "description": "Um jogo incrível",
    "imageUrl": "https://exemplo.com/imagem.jpg",
    "platform": ["PC"],
    "categories": ["Ação"],
    "release": "2024-12-25"
  }'
```

---

## ⚠️ Códigos de Erro

| Código  | Descrição                                                 |
| ------- | --------------------------------------------------------- |
| **200** | Sucesso                                                   |
| **201** | Criado com sucesso                                        |
| **400** | Requisição inválida (dados faltando ou inválidos)         |
| **401** | Não autorizado (token inválido ou credenciais incorretas) |
| **403** | Acesso proibido (permissões insuficientes)                |
| **404** | Recurso não encontrado                                    |
| **409** | Conflito (recurso já existe)                              |
| **500** | Erro interno do servidor                                  |

---

## 📝 Notas Importantes

- ⏰ Tokens JWT expiram em 24 horas
- 🔒 Sempre use HTTPS em produção
- 🔐 Mantenha seu `JWT_SECRET` seguro e único
- 👥 Usuários com role "user" não podem criar/deletar/editar jogos
- 🎮 Dados de jogos são armazenados em memória (não persistem entre reinicializações)

---

## 📞 Suporte

Para dúvidas ou reportar problemas, entre em contato através das issues do repositório.
