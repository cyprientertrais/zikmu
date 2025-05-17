# 🎵 Zikmu – Lecteur Audio YouTube façon Spotify

Zikmu est une application web qui transforme les playlists YouTube en une expérience musicale moderne, dans une interface inspirée de Spotify.

> ⚠️ Ce projet est fourni à des fins d'apprentissage, d'expérimentation et de prototypage. Il n'inclut aucun contenu audio ou musical hébergé directement.

---

## ✨ Fonctionnalités

- 🖼 Affichage visuel type Spotify (header playlist, vignettes, durée)
- 🎧 Contrôle de lecture : play, pause, seek, skip
- 🕒 Slider de durée avec temps restant
- 📜 Liste interactive des pistes d'une playlist YouTube
- 📦 Backend intégré (via Nuxt server API)

---

## 🧱 Stack technique

- [Nuxt 3 (Fullstack)](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Server API en TypeScript (`/server/api/stream.ts`)

---

## 🧠 Comment ça fonctionne

Zikmu utilise :

- une interface Nuxt pour afficher et contrôler l’audio
- un serveur intégré dans Nuxt (`/server/api/`) pour récupérer les flux audio depuis une URL YouTube (ex: `/api/stream?url=...`)
- une playlist (YouTube) en entrée via son ID ou son lien

👉 Le projet **ne stocke aucun fichier audio** et ne contourne pas directement les services tiers. Tu es libre de brancher ta propre API de stream.

---

## ⚖️ À propos de la légalité

Zikmu est fourni **sans outils d'extraction intégrés**.

> Si tu ajoutes un module comme `ytdl-core`, tu es responsable de son usage et de sa conformité avec les CGU de YouTube et la législation en vigueur.

Nous recommandons de l’utiliser **à titre privé ou expérimental**, ou de t’orienter vers des **sources de musique libres de droits** si tu veux rendre ton projet public.

---

## 📄 Licence

MIT — libre d’utilisation, modification et distribution, dans le respect des lois locales et des droits d’auteur.

---

## ❤️ Contributeur

Développé avec passion par [Cyprien](https://x.com/cyptertrais)  
Design inspiré de l’univers musical moderne 🎶
