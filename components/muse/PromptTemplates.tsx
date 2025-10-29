"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Sparkles, Copy } from "lucide-react"

const templates = [
  {
    id: 1,
    title: "夏のノスタルジア",
    category: "melody",
    prompt: "夏の夕暮れをイメージした、ノスタルジックで切ないメロディを生成してください。BPM90-100程度、キーはC majorで。",
    tags: ["メロディ", "ノスタルジック", "夏"],
    uses: 45,
  },
  {
    id: 2,
    title: "都市の夜景",
    category: "lyrics",
    prompt: "都市の夜景を眺めながら過ごす静かな夜をテーマにした歌詞を作成してください。孤独感と希望が混ざり合う雰囲気で。",
    tags: ["歌詞", "都会", "夜"],
    uses: 32,
  },
  {
    id: 3,
    title: "ジャズコード進行",
    category: "chord",
    prompt: "モダンジャズ風のコード進行を提案してください。II-V-Iを基本に、テンションノートを効果的に使った洗練された進行で。",
    tags: ["コード", "ジャズ", "洗練"],
    uses: 28,
  },
  {
    id: 4,
    title: "アブストラクトアート",
    category: "artwork",
    prompt: "抽象的で幻想的なアートワークを生成してください。青と紫を基調とした、宇宙的で神秘的な雰囲気のビジュアル。",
    tags: ["アート", "抽象", "幻想"],
    uses: 51,
  },
]

const categoryConfig: Record<string, { icon: string; color: string }> = {
  melody: { icon: "🎵", color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800" },
  lyrics: { icon: "📝", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" },
  chord: { icon: "🎹", color: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" },
  artwork: { icon: "🎨", color: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800" },
}

export function PromptTemplates() {
  const handleCopyTemplate = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
  }

  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-8 py-6 border-b border-border">
        <div>
          <h3 className="text-base font-medium text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            プロンプトテンプレート
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            よく使うプロンプトをワンクリックで使用
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          テンプレート管理
        </Button>
      </div>

      <div className="p-8 space-y-4">
        {templates.map((template) => {
          const config = categoryConfig[template.category]
          return (
            <div
              key={template.id}
              className="group p-5 rounded-sm border border-border hover:border-primary/40 hover:bg-accent/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <h4 className="font-medium text-foreground">{template.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {template.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="neutral"
                          size="xs"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {template.uses}回使用
                  </span>
                  <button
                    onClick={() => handleCopyTemplate(template.prompt)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-sm hover:bg-primary/10 transition-all"
                  >
                    <Copy className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                {template.prompt}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
