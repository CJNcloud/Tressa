import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '@/hooks/useTheme'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism } from 'react-syntax-highlighter'

interface CodePreviewProps {
    content: string
    language: string
}

export function CodePreview({ content, language }: CodePreviewProps) {
    const { theme } = useTheme();

    if (language === 'markdown') {
        return (
            <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} max-w-none overflow-auto p-4`}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // @ts-ignore
                        code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '');
                            // ['language-python', 'python']
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
                    {content}
                </ReactMarkdown>
            </div>
        )
    }

    return (
        <SyntaxHighlighter
            language={language}
            style={theme === 'dark' ? tomorrow : oneLight}
            customStyle={{
                margin: 0,
                padding: '1rem',
                borderRadius: '0.375rem',
            }}
        >
            {content}
        </SyntaxHighlighter>
    )
}
