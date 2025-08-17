import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Code, Globe, Lock, FileCode, Save, Settings, MousePointerBan } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_URL } from '@/config'
import { languageOptions } from '@/lib/languageOptions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { TressEditor } from '@/components/TressEditor'


export function CreateTress() {
  const [title, setTitle] = useState('')// 标题
  const [content, setContent] = useState('')// 内容
  const [language, setLanguage] = useState('plaintext')// 编程语言
  const [isPublic, setIsPublic] = useState(true)// 是否公开
  const [error, setError] = useState('')// 错误信息
  const [activeTab, setActiveTab] = useState('edit') // 当前激活的标签
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return
      }
      const response = await fetch(`${API_URL}/api/tress/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, language, is_public: isPublic }),
      })
      if (response.ok) {
        const data = await response.json();
        console.log(data.id);
        navigate(`/tress/${data.id}`);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to create tress');
      }
    } catch (err) {
      setError('An error occurred while creating the tress')
    }
  }

  return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Create New Tress</h1>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editor Settings</DialogTitle>
                  <DialogDescription>
                    Customize your editor
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <MousePointerBan className="h-5 w-5"/>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4"/>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Title
              </Label>
              <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public" className="flex items-center gap-2">
              {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {isPublic ? 'Public' : 'Private'}
            </Label>
          </div>
          <TressEditor
              content={content}
              language={language}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setContent={setContent}
          />
          <Button type="submit" className="w-full flex items-center justify-center gap-2">
            <Save className="h-4 w-4" />
            Create Tress
          </Button>
        </form>
      </div>
  )
}

