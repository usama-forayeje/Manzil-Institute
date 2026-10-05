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
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  LucideIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { convertEnglishToBengali } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FeatureTableProps {
  table: ReactTable<any>;
  isLoading: boolean;
  emptyIcon: LucideIcon;
  emptyText: string;
  emptySubtext?: string;
  columnCount: number;
  showPagination?: boolean;
}

export function FeatureTable({
  table,
  isLoading,
  emptyIcon: EmptyIcon,
  emptyText,
  emptySubtext,
  columnCount,
  showPagination
}: FeatureTableProps) {
  const pageIndex = table.getState().pagination?.pageIndex ?? 0;
  const pageSize = table.getState().pagination?.pageSize ?? 15;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const pageCount = Math.max(1, table.getPageCount());
  const hasPagination = showPagination ?? (table.getPageCount() > 1 || totalRows > pageSize);

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

          {hasPagination && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="kalpurush-font font-medium">প্রতি পৃষ্ঠায়:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => table.setPageSize(Number(val))}
                >
                  <SelectTrigger className="h-8 w-[72px] text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 15, 25, 50, 100].map((size) => (
                      <SelectItem key={size} value={String(size)} className="text-xs">
                        {convertEnglishToBengali(size)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-zinc-400 kalpurush-font">
                  (মোট {convertEnglishToBengali(totalRows)} জনের মধ্যে {convertEnglishToBengali(startRow)}-{convertEnglishToBengali(endRow)} দেখানো হচ্ছে)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-[#00AEEF]/10 hover:text-[#00AEEF] disabled:opacity-30"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  title="প্রথম পৃষ্ঠা"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-[#00AEEF]/10 hover:text-[#00AEEF] disabled:opacity-30"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  title="পূর্ববর্তী পৃষ্ঠা"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="px-3 py-1 font-medium text-xs text-zinc-600 dark:text-zinc-400 kalpurush-font">
                  পৃষ্ঠা {convertEnglishToBengali(pageIndex + 1)} / {convertEnglishToBengali(pageCount)}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-[#00AEEF]/10 hover:text-[#00AEEF] disabled:opacity-30"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  title="পরবর্তী পৃষ্ঠা"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-[#00AEEF]/10 hover:text-[#00AEEF] disabled:opacity-30"
                  onClick={() => table.setPageIndex(pageCount - 1)}
                  disabled={!table.getCanNextPage()}
                  title="শেষ পৃষ্ঠা"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
