import { useEffect, useRef, useState } from 'react'
import * as monaco from 'monaco-editor'
import { useTheme } from '@/hooks/useTheme'
interface MonacoEditorProps {
    language: string
    value: string
    onChange: (value: string) => void
    height: string
}

export function MonacoEditor({ language, value, onChange, height}: MonacoEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const { theme } = useTheme()
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)

    useEffect(() => {
        if (editorRef.current) {
            const newEditor = monaco.editor.create(editorRef.current, {
                value,
                language,
                theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
                minimap: { enabled: false },
                automaticLayout: true,
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                cursorStyle: 'line',
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                tabCompletion: 'on',
                parameterHints: {
                    enabled: true,
                },
                quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true,
                },
            })

            setEditor(newEditor)

            newEditor.onDidChangeModelContent(() => {
                onChange(newEditor.getValue())
            })

            return () => {
                newEditor.dispose()
            }
        }
    }, [language, onChange, theme])

    useEffect(() => {
        if (editor) {
            monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs-light')
        }
    }, [theme, editor])

    return (
        <div className="flex flex-col">
            <div ref={editorRef} style={{ height }} />
        </div>
    )
}

