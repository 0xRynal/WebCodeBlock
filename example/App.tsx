import React, { useState } from 'react';
import { CodeBlock } from '../src/components/CodeBlock';
import type { Theme } from '../src/types';

/**
 * Application de démo pour tester le composant CodeBlock
 */
function App() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('vs-dark');

  // Exemples de code pour différents langages
  const examples = {
    typescript: `// TypeScript - Exemple complet avec toutes les fonctionnalités
interface User {
  id: number;
  name: string;
  email?: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      id: Math.floor(Math.random() * 1000),
      ...userData,
    };
    
    this.users.push(newUser);
    return newUser;
  }

  findUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}

const userService = new UserService();
userService.createUser({
  name: "John Doe",
  email: "john@example.com",
  isActive: true
});`,

    javascript: `// JavaScript - Exemple avec async/await et destructuring
const API_BASE = 'https://api.example.com';

async function fetchUserData(userId) {
  try {
    const response = await fetch(\`\${API_BASE}/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const userData = await response.json();
    const { name, email, preferences } = userData;
    
    // Destructuring avec valeurs par défaut
    const { theme = 'dark', language = 'en' } = preferences || {};
    
    return { name, email, theme, language };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Arrow function avec template literals
const formatUserInfo = (user) => {
  return \`User: \${user.name} (\${user.email})\`;
};`,

    jsx: `import React, { useState, useEffect } from 'react';

// Composant fonctionnel avec hooks
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const userData = await fetchUser(userId);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p className="email">{user.email}</p>
      <button 
        onClick={() => setUser({...user, isActive: !user.isActive})}
        className={\`btn \${user.isActive ? 'active' : 'inactive'}\`}
      >
        {user.isActive ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  );
}

export default UserProfile;`,

    html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ma Page Web</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="main-header">
        <nav>
            <ul class="nav-list">
                <li><a href="#home" class="nav-link">Accueil</a></li>
                <li><a href="#about" class="nav-link">À propos</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main class="container">
        <section id="hero">
            <h1>Bienvenue sur mon site</h1>
            <p>Découvrez nos services exceptionnels</p>
            <button class="cta-button" onclick="scrollToSection('about')">
                En savoir plus
            </button>
        </section>
    </main>
    
    <script src="script.js"></script>
</body>
</html>`,

    css: `/* Styles CSS modernes avec Flexbox et Grid */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #333;
  --bg-color: #f8f9fa;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--bg-color);
}

.main-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-list {
  display: flex;
  list-style: none;
  justify-content: center;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .nav-list {
    flex-direction: column;
    align-items: center;
  }
}`,

    python: `# Python - Exemple avec classes et gestion d'erreurs
import asyncio
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from pathlib import Path

@dataclass
class User:
    """Classe représentant un utilisateur."""
    name: str
    email: str
    age: int
    is_active: bool = True
    
    def __str__(self) -> str:
        return f"User({self.name}, {self.email})"

class UserService:
    """Service pour gérer les utilisateurs."""
    
    def __init__(self):
        self.users: List[User] = []
    
    async def create_user(self, name: str, email: str, age: int) -> User:
        """Crée un nouvel utilisateur de manière asynchrone."""
        try:
            user = User(name=name, email=email, age=age)
            self.users.append(user)
            print(f"Utilisateur créé: {user}")
            return user
        except Exception as e:
            print(f"Erreur lors de la création: {e}")
            raise
    
    def find_user_by_email(self, email: str) -> Optional[User]:
        """Trouve un utilisateur par son email."""
        return next((user for user in self.users if user.email == email), None)

# Utilisation
async def main():
    service = UserService()
    
    try:
        user = await service.create_user("Alice", "alice@example.com", 30)
        found_user = service.find_user_by_email("alice@example.com")
        print(f"Utilisateur trouvé: {found_user}")
    except Exception as e:
        print(f"Erreur: {e}")

if __name__ == "__main__":
    asyncio.run(main())`,

    json: `{
  "name": "web-code-block",
  "version": "1.0.0",
  "description": "Composant React pour afficher du code façon VS Code",
  "main": "dist/web-code-block.cjs.js",
  "module": "dist/web-code-block.es.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "jest"
  },
  "keywords": [
    "react",
    "code",
    "syntax-highlighting",
    "vs-code",
    "typescript"
  ],
  "author": {
    "name": "Votre Nom",
    "email": "votre@email.com",
    "url": "https://github.com/votrepseudo"
  },
  "license": "MIT",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/votrepseudo/web-code-block.git"
  }
}`,

    yaml: `# Configuration YAML pour une application web
name: "Mon Application Web"
version: "1.2.3"
description: "Application web moderne avec React et TypeScript"

# Configuration de l'environnement
environment:
  development:
    api_url: "http://localhost:3000"
    debug: true
    log_level: "debug"
  
  production:
    api_url: "https://api.monapp.com"
    debug: false
    log_level: "error"

# Configuration de la base de données
database:
  host: "localhost"
  port: 5432
  name: "monapp_db"
  credentials:
    username: "\${DB_USERNAME}"
    password: "\${DB_PASSWORD}"

