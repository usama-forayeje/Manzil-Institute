'use client';

import React from 'react';
import { 
  flexRender, 
  type Table as ReactTable,
} from '@tanstack/react-table';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from 'lucide-react';

interface FeatureTableProps {
  table: ReactTable<any>;
  isLoading: boolean;
  emptyIcon: LucideIcon;
  emptyText: string;
  emptySubtext?: string;
  columnCount: number;
}

export function FeatureTable({
  table,
  isLoading,
  emptyIcon: EmptyIcon,
  emptyText,
  emptySubtext,
  columnCount
}: FeatureTableProps) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-zinc-200/50 dark:shadow-none min-h-[400px]">
      {isLoading ? (
        <div className="p-8 space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl shadow-sm" />)}
        </div>
      ) : table.getRowModel().rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-24 text-center space-y-6">
          <div className="h-20 w-20 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center animate-pulse">
            <EmptyIcon className="h-10 w-10 text-zinc-200 dark:text-zinc-700" />
          </div>
          <div className="space-y-1">
            <p className="kalpurush-font text-lg font-black text-zinc-400">{emptyText}</p>
            {emptySubtext && <p className="text-xs text-zinc-400 tracking-tight">{emptySubtext}</p>}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="border-zinc-200/50 dark:border-zinc-800/50 hover:bg-transparent">
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="h-14 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 kalpurush-font">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="border-zinc-100/50 dark:border-zinc-900/50 hover:bg-[#00AEEF]/[0.03] transition-all group">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-5 px-6 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
