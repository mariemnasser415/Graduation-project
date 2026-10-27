import { useEffect, useState } from 'react'
import './ChatPage.css'
import ErrorMessage from '../components/ErrorMessage'

const suggestions = [
  'هل يجوز رفع الإيجار؟',
  'ما مدة الإخطار؟',
  'متى يرد التأمين؟',
]

const STORAGE_KEY = 'legallens_chat_conversations'
const CURRENT_CHAT_KEY = 'legallens_current_chat'

const welcomeMessage = {
  id: 1,
  role: 'bot',
  text: 'أهلاً! اسألني عن أي بند في عقدك أو عن القوانين المصرية.',
}

function createConversation() {
  const id = Date.now()

  return {
    id,
    title: 'محادثة جديدة',
    pinned: false,
    messages: [{ ...welcomeMessage, id: id + 1 }],
  }
}

function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const conversations = JSON.parse(saved)

      if (Array.isArray(conversations) && conversations.length > 0) {
        return conversations.map((conversation) => ({
          ...conversation,
          pinned: Boolean(conversation.pinned),
        }))
      }
    }

    const oldMessages = localStorage.getItem('legallens_chat_messages')

    if (oldMessages) {
      const messages = JSON.parse(oldMessages)

      if (Array.isArray(messages) && messages.length > 0) {
        return [
          {
            id: Date.now(),
            title: 'محادثتي السابقة',
            pinned: false,
            messages,
          },
        ]
      }
    }
  } catch {
  }

  return [createConversation()]
}

