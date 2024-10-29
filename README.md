# Backend de VP User Exercice

## Stacks
- langage : `Js`
- framework : `Node` and `express`
- ORM : `sequelize`
- BD : `postgres`

## Usage
Créer un fichier `.env` pour configuration de la base de donnée
Pour installer `dotenv` :
```bash
npm install dotenv
```
Dans le fichier .env devrait inclue 
```env
DB_PORT=port_base_de_donne
DB_NAME=nom_base_de_donne
DB_PASSWORD=mot_de_passe_base_de_donne
DB_HOST=host_base_de_donne
DB_USER=nom_user_base_de_donne
DB_TABLE=nom_du_table
PORT=port
```

## Fonctionnalité faits
- Authentification utilisateurs (register)
- Création d'utilisateurs (register)
- Update d'utilisateur by identifiant (avec jwt)
- Get tous les utilisateurs (avec jwt)
* Daily (29/10/24)
- Authentification utilisateur (Login)
- JWToken authentification (avec jwt)
- JWToken middleware routes (avec jwt)
- Suppression user by Id (avec jwt)
- Désactivation user en updater son état to 9