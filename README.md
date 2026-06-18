# INSOLO

Insolo - serviços a companhias aéreas

---

# INSOLO Backend (simples)

Este backend simples recebe POST em `/submit` e salva os envios em `submissions.json`.

Como usar localmente:

1. Instale dependências:

```bash
cd server
npm install
```

2. Inicie o servidor (padrão porta 3000):

```bash
npm start
```

3. Configure o `FORM_URL` no `www/insolo-web-app/src/js/main.js` para o endpoint público ou local:

- Para testes locais (com dispositivo/emulador na mesma rede): `http://SEU_IP_LOCAL:3000/submit`
- Para deploy público, use ngrok, Render, Heroku, Vercel, etc.

Endpoints:
- `POST /submit` — recebe JSON e salva
- `GET /submissions` — lista envios

Observações de segurança:
- Não exponha o servidor sem autenticação em produção.
- Para produção, use HTTPS e autenticação.
