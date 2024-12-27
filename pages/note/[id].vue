<template>
  <div class="container">
    <div class="note-editor card">
      <header class="note-editor__header">
        <h1 class="note-editor__title">
          {{ isNewNote ? 'Новая заметка' : 'Редактирование заметки' }}
        </h1>
        <div class="note-editor__actions">
          <button @click="save" class="btn btn--success">
            <i class="fas fa-save"></i>
            <span>Сохранить</span>
          </button>
          <button @click="cancel" class="btn btn--danger">
            <i class="fas fa-times"></i>
            <span>Отменить</span>
          </button>
        </div>
      </header>

      <div class="note-editor__content">
        <div class="note-editor__form-group">
          <label for="title" class="note-editor__label">Название заметки</label>
          <input
            id="title"
            v-model="noteData.title"
            type="text"
            class="input note-editor__input"
            placeholder="Введите название заметки..."
          >
        </div>

        <div class="note-editor__form-group">
          <label class="note-editor__label">
            Список задач
            <span class="note-editor__task-count" v-if="noteData.todos.length">
              ({{ noteData.todos.length }})
            </span>
          </label>
          
          <div class="todos">
            <TransitionGroup name="todo">
              <div 
                v-for="(todo, index) in noteData.todos" 
                :key="todo.id"
                class="todos__item"
              >
                <div class="todos__content">
                  <button
                    class="todos__checkbox"
                    :class="{ 'todos__checkbox--checked': todo.completed }"
                    @click="todo.completed = !todo.completed"
                  >
                    <i v-if="todo.completed" class="fas fa-check"></i>
                  </button>
                  <input
                    v-model="todo.text"
                    type="text"
                    class="input todos__input"
                    :class="{ 'todos__input--completed': todo.completed }"
                    placeholder="Введите текст задачи..."
                  >
                </div>
                <button
                  @click="removeTodo(index)"
                  class="btn btn--danger btn--icon"
                  title="Удалить задачу"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </TransitionGroup>
          </div>

          <button
            @click="addTodo"
            class="btn btn--primary note-editor__add-btn"
          >
            <i class="fas fa-plus"></i>
            <span>Добавить задачу</span>
          </button>
        </div>

        <div v-if="showNotification" class="note-editor__notification" :class="notificationType">
          {{ notificationMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/stores/notes'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const isNewNote = computed(() => route.params.id === 'new')

const noteData = ref({
  title: '',
  todos: [] as { id: string; text: string; completed: boolean }[]
})

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('')

const showMessage = (message: string, type: 'success' | 'info') => {
  notificationMessage.value = message
  notificationType.value = `note-editor__notification--${type}`
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 2000)
}

onMounted(() => {
  if (!isNewNote.value) {
    const note = notesStore.notes.find(n => n.id === route.params.id)
    if (note) {
      noteData.value = JSON.parse(JSON.stringify(note))
    }
  }
})

const addTodo = () => {
  noteData.value.todos.push({
    id: Date.now().toString(),
    text: '',
    completed: false
  })
}

const removeTodo = (index: number) => {
  noteData.value.todos.splice(index, 1)
}

const save = () => {
  if (!noteData.value.title.trim()) {
    alert('Пожалуйста, введите название заметки')
    return
  }
  
  if (isNewNote.value) {
    notesStore.addNote(noteData.value)
  } else {
    notesStore.updateNote(route.params.id as string, noteData.value)
  }
  router.push('/')
}

const cancel = async () => {
  if (await confirm('Вы уверены, что хотите отменить редактирование? Все несохраненные изменения будут потеряны.')) {
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.note-editor {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;

    @media (max-width: 640px) {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }

  &__actions {
    display: flex;
    gap: 1rem;

    @media (max-width: 640px) {
      width: 100%;
      justify-content: center;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    font-weight: 500;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__task-count {
    font-size: 0.875rem;
    color: var(--gray-color);
    font-weight: normal;
  }

  &__add-btn {
    align-self: flex-start;

    @media (max-width: 640px) {
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    margin: 1rem;
    padding: 1rem;
  }
}

.todos {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;

  &__item {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.375rem;
    background-color: #f9fafb;
    transition: all 0.2s;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }

  &__checkbox {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
      border-color: var(--primary-color);
    }

    &--checked {
      background-color: var(--success-color);
      border-color: var(--success-color);
      color: white;
    }
  }

  &__input {
    flex: 1;
    background: transparent;

    &--completed {
      text-decoration: line-through;
      color: var(--gray-color);
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
    flex-shrink: 0;
  }
}

/* Анимации */
.todo-enter-active,
.todo-leave-active {
  transition: all 0.3s ease;
}

.todo-enter-from,
.todo-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.note-editor__notification {
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