function ChatPage() {
  const [conversations, setConversations] = useState(loadConversations)
  const [currentId, setCurrentId] = useState(() => {
    return Number(localStorage.getItem(CURRENT_CHAT_KEY)) || null
  })
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editingConversationId, setEditingConversationId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const currentConversation =
    conversations.find((conversation) => conversation.id === currentId) ??
    conversations[0]

  useEffect(() => {
    if (!currentConversation) return

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    localStorage.setItem(CURRENT_CHAT_KEY, String(currentConversation.id))

    if (currentId !== currentConversation.id) {
      setCurrentId(currentConversation.id)
    }
  }, [conversations, currentConversation, currentId])

  function startNewConversation() {
    const conversation = createConversation()

    setConversations((prev) => [conversation, ...prev])
    setCurrentId(conversation.id)
    setInput('')
    setError(null)
    setReplyTo(null)
    setOpenMenuId(null)
    setEditingConversationId(null)
  }

  function startRenameConversation(conversation) {
    setEditingConversationId(conversation.id)
    setEditingTitle(conversation.title)
    setOpenMenuId(null)
  }

  function saveConversationName(id) {
    const newTitle = editingTitle.trim()
    if (!newTitle) return

    setConversations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item,
      ),
    )

    setEditingConversationId(null)
    setEditingTitle('')
  }

  function cancelRenameConversation() {
    setEditingConversationId(null)
    setEditingTitle('')
  }

  function deleteConversation(id) {
    const confirmed = window.confirm('هل تريدين حذف هذه المحادثة؟')
    if (!confirmed) return

    const remaining = conversations.filter((item) => item.id !== id)

    if (remaining.length === 0) {
      const newConversation = createConversation()
      setConversations([newConversation])
      setCurrentId(newConversation.id)
    } else {
      setConversations(remaining)

      if (currentId === id) {
        setCurrentId(remaining[0].id)
      }
    }

    if (currentId === id) {
      setInput('')
      setError(null)
      setReplyTo(null)
    }

    if (editingConversationId === id) {
      cancelRenameConversation()
    }
  }

  function togglePinConversation(id) {
    setConversations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item,
      ),
    )
  }

  async function sendMessage(text) {
    const question = text.trim()

    if (!question || loading || !currentConversation) return

    const conversationId = currentConversation.id

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: question,
      replyTo: replyTo
        ? {
            role: replyTo.role,
            text: replyTo.text,
          }
        : null,
    }

    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== conversationId) return conversation

        const isFirstQuestion = !conversation.messages.some(
          (message) => message.role === 'user',
        )

        return {
          ...conversation,
          title: isFirstQuestion ? question.slice(0, 32) : conversation.title,
          messages: [...conversation.messages, userMessage],
        }
      }),
    )

    setInput('')
    setReplyTo(null)
    setError(null)
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const data = {
        answer: 'هذا رد تجريبي. سيظهر هنا الجواب الحقيقي بعد ربط الـ AI.',
        sources: [{ title: 'قانون الإيجارات', article: 'مادة 18' }],
      }

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  {
                    id: Date.now() + 1,
                    role: 'bot',
                    text: data.answer,
                    sources: data.sources,
                  },
                ],
              }
            : conversation,
        ),
      )
    } catch {
      setError('تعذر الحصول على إجابة، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  const sortedConversations = [...conversations].sort(
    (a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)),
  )

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <button
          className="new-chat-button"
          type="button"
          onClick={startNewConversation}
        >
          + محادثة جديدة
        </button>

        <h3>المحادثات السابقة</h3>

        <div className="conversation-list">
          {sortedConversations.map((conversation) => (
            <div className="conversation-row" key={conversation.id}>
              {editingConversationId === conversation.id ? (
                <div className="conversation-edit-row">
                  <input
                    autoFocus
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveConversationName(conversation.id)
                      }

                      if (e.key === 'Escape') {
                        cancelRenameConversation()
                      }
                    }}
                    aria-label="اسم المحادثة الجديد"
                  />

                  <button
                    type="button"
                    onClick={() => saveConversationName(conversation.id)}
                  >
                    حفظ
                  </button>

                  <button
                    type="button"
                    onClick={cancelRenameConversation}
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className={`conversation-item ${
                      conversation.id === currentConversation?.id ? 'active' : ''
                    }`}
                    onClick={() => {
                      setCurrentId(conversation.id)
                      setError(null)
                      setReplyTo(null)
                      setOpenMenuId(null)
                    }}
                    title={conversation.title}
                  >
                    {conversation.pinned && <span>📌 </span>}
                    {conversation.title}
                  </button>

                  <div className="conversation-menu-wrapper">
                    <button
                      type="button"
                      className="conversation-menu-button"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === conversation.id
                            ? null
                            : conversation.id,
                        )
                      }
                      aria-label="خيارات المحادثة"
                      title="خيارات"
                    >
                      ⋮
                    </button>

                    {openMenuId === conversation.id && (
                      <div className="conversation-menu">
                        <button
                          type="button"
                          onClick={() =>
                            startRenameConversation(conversation)
                          }
                        >
                          تعديل الاسم
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            togglePinConversation(conversation.id)
                            setOpenMenuId(null)
                          }}
                        >
                          {conversation.pinned
                            ? 'إلغاء التثبيت'
                            : 'تثبيت المحادثة'}
                        </button>

                        <button
                          type="button"
                          className="delete-menu-item"
                          onClick={() => {
                            setOpenMenuId(null)
                            deleteConversation(conversation.id)
                          }}
                        >
                          حذف المحادثة
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </aside>

      <section className="chat-page">
        <h2 className="chat-title">المساعد الذكي</h2>

        <div className="chat-messages">
          {currentConversation?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-row message-row-${msg.role}`}
            >
              <div className={`bubble bubble-${msg.role}`}>
                {msg.replyTo && (
                  <div className="message-reply-reference">
                    رد على: {msg.replyTo.text}
                  </div>
                )}

                <p>{msg.text}</p>

                {msg.sources?.length > 0 && (
                  <div className="bubble-sources">
                    المصادر:{' '}
                    {msg.sources
                      .map((source) => `${source.title} - ${source.article}`)
                      .join('، ')}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="message-reply-button"
                onClick={() => setReplyTo(msg)}
                aria-label="الرد على الرسالة"
                title="رد"
              >
                ↩
              </button>
            </div>
          ))}

          {loading && <div className="bubble bubble-bot">جارٍ الكتابة...</div>}

          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => setError(null)}
            />
          )}
        </div>

        <div className="chat-suggestions">
          <span>أسئلة مقترحة:</span>

          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => sendMessage(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form className="chat-input-row" onSubmit={handleSubmit}>
          {replyTo && (
            <div className="reply-preview">
              <span>الرد على: {replyTo.text}</span>

              <button type="button" onClick={() => setReplyTo(null)}>
                إلغاء
              </button>
            </div>
          )}

          <div className="chat-input-controls">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا"
            />

            <button type="submit" className="chat-send" disabled={loading}>
              إرسال
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ChatPage