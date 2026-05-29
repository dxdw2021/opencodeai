import { Component, createSignal, createMemo, Show, For, onMount } from "solid-js"
import { useLocal } from "@/context/local"
import { useDialog } from "@opencode-ai/ui/context/dialog"
import { Button } from "@opencode-ai/ui/button"
import { Icon } from "@opencode-ai/ui/icon"
import { Dialog } from "@opencode-ai/ui/dialog"
import { useSync } from "@/context/sync"
import { useServer } from "@/context/server"

// 专家分类数据
const EXPERT_CATEGORIES = [
  { id: "all", name: "全部专家", icon: "dot-grid" },
  { id: "13-TencentZone", name: "腾讯专区", icon: "server" },
  { id: "01-ProductDesign", name: "产品设计", icon: "pencil-line" },
  { id: "02-Engineering", name: "技术工程", icon: "code" },
  { id: "08-FinanceInvestment", name: "金融投资", icon: "arrow-up" },
  { id: "03-GameSpatial", name: "游戏空间", icon: "console" },
  { id: "04-DataAI", name: "数据智能", icon: "server" },
  { id: "05-MarketingGrowth", name: "营销增长", icon: "speech-bubble" },
  { id: "06-ContentCreative", name: "内容创作", icon: "pencil-line" },
  { id: "07-SalesCommerce", name: "销售商务", icon: "folder-add-left" },
  { id: "09-OperationsHR", name: "运营人力", icon: "bubble-5" },
  { id: "10-ProjectQuality", name: "项目质量", icon: "circle-check" },
  { id: "11-SecurityCompliance", name: "法务安全", icon: "circle-ban-sign" },
  { id: "12-IndustryConsultant", name: "行业顾问", icon: "folder" },
] as const

// manifest 条目接口
interface ManifestEntry {
  id: string
  categoryId: string
  displayName: { zh?: string; en?: string }
  profession: { zh?: string; en?: string }
  description: { zh?: string; en?: string }
  agentName?: string
  expertType: string
  avatar?: string
  tags?: { zh?: string; en?: string }[]
}

// 专家数据接口
interface Expert {
  id: string
  name: string
  displayName: string
  profession: string
  description: string
  category: string
  avatar?: string
  tags?: string[]
}

// 解析专家数据
function parseExpertData(agents: any[], manifestLookup: Record<string, ManifestEntry>): Expert[] {
  return agents
    .filter((agent) => agent.mode !== "subagent" && !agent.hidden)
    .map((agent) => {
      const rich = manifestLookup[agent.name]
      const displayName = rich?.displayName?.zh || agent.name
      const profession = rich?.profession?.zh || rich?.profession?.en || agent.name
      const description = rich?.description?.zh || agent.description || ""
      const tags = (rich?.tags || []).map((t) => t.zh || t.en || "")
      const avatar = rich?.avatar || undefined
      const categoryId = rich?.categoryId

      let category = categoryId || "02-Engineering"
      // fallback: 根据名称和描述推断分类
      if (!categoryId) {
        const nameAndDesc = `${agent.name} ${agent.description || ""}`.toLowerCase()
        if (
          nameAndDesc.includes("产品") ||
          nameAndDesc.includes("设计") ||
          nameAndDesc.includes("ui") ||
          nameAndDesc.includes("ux")
        ) {
          category = "01-ProductDesign"
        } else if (
          nameAndDesc.includes("金融") ||
          nameAndDesc.includes("投资") ||
          nameAndDesc.includes("财务") ||
          nameAndDesc.includes("会计")
        ) {
          category = "08-FinanceInvestment"
        } else if (
          nameAndDesc.includes("游戏") ||
          nameAndDesc.includes("unity") ||
          nameAndDesc.includes("unreal") ||
          nameAndDesc.includes("godot")
        ) {
          category = "03-GameSpatial"
        } else if (
          nameAndDesc.includes("数据") ||
          nameAndDesc.includes("ai") ||
          nameAndDesc.includes("机器学习") ||
          nameAndDesc.includes("分析")
        ) {
          category = "04-DataAI"
        } else if (
          nameAndDesc.includes("营销") ||
          nameAndDesc.includes("seo") ||
          nameAndDesc.includes("增长") ||
          nameAndDesc.includes("广告")
        ) {
          category = "05-MarketingGrowth"
        } else if (
          nameAndDesc.includes("内容") ||
          nameAndDesc.includes("创作") ||
          nameAndDesc.includes("视频") ||
          nameAndDesc.includes("文案")
        ) {
          category = "06-ContentCreative"
        } else if (nameAndDesc.includes("销售") || nameAndDesc.includes("商务") || nameAndDesc.includes("电商")) {
          category = "07-SalesCommerce"
        } else if (
          nameAndDesc.includes("运营") ||
          nameAndDesc.includes("人力") ||
          nameAndDesc.includes("招聘") ||
          nameAndDesc.includes("培训")
        ) {
          category = "09-OperationsHR"
        } else if (
          nameAndDesc.includes("项目") ||
          nameAndDesc.includes("敏捷") ||
          nameAndDesc.includes("质量") ||
          nameAndDesc.includes("测试")
        ) {
          category = "10-ProjectQuality"
        } else if (
          nameAndDesc.includes("安全") ||
          nameAndDesc.includes("法务") ||
          nameAndDesc.includes("合规") ||
          nameAndDesc.includes("法律")
        ) {
          category = "11-SecurityCompliance"
        } else if (nameAndDesc.includes("腾讯") || nameAndDesc.includes("微信") || nameAndDesc.includes("小程序")) {
          category = "13-TencentZone"
        } else if (nameAndDesc.includes("创业") || nameAndDesc.includes("医疗") || nameAndDesc.includes("行业")) {
          category = "12-IndustryConsultant"
        }
      }

      return {
        id: agent.name,
        name: agent.name,
        displayName,
        profession,
        description,
        category,
        avatar,
        tags,
      }
    })
}

