import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoonIcon, SunIcon, HomeIcon, PlusCircleIcon , UserIcon } from 'lucide-react'
import { useTheme } from "@/hooks/useTheme"
import { VERSION_CODE, APP_VERSION } from '@/config'
import { useAuth } from '@/hooks/useAuth'
interface LayoutProps {
    children: ReactNode
}
export function Layout({ children }: LayoutProps) {
    const { theme, setTheme } = useTheme();
    const { isLoggedIn, username, logout } = useAuth(); // 从上下文获取状态
    const navigate = useNavigate()
    const handleLogout = () => {
        logout()
        navigate('/')
    }
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-primary ml-2">Tressa</Link>
                    </div>
                    <nav className="hidden md:flex items-center space-x-4">
                        <Link to="/">
                            <Button variant="ghost" className="w-full justify-start">
                                <HomeIcon className="mr-2 h-4 w-4" />
                                Home
                            </Button>
                        </Link>
                        {isLoggedIn && (
                            <Link to="/create">
                                <Button variant="ghost" className="w-full justify-start">
                                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                                    Create
                                </Button>
                            </Link>
                        )}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        >
                            {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Avatar>
                                        <AvatarFallback>{username ? username[0].toUpperCase() : <UserIcon className="h-5 w-5" />}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center">
                                {isLoggedIn ? (
                                    <>
                                        <DropdownMenuItem onSelect={() => navigate('/profile')}>Profile</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem onSelect={() => navigate('/login')}>Login</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => navigate('/register')}>Register</DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t ">
                <div className="container mx-auto px-4 py-4 text-center text-muted-foreground">
                    Version {APP_VERSION}({VERSION_CODE}) - Tressa is now in very early stages of development.
                </div>
            </footer>
        </div>
    )
}