# Configuration des services
services:
  auth:
    enabled: true
    jwt_secret: "\${JWT_SECRET}"
    token_expiry: "24h"
  
  cache:
    provider: "redis"
    host: "localhost"
    port: 6379
    ttl: 3600

# Configuration des routes
routes:
  - path: "/api/users"
    method: "GET"
    handler: "UserController.index"
    middleware: ["auth", "rateLimit"]
  
  - path: "/api/users/:id"
    method: "GET"
    handler: "UserController.show"
    middleware: ["auth"]`,

    sql: `-- Requêtes SQL pour une application de gestion d'utilisateurs
-- Création des tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    bio TEXT,
    avatar_url VARCHAR(255),
    birth_date DATE
);

-- Insertion de données d'exemple
INSERT INTO users (username, email, password_hash) VALUES
('john_doe', 'john@example.com', '$2b$10$hashedpassword1'),
('jane_smith', 'jane@example.com', '$2b$10$hashedpassword2'),
('bob_wilson', 'bob@example.com', '$2b$10$hashedpassword3');

-- Requête complexe avec jointures
SELECT 
    u.id,
    u.username,
    u.email,
    p.first_name,
    p.last_name,
    p.bio,
    COUNT(posts.id) as post_count
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
LEFT JOIN posts ON u.id = posts.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.username, u.email, p.first_name, p.last_name, p.bio
HAVING COUNT(posts.id) > 5
ORDER BY post_count DESC
LIMIT 10;`,

    bash: `#!/bin/bash
# Script de déploiement pour une application web
set -e  # Arrêter le script en cas d'erreur

# Configuration
APP_NAME="web-code-block"
VERSION="1.0.0"
BUILD_DIR="./dist"
DEPLOY_DIR="/var/www/html"

# Couleurs pour les messages
RED='\x1b[0;31m'
GREEN='\x1b[0;32m'
YELLOW='\x1b[1;33m'
NC='\x1b[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "\x1b[0;32m[INFO]\x1b[0m $1"
}

log_warn() {
    echo -e "\x1b[1;33m[WARN]\x1b[0m $1"
}

log_error() {
    echo -e "\x1b[0;31m[ERROR]\x1b[0m $1"
}

# Vérification des prérequis
check_dependencies() {
    log_info "Vérification des dépendances..."
    
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "git n'est pas installé"
        exit 1
    fi
}

# Construction de l'application
build_app() {
    log_info "Construction de l'application..."
    
    npm ci
    npm run build
    
    if [ ! -d "$BUILD_DIR" ]; then
        log_error "Le répertoire de build n'existe pas"
        exit 1
    fi
    
    log_info "Build terminé avec succès"
}

# Déploiement
deploy() {
    log_info "Déploiement vers $DEPLOY_DIR..."
    
    # Sauvegarde de l'ancienne version
    if [ -d "/var/www/html" ]; then
        sudo mv "/var/www/html" "/var/www/html.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Copie des nouveaux fichiers
    sudo cp -r "./dist" "/var/www/html"
    sudo chown -R www-data:www-data "/var/www/html"
    
    log_info "Déploiement terminé avec succès"
}

# Fonction principale
main() {
    log_info "Début du déploiement de $APP_NAME v$VERSION"
    
    check_dependencies
    build_app
    deploy
    
    log_info "Déploiement terminé avec succès!"
}

# Exécution du script
main "$@"`,

    markdown: `# Web Code Block

Un composant React élégant pour afficher du code façon VS Code.

## 🚀 Fonctionnalités

- **Coloration syntaxique** : Support de nombreux langages
- **Thèmes multiples** : VS Dark, Light, Dracula, Nord
- **Effet de frappe** : Animation de machine à écrire
- **Numéros de ligne** : Affichage optionnel
- **Bouton de copie** : Copie facile du code
- **Responsive** : S'adapte à tous les écrans

## 📦 Installation