// 专家卡片组件
const ExpertCard: Component<{
  expert: Expert
  avatarUrl?: string
  onSelect: (expert: Expert) => void
}> = (props) => {
  const [imgError, setImgError] = createSignal(false)
  return (
    <div
      class="flex flex-col gap-2 p-3 rounded-lg border border-border-base bg-surface-base hover:bg-surface-raised-stronger-non-alpha hover:border-border-stronger cursor-pointer transition-all duration-200 group"
      onClick={() => props.onSelect(props.expert)}
    >
      <div class="flex items-center gap-2">
        <Show
          when={props.avatarUrl && !imgError()}
          fallback={
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium shrink-0">
              {props.expert.displayName.charAt(0)}
            </div>
          }
        >
          <img
            src={props.avatarUrl!}
            alt={props.expert.displayName}
            class="w-8 h-8 rounded-full object-cover shrink-0 border border-border-base"
            onError={() => setImgError(true)}
          />
        </Show>
        <div class="flex-1 min-w-0">
          <div class="text-14-medium text-text-primary truncate">{props.expert.displayName}</div>
          <div class="text-12-regular text-text-weak truncate">{props.expert.profession}</div>
        </div>
      </div>
      <Show when={props.expert.description}>
        <div class="text-12-regular text-text-weak line-clamp-2">{props.expert.description}</div>
      </Show>
      <div class="flex items-center gap-1 mt-auto">
        <span class="text-11-regular text-text-weak px-1.5 py-0.5 rounded bg-surface-raised-non-alpha">
          {EXPERT_CATEGORIES.find((c) => c.id === props.expert.category)?.name || "其他"}
        </span>
      </div>
    </div>
  )
}

