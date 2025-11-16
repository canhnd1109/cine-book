<script setup lang="ts">
import type { IComment } from '~/types/comment.type'
import { apiComment, apiPublic } from '~/services'

interface Props {
  comment: IComment
  movieId: string
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
})

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const toast = useToast()
const { isAuthenticated, isOpenModalSignIn } = storeToRefs(useAuthStore())

const isExpanded = ref(false)
const isReplying = ref(false)
const replyContent = ref('')
const childComments = ref<IComment[]>([])
const isLoadingChildren = ref(false)

const toggleReplies = async () => {
  isExpanded.value = !isExpanded.value

  // Load children comments if expanding and not loaded yet
  if (isExpanded.value && childComments.value.length === 0 && props.comment.totalChildComment > 0) {
    isLoadingChildren.value = true
    try {
      const response = await apiPublic.fetchCommentsChildren(props.comment.id)
      childComments.value = response.value || []
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingChildren.value = false
    }
  }
}

const handleClickReply = () => {
  if (!isAuthenticated.value) {
    isOpenModalSignIn.value = true
    return
  }
  isReplying.value = !isReplying.value
}

const onSubmitReply = async () => {
  if (!isAuthenticated.value) {
    isOpenModalSignIn.value = true
    return
  }

  const content = replyContent.value.trim()
  if (!content) return

  try {
    const { message } = await apiComment.createComment({
      content,
      movieId: props.movieId,
      parentCommentId: props.comment.id
    })

    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })

    // Reset form
    replyContent.value = ''
    isReplying.value = false

    // Reload children if already expanded
    if (isExpanded.value) {
      const response = await apiPublic.fetchCommentsChildren(props.comment.id)
      childComments.value = response.value || []
    }

    // Notify parent to refresh
    emit('refresh')
  } catch (error) {
    console.error(error)
    toast.add({
      title: t('error'),
      description: t('failed-to-post-comment'),
      color: 'error'
    })
  }
}

const handleChildRefresh = async () => {
  // Reload children comments
  if (isExpanded.value) {
    try {
      const response = await apiPublic.fetchCommentsChildren(props.comment.id)
      childComments.value = response.value || []
    } catch (error) {
      console.error(error)
    }
  }
  // Propagate refresh to parent
  emit('refresh')
}
</script>

<template>
  <div :class="level > 0 ? 'ml-8 mt-4' : 'my-4'">
    <div class="flex justify-start items-start gap-4">
      <UAvatar :alt="comment.author" :size="level === 0 ? '2xl' : 'lg'" />
      <div class="flex flex-col items-start space-y-2 w-full">
        <span class="font-semibold">{{ comment.author }}</span>
        <div class="flex items-center gap-6">
          <span>{{ comment.content }}</span>
          <UTooltip :text="t('reply')" :delay-duration="0" class="hover:cursor-pointer" @click="handleClickReply">
            <UIcon name="i-lucide-reply" class="size-4 text-secondary" />
          </UTooltip>
        </div>

        <!-- Reply Input -->
        <div v-if="isReplying" class="w-3/4">
          <UChatPrompt v-model="replyContent" :rows="3" @submit="onSubmitReply">
            <UChatPromptSubmit />
          </UChatPrompt>
        </div>

        <!-- Toggle Child Comments -->
        <p
          v-if="comment.totalChildComment > 0"
          class="text-xs flex items-center gap-1 text-primary cursor-pointer"
          @click="toggleReplies"
        >
          <UIcon
            name="i-lucide-chevron-down"
            class="size-4 transition-transform duration-200"
            :class="{ 'rotate-180': isExpanded }"
          />
          {{ comment.totalChildComment }} {{ t('your-comment') }}
        </p>

        <!-- Loading State -->

        <div v-if="isLoadingChildren" class="flex items-center gap-4">
          <USkeleton class="h-12 w-12 rounded-full" />

          <div class="grid gap-2">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
          </div>
        </div>

        <!-- Child Comments (Recursive) -->
        <div v-if="isExpanded && childComments.length > 0" class="w-full">
          <CommentItem
            v-for="child in childComments"
            :key="child.id"
            :comment="child"
            :movie-id="movieId"
            :level="level + 1"
            @refresh="handleChildRefresh"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