\`\`\`bash
npm install web-code-block
\`\`\`

## 🎯 Utilisation

\`\`\`tsx
import { CodeBlock } from 'web-code-block';

function App() {
  return (
    <CodeBlock
      filename="example.ts"
      language="typescript"
      theme="vs-dark"
      code={\`function hello() {
  console.log("Hello World!");
}\`}
      copyButton={true}
      showLineNumbers={true}
    />
  );
}
\`\`\`

## 🎨 Thèmes disponibles

| Thème | Description |
|-------|-------------|
| \`vs-dark\` | Thème sombre VS Code (par défaut) |
| \`light\` | Thème clair |
| \`dracula\` | Thème Dracula |
| \`nord\` | Thème Nord |

## 📝 Langages supportés

- TypeScript / JavaScript
- JSX / TSX
- HTML / CSS
- Python / Java
- Go / Rust / C / C++
- PHP / Ruby
- JSON / YAML
- SQL / Bash
- Markdown

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (\`git checkout -b feature/nouvelle-fonctionnalite\`)
3. Commit vos changements (\`git commit -am 'Ajouter une nouvelle fonctionnalité'\`)
4. Push vers la branche (\`git push origin feature/nouvelle-fonctionnalite\`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

*Fait avec ❤️ par [Votre Nom](https://github.com/votrepseudo)*`,
  };

  const themes: Theme[] = ['vs-dark', 'light', 'dracula', 'nord'];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: selectedTheme === 'light' ? '#f8f9fa' : '#0d1117',
      color: selectedTheme === 'light' ? '#1f2937' : '#c9d1d9',
      padding: '2rem',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Header */}
      <header style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 3rem',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🎨 Web Code Block
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
          Affichage élégant de code façon VS Code
        </p>

        {/* Sélecteur de thème */}
        <div style={{ 
          marginTop: '2rem', 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className="theme-button"
              style={{
                background: selectedTheme === theme 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : theme === 'light' ? '#e5e7eb' : '#21262d',
                color: selectedTheme === theme || theme === 'light' ? '#fff' : '#c9d1d9',
                border: selectedTheme === theme ? '2px solid #667eea' : '2px solid transparent',
              }}
            >
              {theme}
            </button>
          ))}
        </div>
      </header>

      {/* Exemples */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem'
      }}>
        {/* Section TypeScript */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            💙 TypeScript - Toutes les fonctionnalités
          </h2>
          <CodeBlock
            filename="test.ts"
            language="typescript"
            theme={selectedTheme}
            code={examples.typescript}
            copyButton={true}
            showLineNumbers={true}
          />
        </section>

        {/* Section JavaScript */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            🟨 JavaScript - Sans numéros de ligne
          </h2>
          <CodeBlock
            filename="app.js"
            language="javascript"
            theme={selectedTheme}
            code={examples.javascript}
            copyButton={true}
          />
        </section>

        {/* Section JSX */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            ⚛️ React JSX - Avec effet typing
          </h2>
          <CodeBlock
            filename="Counter.jsx"
            language="jsx"
            theme={selectedTheme}
            code={examples.jsx}
            copyButton={true}
            typingEffect={true}
            typingSpeed={50}
          />
        </section>

        {/* Section HTML */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            🌐 HTML - Structure web
          </h2>
          <CodeBlock
            filename="index.html"
            language="html"
            theme={selectedTheme}
            code={examples.html}
            copyButton={true}
            showLineNumbers={true}
          />
        </section>

        {/* Section CSS */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            🎨 CSS - Styles modernes
          </h2>
          <CodeBlock
            filename="styles.css"
            language="css"
            theme={selectedTheme}
            code={examples.css}
            copyButton={true}
            showLineNumbers={true}
          />
        </section>

        {/* Section Python */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            🐍 Python - Classes et async
          </h2>
          <CodeBlock
            filename="user_service.py"
            language="python"
            theme={selectedTheme}
            code={examples.python}
            copyButton={true}
            showLineNumbers={true}
          />
        </section>

        {/* Section JSON */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            📋 JSON - Configuration
          </h2>
          <CodeBlock
            filename="package.json"
            language="json"
            theme={selectedTheme}
            code={examples.json}
            copyButton={true}
            showLineNumbers={true}
          />
        </section>

        {/* Section YAML */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            ⚙️ YAML - Configuration
          </h2>
          <CodeBlock
            filename="config.yaml"
            language="yaml"
            theme={selectedTheme}
            code={examples.yaml}
            copyButton={true}
            showLineNumbers={true}
          />
        </section>

        {/* Section SQL */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            🗄️ SQL - Base de données
          </h2>
          <CodeBlock
            filename="schema.sql"
            language="sql"
            theme={selectedTheme}
            code={examples.sql}
            copyButton={true}
            showLineNumbers={true}
          />
        </section>

        {/* Section Bash */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            🐚 Bash - Script de déploiement
          </h2>
          <CodeBlock
            filename="deploy.sh"
            language="bash"
            theme={selectedTheme}
            code={examples.bash}
            copyButton={true}
            showLineNumbers={true}
          />
        </section>

        {/* Section Markdown */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            📝 Markdown - Documentation
          </h2>
          <CodeBlock
            filename="README.md"
            language="markdown"
            theme={selectedTheme}
            code={examples.markdown}
            copyButton={true}
            showLineNumbers={true}
          />
        </section>

        {/* Comparaison de thèmes */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            🎭 Comparaison de thèmes
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '2rem'
          }}>
            {themes.map((theme) => (
              <CodeBlock
                key={theme}
                filename={`example-${theme}.ts`}
                language="typescript"
                theme={theme}
                code={`// Thème: ${theme}
function hello() {
  console.log("Hello!");
}`}
                copyButton={true}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ 
        maxWidth: '1200px', 
        margin: '4rem auto 2rem',
        textAlign: 'center',
        opacity: 0.7,
        fontSize: '0.9rem'
      }}>
        <p>
          💙 Fait avec passion • 
          <a 
            href="https://github.com/tonpseudo/web-code-block" 
            style={{ color: '#667eea', marginLeft: '0.5rem' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;