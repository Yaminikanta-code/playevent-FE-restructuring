import { Bell } from 'lucide-react'
import { Button } from './common'

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-4 sm:px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" className="h-9 w-9 sm:h-10 sm:w-10">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </header>
    </>
  )
}
