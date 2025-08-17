import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AlertCircle, Copy, ArrowUp, ChevronLeft, Trash2, Type, ZoomIn, ZoomOut, RotateCcw, Check } from 'lucide-react'
import {Prism, Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { tomorrow, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Tress } from '@/types'
import { API_URL } from '@/config'
import { useTheme } from '@/hooks/useTheme'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ViewTress() {
  const [tress, setTress] = useState<Tress | null>(null)
  const [error, setError] = useState('')
  const [fontSize, setFontSize] = useState(16)
  const [wordCount, setWordCount] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [userCanDelete, setUserCanDelete] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { theme } = useTheme()
  useEffect(() => {
    const fetchTress = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/api/tress/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setTress(data)
          setWordCount(data.content.trim().split(/\s+/).length)
          const currentUserId = localStorage.getItem('userId')
          console.log('currentUserId'+currentUserId)
          console.log('owner='+data.owner_id.toString());
          setUserCanDelete(currentUserId === data.owner_id.toString())
        } else {
          setError('Failed to fetch tress')
        }
      } catch (err) {
        setError('An error occurred while fetching the tress')
      }
    }
    fetchTress()
  }, [id])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/tress/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        navigate('/')
      } else {
        setError('Failed to delete tress')
      }
    } catch (err) {
      setError('An error occurred while deleting the tress')
    }
  }

  const handleCopy = useCallback(() => {
    if (tress) {
      navigator.clipboard.writeText(tress.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }, [tress])

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize)
  }

  if (error) {
    return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (!tress) {
    return <div>Loading...</div>
  }

  return (
      <Card className="max-w-4xl mx-auto my-8">
        <CardHeader className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">{tress.title}</CardTitle>
              <CardDescription>By {tress.owner_username}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{tress.language}</Badge>
              <span className="text-sm text-muted-foreground">Words: {wordCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: isCopied ? 'var(--primary)' : 'transparent',
                    color: isCopied ? 'var(--primary-foreground)' : 'inherit',
                  }}
              >
                {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
              {userCanDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your tress.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4 bg-secondary p-2 rounded-md">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => handleFontSizeChange(Math.max(12, fontSize - 1))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleFontSizeChange(Math.min(24, fontSize + 1))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleFontSizeChange(16)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <span className="text-sm">
              <Type className="h-4 w-4 inline mr-1" />
                {fontSize}px
            </span>
            </div>
          </div>
          {tress.language === 'markdown' ?
              <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} max-w-none overflow-auto p-4 `} style={{fontSize}}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // @ts-ignore
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                            <Prism
                                // @ts-ignore
                                style={tomorrow}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </Prism>
                        ) : (
                            <code
                                className="rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
                                {...props}
                            >
                              {children}
                            </code>
                        )
                      }
                    }}
                >
                  {tress.content}
                </ReactMarkdown>
              </div>
              :
              <SyntaxHighlighter
                  language={tress.language.toLowerCase()}
                  style={theme === 'dark' ? tomorrow : oneLight}
                  customStyle={{fontSize: '${fontSize}px'}}
                  className="rounded-md"
              >
                {tress.content}
              </SyntaxHighlighter>

          }

        </CardContent>
        {showBackToTop && (
            <Button
                className="fixed bottom-4 right-4 transition-opacity duration-300 ease-in-out"
                onClick={handleBackToTop}
                style={{opacity: showBackToTop ? 1 : 0}}
            >
              <ArrowUp className="h-4 w-4"/>
            </Button>
        )}
      </Card>
  )
}

