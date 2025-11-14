<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

defineProps<{
  placeholder?: string
}>()

const model = defineModel<string>({
  required: false,
  default: ''
})

const editor = useEditor({
  content: model.value,
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-4'
    }
  },
  onUpdate: ({ editor }) => {
    model.value = editor.getHTML()
  }
})

watch(
  () => model.value,
  value => {
    const isSame = editor.value?.getHTML() === value
    if (!isSame && editor.value) {
      editor.value.commands.setContent(value, { emitUpdate: false })
    }
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
    <div v-if="editor" class="border-b border-gray-300 dark:border-gray-700 p-2 flex gap-1 flex-wrap bg-gray-50 dark:bg-gray-800">
      <button
        type="button"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('bold') }"
        class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <span class="font-bold">B</span>
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('italic') }"
        class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <span class="italic">I</span>
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('strike') }"
        class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <span class="line-through">S</span>
      </button>
      <div class="w-px bg-gray-300 dark:bg-gray-700 mx-1" />
      <button
        type="button"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('heading', { level: 1 }) }"
        class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('heading', { level: 2 }) }"
        class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('heading', { level: 3 }) }"
        class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </button>
      <div class="w-px bg-gray-300 dark:bg-gray-700 mx-1" />
      <button
        type="button"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('bulletList') }"
        class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        • List
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('orderedList') }"
        class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        1. List
      </button>
      <div class="w-px bg-gray-300 dark:bg-gray-700 mx-1" />
      <button
        type="button"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('blockquote') }"
        class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        " Quote
      </button>
      <button
        type="button"
        class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        ―
      </button>
    </div>
    <EditorContent :editor="editor" class="bg-white dark:bg-gray-900" />
  </div>
</template>

<style>
.ProseMirror {
  min-height: 200px;
}

.ProseMirror:focus {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
