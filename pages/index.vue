<template>
  <div class="container">
    <div class="notes">
      <header class="notes__header">
        <div class="notes__title-group">
          <h1 class="notes__title">Мои заметки</h1>
          <div class="notes__actions">
            <button
              @click="undo"
              :disabled="!canUndo"
              class="btn btn--gray"
              :class="{ 'btn--disabled': !canUndo }"
              title="Отменить последнее действие"
            >
              <i class="fas fa-undo"></i>
              <span>Отменить ({{ currentHistoryIndex + 1 }}/{{ historyLength }})</span>
            </button>
            <button
              @click="redo"
              :disabled="!canRedo"
              class="btn btn--gray"
              :class="{ 'btn--disabled': !canRedo }"
              title="Повторить отменённое действие"
            >
              <i class="fas fa-redo"></i>
              <span>Повторить ({{ historyLength - currentHistoryIndex - 1 }})</span>
            </button>
          </div>
        </div>
        <NuxtLink to="/note/new" class="btn btn--primary">
          <i class="fas fa-plus"></i>
          <span>Создать заметку</span>
        </NuxtLink>
      </header>

      <div class="notes__grid">
        <article 
          v-for="note in notes" 
          :key="note.id" 
          class="note-card card"
        >
          <div class="note-card__header">
            <h2 class="note-card__title">{{ note.title }}</h2>
            <div class="note-card__actions">
              <NuxtLink 
                :to="`/note/${note.id}`" 
                class="btn btn--primary btn--icon"
                title="Редактировать"
              >
                <i class="fas fa-edit"></i>
              </NuxtLink>
              <button 
                @click="confirmDelete(note)"
                class="btn btn--danger btn--icon"
                title="Удалить"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <div class="note-card__todos">
            <div 
              v-for="todo in note.todos.slice(0, 3)" 
              :key="todo.id"
              class="todo-preview"
            >
              <span 
                class="todo-preview__checkbox"
                :class="{ 'todo-preview__checkbox--checked': todo.completed }"
              >
                <i v-if="todo.completed" class="fas fa-check"></i>
              </span>
              <span 
                class="todo-preview__text"
                :class="{ 'todo-preview__text--completed': todo.completed }"
              >
                {{ todo.text }}
              </span>
            </div>
            <div 
              v-if="note.todos.length > 3" 
              class="note-card__more"
            >
              ...и ещё {{ note.todos.length - 3 }} задач
            </div>
          </div>
        </article>
      </div>

      <div v-if="showNotification" class="notes__notification" :class="notificationType">
        {{ notificationMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/stores/notes'

const notesStore = useNotesStore()
const notes = computed(() => notesStore.notes)
const historyLength = computed(() => notesStore.history.length)
const currentHistoryIndex = computed(() => notesStore.currentHistoryIndex)
const canUndo = computed(() => notesStore.currentHistoryIndex >= 0)
const canRedo = computed(() => notesStore.currentHistoryIndex < notesStore.history.length - 1)

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('')

const showMessage = (message: string, type: 'success' | 'info') => {
  notificationMessage.value = message
  notificationType.value = `notes__notification--${type}`
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 2000)
}

const undo = () => {
  const action = notesStore.history[notesStore.currentHistoryIndex]
  let message = 'Отменено: '
  
  switch (action.type) {
    case 'ADD':
      message += 'создание заметки'
      break
    case 'UPDATE':
      message += 'изменение заметки'
      break
    case 'DELETE':
      message += 'удаление заметки'
      break
  }
  
  notesStore.undo()
  showMessage(message, 'info')
}

const redo = () => {
  const action = notesStore.history[notesStore.currentHistoryIndex + 1]
  let message = 'Повторено: '
  
  switch (action.type) {
    case 'ADD':
      message += 'создание заметки'
      break
    case 'UPDATE':
      message += 'изменение заметки'
      break
    case 'DELETE':
      message += 'удаление заметки'
      break
  }
  
  notesStore.redo()
  showMessage(message, 'success')
}

const confirmDelete = async (note: { id: string; title: string }) => {
  if (await confirm(`Вы уверены, что хотите удалить заметку "${note.title}"?`)) {
    notesStore.deleteNote(note.id)
  }
}
</script>

<style lang="scss" scoped>
.notes {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: spacing('xl');
    gap: spacing('md');

    @include media-down('md') {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__title-group {
    display: flex;
    flex-direction: column;
    gap: spacing('md');
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: color('gray', 'base');
  }

  &__actions {
    display: flex;
    gap: spacing('sm');
    flex-wrap: wrap;

    @include media-down('sm') {
      flex-direction: column;
    }
  }

  &__notification {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease;
    z-index: 1000;

    &--success {
      border-left: 4px solid color('success', 'base');
    }

    &--info {
      border-left: 4px solid color('primary', 'base');
    }
  }
}

.note-card {
  padding: spacing('lg');
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: spacing('md');
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 500;
    color: color('gray', 'base');
    word-break: break-word;
    margin-right: spacing('sm');
  }

  &__actions {
    display: flex;
    gap: spacing('xs');
    flex-shrink: 0;
  }

  &__todos {
    display: flex;
    flex-direction: column;
    gap: spacing('sm');
  }

  &__more {
    font-size: 0.875rem;
    color: color('gray', 'base');
    font-style: italic;
    margin-top: spacing('xs');
  }
}

.todo-preview {
  display: flex;
  align-items: center;
  gap: spacing('sm');

  &__checkbox {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--checked {
      background-color: color('success', 'base');
      border-color: color('success', 'base');
      color: white;
    }
  }

  &__text {
    font-size: 0.875rem;
    color: color('gray', 'base');
    word-break: break-word;

    &--completed {
      text-decoration: line-through;
      color: color('gray', 'hover');
    }
  }
}

.btn {
  &--icon {
    width: 2rem;
    height: 2rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 