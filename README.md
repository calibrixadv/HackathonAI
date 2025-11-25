# Spot&Snack

Spot&Snack este o aplicație mobilă dezvoltată cu **React Native** și **Expo**, care permite utilizatorilor să interacționeze prin mesagerie și funcționalități sociale.  

---

## Rute principale

Aplicația are 4 rute principale:

1. **Login**  
   Autentificarea utilizatorilor existenți.  
   **API Request Example:**
   ```javascript
   fetch('https://example.com/api/login', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       email: 'user@example.com',
       password: 'password123'
     }),
   })
   .then(res => res.json())
   .then(data => console.log(data))
   .catch(err => console.error(err));
   ```

2. **Register**  
   Crearea unui cont nou.  
   **API Request Example:**
   ```javascript
   fetch('https://example.com/api/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       name: 'John Doe',
       email: 'user@example.com',
       password: 'password123'
     }),
   })
   .then(res => res.json())
   .then(data => console.log(data))
   .catch(err => console.error(err));
   ```

3. **Chat**  
   Conversații între utilizatori.  
   **API Request Example (trimitere mesaj):**
   ```javascript
   fetch('https://example.com/api/chat/send', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer TOKEN' },
     body: JSON.stringify({
       chatId: '123',
       message: 'Salut, ce faci?'
     }),
   })
   .then(res => res.json())
   .then(data => console.log(data))
   .catch(err => console.error(err));
   ```

   **API Request Example (primire mesaje):**
   ```javascript
   fetch('https://example.com/api/chat/123/messages', {
     headers: { 'Authorization': 'Bearer TOKEN' }
   })
   .then(res => res.json())
   .then(messages => console.log(messages))
   .catch(err => console.error(err));
   ```

4. **Vibe**  
   Feed social pentru postări și interacțiuni.  
   **API Request Example (obținere feed):**
   ```javascript
   fetch('https://example.com/api/vibe/feed', {
     headers: { 'Authorization': 'Bearer TOKEN' }
   })
   .then(res => res.json())
   .then(feed => console.log(feed))
   .catch(err => console.error(err));
   ```

   **API Request Example (creare post):**
   ```javascript
   fetch('https://example.com/api/vibe/create', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer TOKEN' },
     body: JSON.stringify({
       content: 'Hello world!',
       image: 'https://example.com/image.jpg'
     }),
   })
   .then(res => res.json())
   .then(post => console.log(post))
   .catch(err => console.error(err));
   ```

---

## Componente

- **UI Components**: butoane, formulare, carduri, liste, input-uri  
- **Screens**: componente principale asociate fiecărei rute  
- **Navigation**: `react-navigation` pentru rutare și navigare între ecrane  
- **State management**: `React Context` sau `zustand` pentru starea aplicației  
- **Services / API**: module pentru comunicarea cu backend-ul  

---

## Arhitectura sistemului

```
App
 ├─ Navigation (Stack/Tab)
 │   ├─ LoginScreen
 │   ├─ RegisterScreen
 │   ├─ ChatScreen
 │   └─ VibeScreen
 ├─ Components
 │   ├─ AuthButton
 │   ├─ MessageList
 │   ├─ MessageBubble
 │   ├─ PostCard
 │   └─ PostList
 ├─ Context / State
 │   └─ UserContext / ChatContext / VibeContext
 └─ Services
     ├─ api.js
     ├─ auth.js
     ├─ chat.js
     └─ vibe.js
```

- Fiecare ecran este modular și separat.  
- Componentele UI sunt reutilizabile.  
- State-ul global este gestionat prin context sau librării de management al stării.  
- Serviciile gestionează comunicarea cu backend-ul și logica aplicației.  

---

## Setup și rulare

```bash
# Instalează dependențele
npm install

# Rulează aplicația
npx expo start
```

---

## Contribuții

- Respectați structura componentelor și convențiile existente.  
- Pull request-urile sunt binevenite.  

---



