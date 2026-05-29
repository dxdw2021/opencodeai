import { Component, createSignal, createMemo, For, Show, onMount } from "solid-js"
import { useLocal } from "@/context/local"
import { useServer } from "@/context/server"
import { useSync } from "@/context/sync"
import { Icon } from "@opencode-ai/ui/icon"

interface ExpertManifest {
  id: string
  categoryId: string
  displayName: { zh?: string; en?: string }
  profession: { zh?: string; en?: string }
  description: { zh?: string; en?: string }
  agentName?: string
  expertType: string
  avatar?: string
  tags?: { zh?: string; en?: string }[]
  quickPrompts?: { zh?: string; en?: string }[]
}

const CATEGORIES: Record<string, { name: string }> = {
  "13-TencentZone": { name: "腾讯专区" },
  "01-ProductDesign": { name: "产品设计" },
  "02-Engineering": { name: "技术工程" },
  "08-FinanceInvestment": { name: "金融投资" },
  "03-GameSpatial": { name: "游戏空间" },
  "04-DataAI": { name: "数据智能" },
  "05-MarketingGrowth": { name: "营销增长" },
  "06-ContentCreative": { name: "内容创作" },
  "07-SalesCommerce": { name: "销售商务" },
  "09-OperationsHR": { name: "运营人力" },
  "10-ProjectQuality": { name: "项目质量" },
  "11-SecurityCompliance": { name: "法务安全" },
  "12-IndustryConsultant": { name: "行业顾问" },
}

const CATEGORY_EMOJI: Record<string, string> = {
  "13-TencentZone": "☁️",
  "01-ProductDesign": "🎨",
  "02-Engineering": "⚙️",
  "08-FinanceInvestment": "💰",
  "03-GameSpatial": "🎮",
  "04-DataAI": "📊",
  "05-MarketingGrowth": "📈",
  "06-ContentCreative": "✍️",
  "07-SalesCommerce": "🤝",
  "09-OperationsHR": "👥",
  "10-ProjectQuality": "✅",
  "11-SecurityCompliance": "🔒",
  "12-IndustryConsultant": "🏢",
}

const TYPE_LABELS: Record<string, string> = {
  agent: "Agent",
  team: "团队",
  plugin: "插件",
}

const TYPE_EMOJIS: Record<string, string> = {
  agent: "🤖",
  team: "👥",
  plugin: "🔌",
}

