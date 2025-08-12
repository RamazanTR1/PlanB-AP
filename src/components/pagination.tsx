import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

type PaginationBarProps = {
  page: number; // 0-indexed
  totalPages: number; // can be 0
  onPageChange: (nextPage: number) => void;
  className?: string;
};

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationBarProps) {
  const canGoPrev = page > 0 && totalPages !== 0;
  const canGoNext = totalPages > 0 && page < totalPages - 1;

  const currentDisplay = totalPages > 0 ? page + 1 : 0;

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Sayfa</span>
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-200"
          >
            {currentDisplay} / {totalPages}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!canGoPrev}
            className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoNext}
            className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
          >
            Sonraki
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaginationBar;
