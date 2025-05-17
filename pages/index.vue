<template>
  <div class="min-h-screen bg-zinc-900 text-white flex flex-col">
    <!-- HEADER PLAYLIST -->
    <header class="relative bg-gradient-to-b from-orange-500 to-zinc-900 p-6 flex gap-6 items-end">
      <img
          v-if="playlist?.thumbnail"
          :src="playlist.thumbnail"
          class="w-40 h-40 rounded shadow-lg object-cover"
          alt="Playlist Cover"
      />
      <div>
        <p class="uppercase text-sm font-semibold">Playlist publique</p>
        <h1 class="text-4xl font-bold leading-tight mt-2">{{ playlist?.title || 'Titre de la playlist' }}</h1>
        <p class="text-sm text-zinc-300 mt-1">Par {{ playlist?.author || 'Auteur' }} • {{ playlist?.items?.length || 0 }} titres</p>
      </div>
    </header>

    <!-- LISTE DE TITRES -->
    <main class="flex-1 overflow-y-auto p-6">
      <table class="w-full text-left">
        <thead class="text-zinc-400 text-sm border-b border-zinc-700">
        <tr>
          <th class="w-8">#</th>
          <th class="px-4">Titre</th>
          <th>Durée</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(track, index) in playlist?.items || []"
            :key="track.id"
            class="hover:bg-zinc-800 cursor-pointer group"
            @click="playTrack(index)"
        >
          <td class="text-zinc-500 group-hover:text-white">{{ index + 1 }}</td>
          <td class="flex items-center gap-4 px-4 py-3">
            <img :src="track.thumbnail" class="w-10 h-10 object-cover rounded" />
            <span>{{ track.title }}</span>
          </td>
          <td class="text-sm text-zinc-400">{{ track.duration }}</td>
        </tr>
        </tbody>
      </table>
    </main>

    <!-- BARRE LECTEUR EN BAS -->
    <footer class="sticky bottom-0  w-full bg-zinc-950 border-t border-zinc-800 py-4 px-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <img :src="currentTrack?.thumbnail" class="w-12 h-12 rounded object-cover" />
        <div>
          <p class="font-semibold text-white">{{ currentTrack?.title || 'Titre en cours' }}</p>
          <p class="text-xs text-zinc-400">YouTube</p>
        </div>
      </div>

      <div class="flex-1 mx-6">
        <input
            type="range"
            class="w-full accent-green-500"
            :min="0"
            :max="duration"
            step="1"
            :value="currentTime"
            @input="onSeek"
        />
        <div class="flex justify-between text-xs text-zinc-400 mt-1">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <button
          @click="togglePlay"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-bold"
      >
        {{ isPlaying ? '⏸' : '▶️' }}
      </button>
    </footer>

    <audio
        ref="audioRef"
        @timeupdate="updateTime"
        @loadedmetadata="onLoadedMetadata"
        preload="metadata"
        class="hidden"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const playlistId = 'PLW3fvG7VHxA49NyqqL6sZOSiBQ6uH0vl7' // remplace avec ton ID de playlist YouTube

const playlist = ref(null)
const currentTrackIndex = ref(0)
const currentTrack = ref(null)

const audioRef = ref(null)
const isPlaying = ref(false)
const duration = ref(0)
const currentTime = ref(0)

function formatTime(sec) {
  const total = Math.floor(Number(sec) || 0)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

onMounted(async () => {
  await fetchPlaylist()
  bindAudioEvents()
})

async function fetchPlaylist() {
  try {
    const data = await $fetch(`/api/playlist?id=${playlistId}`)
    playlist.value = data
    playTrack(0)
  } catch (e) {
    console.error('Erreur playlist:', e)
  }
}

async function playTrack(index) {
  if (!playlist.value || !playlist.value.items[index]) return

  currentTrackIndex.value = index
  currentTrack.value = playlist.value.items[index]

  await nextTick()
  if (!audioRef.value) return console.warn('audioRef non disponible')

  const url = encodeURIComponent(currentTrack.value.url)
  audioRef.value.src = `/api/stream?url=${url}`
  audioRef.value.load()
  audioRef.value.play()
  isPlaying.value = true
}

function togglePlay() {
  if (!audioRef.value) return
  if (audioRef.value.paused) {
    audioRef.value.play()
    isPlaying.value = true
  } else {
    audioRef.value.pause()
    isPlaying.value = false
  }
}

function onSeek(e) {
  const val = Number(e.target.value)
  if (!isNaN(val) && audioRef.value) {
    audioRef.value.currentTime = val
    currentTime.value = val
  }
}

function seek(offset) {
  const newTime = Math.min(
      Math.max(audioRef.value.currentTime + offset, 0),
      duration.value
  )
  audioRef.value.currentTime = newTime
  currentTime.value = newTime
}

function updateTime() {
  if (audioRef.value && !audioRef.value.seeking) {
    currentTime.value = Math.floor(audioRef.value.currentTime || 0)
  }
}

function onLoadedMetadata() {
  if (audioRef.value) {
    duration.value = Math.ceil(audioRef.value.duration || 0)
    currentTime.value = 0
    audioRef.value.play()
    isPlaying.value = true
  }
}

function bindAudioEvents() {
  if (!audioRef.value) return
  audioRef.value.addEventListener('ended', () => {
    const next = currentTrackIndex.value + 1
    if (playlist.value?.items[next]) {
      playTrack(next)
    } else {
      isPlaying.value = false
      currentTime.value = 0
    }
  })
}
</script>