// 分类标签组件
const CategoryTab: Component<{
  category: { id: string; name: string; icon: string }
  active: boolean
  count: number
  onClick: () => void
}> = (props) => {
  return (
    <button
      class={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-13-regular transition-all duration-200 ${
        props.active
          ? "bg-accent-primary text-white"
          : "bg-surface-raised-non-alpha text-text-secondary hover:bg-surface-raised-stronger-non-alpha"
      }`}
      onClick={props.onClick}
    >
      {/* @ts-ignore - icon names are validated in EXPERT_CATEGORIES */}
      <Icon name={props.category.icon as any} size="small" />
      <span>{props.category.name}</span>
      <span class={`text-11-regular ${props.active ? "text-white/80" : "text-text-weak"}`}>{props.count}</span>
    </button>
  )
}

// 主对话框组件
export const DialogSummonExpert: Component = () => {
  const local = useLocal()
  const dialog = useDialog()
  const sync = useSync()
  const server = useServer()

  const [searchQuery, setSearchQuery] = createSignal("")
  const [selectedCategory, setSelectedCategory] = createSignal("all")
  const [viewMode, setViewMode] = createSignal<"grid" | "list">("grid")
  const [manifest, setManifest] = createSignal<Record<string, ManifestEntry>>({})

  // 从服务器加载 manifest 数据
  onMount(async () => {
    try {
      const resp = await fetch(`${server.url}/experts/manifest.json`)
      if (resp.ok) {
        const data = await resp.json()
        const map: Record<string, ManifestEntry> = {}
        for (const expert of data.experts || []) {
          map[expert.agentName || expert.id] = expert
        }
        setManifest(map)
      }
    } catch (err) {
      console.error("Failed to load expert manifest:", err)
    }
  })

  // 解析专家数据
  const experts = createMemo(() => parseExpertData(sync.data.agent, manifest()))

  // 分类统计
  const categoryCounts = createMemo(() => {
    const counts: Record<string, number> = { all: experts().length }
    experts().forEach((expert) => {
      counts[expert.category] = (counts[expert.category] || 0) + 1
    })
    return counts
  })

  // 过滤专家
  const filteredExperts = createMemo(() => {
    let result = experts()

    // 按分类过滤
    if (selectedCategory() !== "all") {
      result = result.filter((expert) => expert.category === selectedCategory())
    }

    // 按搜索词过滤
    const query = searchQuery().toLowerCase().trim()
    if (query) {
      result = result.filter(
        (expert) =>
          expert.displayName.toLowerCase().includes(query) ||
          expert.name.toLowerCase().includes(query) ||
          expert.profession.toLowerCase().includes(query) ||
          expert.description.toLowerCase().includes(query),
      )
    }

    return result
  })

  // 选择专家
  const handleSelectExpert = (expert: Expert) => {
    local.agent.set(expert.id)
    dialog.close()
  }

  return (
    <Dialog
      title="召唤专家"
      class="w-[800px] max-w-[90vw] h-[600px] max-h-[80vh]"
      action={
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="small" onClick={() => setViewMode(viewMode() === "grid" ? "list" : "grid")}>
            <Icon name={viewMode() === "grid" ? "bullet-list" : "dot-grid"} size="small" />
          </Button>
        </div>
      }
    >
      <div class="flex flex-col h-full gap-4">
        {/* 搜索栏 */}
        <div class="flex items-center gap-2">
          <div class="flex-1 relative">
            <Icon
              name="magnifying-glass"
              size="small"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-text-weak"
            />
            <input
              type="text"
              placeholder="搜索专家名称、职业或描述..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="w-full pl-9 pr-4 py-2 rounded-lg border border-border-base bg-surface-base text-14-regular text-text-primary placeholder:text-text-weak focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20"
              autofocus
            />
            <Show when={searchQuery()}>
              <button
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-weak hover:text-text-secondary"
                onClick={() => setSearchQuery("")}
              >
                <Icon name="close" size="small" />
              </button>
            </Show>
          </div>
        </div>

        {/* 分类标签 */}
        <div class="flex flex-wrap gap-2 pb-2 border-b border-border-base overflow-x-auto">
          <For each={EXPERT_CATEGORIES}>
            {(category) => (
              <CategoryTab
                category={category}
                active={selectedCategory() === category.id}
                count={categoryCounts()[category.id] || 0}
                onClick={() => setSelectedCategory(category.id)}
              />
            )}
          </For>
        </div>

        {/* 专家列表 */}
        <div class="flex-1 overflow-y-auto min-h-0">
          <Show
            when={filteredExperts().length > 0}
            fallback={
              <div class="flex flex-col items-center justify-center h-full gap-2 text-text-weak">
                <Icon name="magnifying-glass" size="large" />
                <span class="text-14-regular">未找到匹配的专家</span>
                <span class="text-12-regular">尝试调整搜索条件或选择其他分类</span>
              </div>
            }
          >
            <div
              class={
                viewMode() === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" : "flex flex-col gap-2"
              }
            >
              <For each={filteredExperts()}>
                {(expert) => {
                  const av = expert.avatar
                  const au = av ? `${server.url}/experts/avatars/${av.replace("/avatars/", "")}` : undefined
                  return <ExpertCard expert={expert} avatarUrl={au} onSelect={handleSelectExpert} />
                }}
              </For>
            </div>
          </Show>
        </div>

        {/* 底部状态栏 */}
        <div class="flex items-center justify-between pt-2 border-t border-border-base">
          <span class="text-12-regular text-text-weak">共 {filteredExperts().length} 位专家可用</span>
          <span class="text-12-regular text-text-weak">按 Enter 选择 · Esc 关闭</span>
        </div>
      </div>
    </Dialog>
  )
}

// 快捷打开函数
export function showSummonExpertDialog(dialog: ReturnType<typeof useDialog>) {
  dialog.show(() => <DialogSummonExpert />)
}
