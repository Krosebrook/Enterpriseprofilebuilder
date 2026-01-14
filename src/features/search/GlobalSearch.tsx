import React, { useEffect, useState } from 'react';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator,
  CommandShortcut 
} from '../../../components/ui/command';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useSearch } from '../../../hooks/useSearch';
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  CreditCard, 
  ShieldCheck, 
  BookOpen,
  Zap
} from 'lucide-react';
import { Section } from '../../../types';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const { setActiveSection, searchQuery, setSearchQuery } = useNavigation();
  const { results } = useSearch(searchQuery);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 bg-slate-100 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer w-64 transition-colors"
      >
        <span className="flex-1">Search documentation...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Type a command or search..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {!searchQuery && (
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={() => runCommand(() => setActiveSection('overview'))}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setActiveSection('agents'))}>
                <Zap className="mr-2 h-4 w-4" />
                <span>Agent Builder</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setActiveSection('best-practices'))}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Best Practices</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setActiveSection('governance'))}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Governance</span>
              </CommandItem>
            </CommandGroup>
          )}

          {searchQuery && results.length > 0 && (
            <CommandGroup heading="Documentation & Features">
              {results.map((result) => (
                <CommandItem 
                  key={result.id}
                  onSelect={() => runCommand(() => setActiveSection(result.section))}
                  value={result.title}
                >
                  <BookOpen className="mr-2 h-4 w-4 text-slate-400" />
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    <span className="text-xs text-slate-400 truncate max-w-[300px]">{result.content.substring(0, 50)}...</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />
          
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => runCommand(() => setActiveSection('settings' as Section))}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setActiveSection('settings' as Section))}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setActiveSection('settings' as Section))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