export default function Experts() {
  const local = useLocal()
  const server = useServer()
  const sync = useSync()

  const [manifest, setManifest] = createSignal<Record<string, ExpertManifest>>({})
  const [searchQuery, setSearchQuery] = createSignal("")
  const [selectedCategory, setSelectedCategory] = createSignal("all")
  const [selectedType, setSelectedType] = createSignal("all")
  const [manifestLoaded, setManifestLoaded] = createSignal(false)

  onMount(async () => {
    try {
      const url = server.url
      const resp = await fetch(`${url}/experts/manifest.json`)
      if (resp.ok) {
        const data = await resp.json()
        const map: Record<string, ExpertManifest> = {}
        for (const expert of data.experts || []) {
          map[expert.agentName || expert.id] = expert
        }
        setManifest(map)
      }
    } catch (err) {
      console.error("Failed to load expert manifest:", err)
    }
    setManifestLoaded(true)
  })

  const experts = createMemo(() => {
    const agents = sync.data.agent || []
    const lookup = manifest()
    const items = agents
      .filter((a) => a.mode !== "subagent" && !a.hidden)
      .map((agent) => {
        const rich = lookup[agent.name]
        return {
          name: agent.name,
          displayName: rich?.displayName?.zh || agent.name,
          profession: rich?.profession?.zh || rich?.profession?.en || "",
          description: rich?.description?.zh || agent.description || "",
          categoryId: rich?.categoryId || "02-Engineering",
          expertType: rich?.expertType || "agent",
          tags: (rich?.tags || []).map((t) => t.zh || t.en || ""),
          avatar: rich?.avatar || null,
        }
      })
    // Only show items with rich data or agent name
    return items.length > 0 ? items : []
  })

  const categoryCounts = createMemo(() => {
    const counts: Record<string, number> = { all: experts().length }
    for (const e of experts()) {
      counts[e.categoryId] = (counts[e.categoryId] || 0) + 1
    }
    return counts
  })

  const filtered = createMemo(() => {
    let result = experts()
    if (selectedCategory() !== "all") {
      result = result.filter((e) => e.categoryId === selectedCategory())
    }
    if (selectedType() !== "all") {
      result = result.filter((e) => e.expertType === selectedType())
    }
    const q = searchQuery().toLowerCase().trim()
    if (q) {
      result = result.filter(
        (e) =>
          e.displayName.toLowerCase().includes(q) ||
          e.profession.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    return result
  })

  const handleSelect = (name: string) => {
    try {
      local.agent.set(name)
    } catch (e) {
      console.error(e)
    }
  }

  const avatarUrl = (avatar: string | null) => {
    if (!avatar) return null
    const file = avatar.replace("/avatars/", "")
    return `${server.url}/experts/avatars/${file}`
  }

  return (
    <div class="flex flex-col h-full overflow-hidden">
      {/* Search bar */}
      <div class="flex items-center gap-3 px-5 py-3 border-b border-border-base shrink-0">
        <div class="relative flex-1">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 text-text-weak"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15.8332 15.8337L13.0819 13.0824M14.6143 9.39088C14.6143 12.2759 12.2755 14.6148 9.39039 14.6148C6.50532 14.6148 4.1665 12.2759 4.1665 9.39088C4.1665 6.5058 6.50532 4.16699 9.39039 4.16699C12.2755 4.16699 14.6143 6.5058 14.6143 9.39088Z"
              stroke="currentColor"
              stroke-linecap="square"
            />
          </svg>
          <input
            type="text"
            placeholder="搜索专家名称、描述、技能..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            class="w-full pl-9 pr-8 py-2 rounded-lg border border-border-base bg-surface-base text-14-regular text-text-primary placeholder:text-text-weak focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20"
            autofocus
          />
          <Show when={searchQuery()}>
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 text-text-weak hover:text-text-secondary"
              onClick={() => setSearchQuery("")}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M3.75 3.75L16.25 16.25M16.25 3.75L3.75 16.25" stroke="currentColor" stroke-linecap="square" />
              </svg>
            </button>
          </Show>
        </div>
        <div class="text-13-regular text-text-weak shrink-0">
          <Show when={manifestLoaded()}>
            {filtered().length} / {experts().length}
          </Show>
        </div>
      </div>

      {/* Category filter tabs */}
      <div class="flex items-center gap-2 px-5 py-2 border-b border-border-base overflow-x-auto shrink-0">
        <button
          class={`px-3 py-1.5 rounded-full text-13-regular whitespace-nowrap transition-all duration-200 ${
            selectedCategory() === "all"
              ? "bg-accent-primary text-white"
              : "bg-surface-raised-non-alpha text-text-secondary hover:bg-surface-raised-stronger-non-alpha"
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          全部领域 ({experts().length})
        </button>
        <For each={Object.entries(CATEGORIES)}>
          {([id, cat]) => {
            const count = categoryCounts()[id]
            if (!count) return null
            return (
              <button
                class={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-13-regular whitespace-nowrap transition-all duration-200 ${
                  selectedCategory() === id
                    ? "bg-accent-primary text-white"
                    : "bg-surface-raised-non-alpha text-text-secondary hover:bg-surface-raised-stronger-non-alpha"
                }`}
                onClick={() => setSelectedCategory(id)}
              >
                <span>{CATEGORY_EMOJI[id] || "📌"}</span>
                <span>{cat.name}</span>
                <span class={`text-11-regular ${selectedCategory() === id ? "text-white/80" : "text-text-weak"}`}>
                  {count}
                </span>
              </button>
            )
          }}
        </For>
        <div class="w-px h-6 bg-border-base mx-1" />
        {["all", "agent", "team", "plugin"].map((type) => (
          <button
            class={`px-3 py-1.5 rounded-full text-13-regular transition-all duration-200 ${
              selectedType() === type
                ? "bg-accent-primary text-white"
                : "bg-surface-raised-non-alpha text-text-secondary hover:bg-surface-raised-stronger-non-alpha"
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type === "all" ? "全部" : `${TYPE_EMOJIS[type] || ""} ${TYPE_LABELS[type] || type}`}
          </button>
        ))}
      </div>

      {/* Expert grid */}
      <div class="flex-1 overflow-y-auto p-5">
        <Show
          when={filtered().length > 0}
          fallback={
            <div class="flex flex-col items-center justify-center h-full gap-2 text-text-weak">
              <svg width="48" height="48" viewBox="0 0 20 20" fill="none" class="opacity-50">
                <path
                  d="M15.8332 15.8337L13.0819 13.0824M14.6143 9.39088C14.6143 12.2759 12.2755 14.6148 9.39039 14.6148C6.50532 14.6148 4.1665 12.2759 4.1665 9.39088C4.1665 6.5058 6.50532 4.16699 9.39039 4.16699C12.2755 4.16699 14.6143 6.5058 14.6143 9.39088Z"
                  stroke="currentColor"
                  stroke-linecap="square"
                />
              </svg>
              <span class="text-14-regular">未找到匹配的专家</span>
              <span class="text-12-regular">试试调整搜索条件或选择其他分类</span>
            </div>
          }
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <For each={filtered()}>
              {(expert) => (
                <div
                  class="flex flex-col gap-2 p-3 rounded-lg border border-border-base bg-surface-base hover:bg-surface-raised-stronger-non-alpha hover:border-border-stronger cursor-pointer transition-all duration-200 group"
                  onClick={() => handleSelect(expert.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleSelect(expert.name)}
                >
                  <div class="flex items-center gap-3">
                    <Show
                      when={avatarUrl(expert.avatar)}
                      fallback={
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium shrink-0">
                          {expert.displayName.charAt(0)}
                        </div>
                      }
                    >
                      <img
                        src={avatarUrl(expert.avatar)!}
                        alt={expert.displayName}
                        class="w-10 h-10 rounded-full object-cover shrink-0 border border-border-base"
                        onError={(e) => {
                          const img = e.currentTarget
                          img.style.display = "none"
                          const next = img.nextElementSibling
                          if (next) {
                            ;(next as HTMLElement).style.display = "flex"
                          }
                        }}
                      />
                    </Show>
                    <div class="flex-1 min-w-0">
                      <div class="text-14-medium text-text-primary truncate">{expert.displayName}</div>
                      <div class="text-12-regular text-text-weak truncate">{expert.profession || expert.name}</div>
                    </div>
                    <Show when={expert.expertType !== "agent"}>
                      <span class="text-11-regular text-text-weak px-1.5 py-0.5 rounded bg-surface-raised-non-alpha shrink-0">
                        {TYPE_EMOJIS[expert.expertType] || ""} {TYPE_LABELS[expert.expertType] || expert.expertType}
                      </span>
                    </Show>
                  </div>
                  <Show when={expert.description}>
                    <div class="text-12-regular text-text-weak line-clamp-2">{expert.description}</div>
                  </Show>
                  <Show when={expert.tags.length > 0}>
                    <div class="flex flex-wrap gap-1">
                      <For each={expert.tags.slice(0, 3)}>
                        {(tag) => (
                          <span class="text-11-regular text-text-weak px-1.5 py-0.5 rounded bg-surface-raised-non-alpha">
                            {tag}
                          </span>
                        )}
                      </For>
                      <Show when={expert.tags.length > 3}>
                        <span class="text-11-regular text-text-weak px-1.5 py-0.5 rounded bg-surface-raised-non-alpha">
                          +{expert.tags.length - 3}
                        </span>
                      </Show>
                    </div>
                  </Show>
                  <div class="flex items-center gap-2 mt-1">
                    <button
                      class="flex-1 py-1.5 px-3 rounded-md bg-accent-primary text-white text-13-medium hover:bg-accent-primary-hover transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(expert.name)
                      }}
                    >
                      选择此专家
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  )
}
